import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Vercel Serverless Function
export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { brandName, url } = request.body || {};

  if (!brandName || !url) {
    return response.status(400).json({ error: 'Missing brandName or url in request body.' });
  }

  // --- ADIM 1: Sitenin gerçek içeriğini çek ---
  let pageContent = '';
  let pageTitle = '';
  let metaDescription = '';
  let hasSchema = false;
  let hasOpenGraph = false;
  let h1Tags: string[] = [];
  let h2Tags: string[] = [];

  try {
    const siteResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-MARK-GEO-Bot/1.0; +https://ai-mark.geo)',
        'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (siteResponse.ok) {
      const html = await siteResponse.text();

      // Title
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) pageTitle = titleMatch[1].trim().replace(/\s+/g, ' ');

      // Meta description
      const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
      if (metaMatch) metaDescription = metaMatch[1].trim();

      // H1 tags
      const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
      h1Tags = h1Matches.slice(0, 3).map(m => m[1].replace(/<[^>]+>/g, '').trim());

      // H2 tags
      const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
      h2Tags = h2Matches.slice(0, 5).map(m => m[1].replace(/<[^>]+>/g, '').trim());

      // Schema.org varlığı
      hasSchema = html.includes('application/ld+json') || html.includes('schema.org');

      // Open Graph varlığı
      hasOpenGraph = html.includes('og:title') || html.includes('og:description');

      // Temizlenmiş metin (ilk 1500 karakter)
      const cleanText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1500);

      pageContent = cleanText;
    }
  } catch (fetchError) {
    console.warn('[analyze] Site fetch failed, proceeding with brand name only:', fetchError);
  }

  // --- ADIM 2: Gemini'ye zengin context ile gönder ---
  const siteContextSection = pageContent
    ? `
## Site İçeriği (Gerçek Veriler):
- **Sayfa Başlığı (Title):** ${pageTitle || 'Bulunamadı'}
- **Meta Açıklama:** ${metaDescription || 'Bulunamadı'}
- **H1 Başlıkları:** ${h1Tags.length > 0 ? h1Tags.join(' | ') : 'Bulunamadı'}
- **H2 Başlıkları:** ${h2Tags.length > 0 ? h2Tags.join(' | ') : 'Bulunamadı'}
- **Schema.org İşaretlemesi:** ${hasSchema ? '✅ Var' : '❌ Yok'}
- **Open Graph Tag'leri:** ${hasOpenGraph ? '✅ Var' : '❌ Yok'}
- **Sayfa İçeriği Özeti:** ${pageContent.slice(0, 600)}...
`
    : `(Site içeriği çekilemedi — yalnızca marka adı üzerinden analiz yapılıyor.)`;

  const prompt = `
Sen AI-MARK GEO platformunun kıdemli GEO (Generative Engine Optimization) analistisisin.
Aşağıdaki marka ve web sitesini, yapay zeka modellerinin (ChatGPT, Google Gemini, Claude, Perplexity) perspektifinden derinlemesine analiz et.

## Analiz Edilecek Marka:
- **Marka Adı:** ${brandName}
- **Web Sitesi URL:** ${url}

${siteContextSection}

## Analiz Görevin:
Yukarıdaki gerçek site verilerini ve markanın sektörünü baz alarak şunları ölç:

1. **Genel AI Görünürlük Skoru (overall):** 0-100 (AI modelleri bu markayı ne kadar iyi biliyor ve öneriyor?)
2. **Alt Skorlar (0-100):**
   - recall: AI modellerinin markayı ne sıklıkla "hatırlayıp" bahsettiği
   - sentiment: AI'ın markaya karşı duygu tonu (olumlu/nötr/olumsuz)
   - authority: Markanın dijital otoritesi (backlink kalitesi, marka büyüklüğü)
   - trust: Güvenilirlik (E-E-A-T: Deneyim, Uzmanlık, Yetkinlik, Güvenilirlik)
   - visibility: Rakiplerine göre genel görünürlük
   - eeat: Google ve AI modellerinin E-E-A-T kritereleri (0-100)
   - schemaMarkup: Yapısal veri / Schema.org kullanımı kalitesi (0-100)
   - contentQuality: İçerik derinliği, özgünlüğü ve AI tarafından özetlenebilirliği (0-100)
3. **summary:** AI modellerinin bu markayı nasıl gördüğünü 2-3 cümleyle özetle. Türkçe yaz.
4. **chatGptPerception:** ChatGPT bir kullanıcı "bu sektörde en iyi araç nedir?" diye sorsaydı bu markayı nasıl değerlendirirdi? 2 cümle. Türkçe yaz.
5. **weaknesses:** Markanın AI dünyasındaki en kritik 4-5 eksikliği. Türkçe, madde madde.
6. **recommendations:** 5-6 adet somut, önceliklendirilmiş GEO aksiyon önerisi. Türkçe, madde madde.
7. **competitors:** Bu markanın sektöründeki, AI modellerinin daha sık önerdiği 3-4 rakip marka adı (sadece isim, URL değil).
8. **analyzedPageContent:** Analizde kullandığın site içeriğinin kısa özeti (1 cümle, Türkçe).

Cevabı yalnızca belirtilen JSON şemasında döndür.
`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-pro-preview-03-25',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brandName: { type: Type.STRING },
            url: { type: Type.STRING },
            score: {
              type: Type.OBJECT,
              properties: {
                overall: { type: Type.NUMBER },
                recall: { type: Type.NUMBER },
                sentiment: { type: Type.NUMBER },
                authority: { type: Type.NUMBER },
                trust: { type: Type.NUMBER },
                visibility: { type: Type.NUMBER },
                eeat: { type: Type.NUMBER },
                schemaMarkup: { type: Type.NUMBER },
                contentQuality: { type: Type.NUMBER },
              },
              required: ["overall", "recall", "sentiment", "authority", "trust", "visibility", "eeat", "schemaMarkup", "contentQuality"]
            },
            summary: { type: Type.STRING },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            chatGptPerception: { type: Type.STRING },
            competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
            analyzedPageContent: { type: Type.STRING },
          },
          required: ["brandName", "url", "score", "summary", "weaknesses", "recommendations", "chatGptPerception", "competitors", "analyzedPageContent"]
        }
      }
    });

    const data = JSON.parse(result.text || '{}');
    return response.status(200).json(data);
  } catch (error: any) {
    console.error('API Error during analyze:', error);
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
