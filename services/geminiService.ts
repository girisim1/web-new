import { AnalysisResult } from "../types";

// Dev ortamında da site içeriği GET edilerek Gemini'ye gönderilir.
// Production'da ise Vercel Serverless Function (api/analyze.ts) kullanılır.
export const analyzeBrandVisibility = async (brandName: string, url: string, userId?: string): Promise<AnalysisResult> => {
  if (import.meta.env.DEV && import.meta.env.VITE_GEMINI_API_KEY) {
    console.log("[Dev Mode] İstemci tarafı doğrudan analiz başlatılıyor...");
    const { GoogleGenAI, Type } = await import("@google/genai");
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    // Dev ortamında site içeriği doğrudan fetch edilemiyor (CORS).
    // Bu yüzden prompt'a URL'yi ve marka adını verip Gemini'nin kendi bilgisine dayanmasını sağlıyoruz.
    // Production'daki gerçek scraping Vercel Serverless Function üzerinden yapılır.
    const prompt = `
Sen AI-MARK GEO platformunun kıdemli GEO (Generative Engine Optimization) analistisisin.
Aşağıdaki marka ve web sitesini, yapay zeka modellerinin (ChatGPT, Google Gemini, Claude, Perplexity) perspektifinden derinlemesine analiz et.

## Analiz Edilecek Marka:
- **Marka Adı:** ${brandName}
- **Web Sitesi URL:** ${url}

## Analiz Görevin:
Bu marka ve URL hakkındaki bilgilerini ve sektörel bağlamı kullanarak şunları ölç:

1. **Genel AI Görünürlük Skoru (overall):** 0-100
2. **Alt Skorlar (0-100):**
   - recall, sentiment, authority, trust, visibility
   - eeat: E-E-A-T kriterleri (0-100)
   - schemaMarkup: Yapısal veri / Schema.org kalitesi tahmini (0-100)
   - contentQuality: İçerik derinliği ve AI tarafından özetlenebilirlik (0-100)
3. **summary:** AI modellerinin bu markayı nasıl gördüğünü 2-3 cümleyle özetle. Türkçe yaz.
4. **chatGptPerception:** ChatGPT "bu sektörde en iyi araç nedir?" diye sorsaydı bu markayı nasıl değerlendirirdi? 2 cümle. Türkçe yaz.
5. **weaknesses:** Markanın AI dünyasındaki en kritik 4-5 eksikliği. Türkçe, madde madde.
6. **recommendations:** 5-6 adet somut, önceliklendirilmiş GEO aksiyon önerisi. Türkçe, madde madde.
7. **competitors:** Bu markanın sektöründeki, AI modellerinin daha sık önerdiği 3-4 rakip marka adı.
8. **analyzedPageContent:** "Analiz, ${url} domain bilgisi ve ${brandName} marka ismi üzerinden yapılmıştır." yaz.
`;

    const response = await ai.models.generateContent({
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

    return JSON.parse(response.text || '{}');
  }

  // Production Ortamı (Vercel) — gerçek site scraping + Gemini analizi
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandName, url, userId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Analiz başarısız oldu: ' + res.statusText);
  }

  return await res.json();
};
