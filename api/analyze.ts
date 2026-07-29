import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';
import Groq from "groq-sdk";

const supabase = createClient(
  process.env.MY_SUPABASE_URL!,
  process.env.MY_SUPABASE_SERVICE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

const { brandName, url, userId, sector } = request.body || {};

  if (!brandName || !url) {
    return response.status(400).json({ error: 'Missing brandName or url in request body.' });
  }

  let pageContent = '';
  try {
    const siteResponse = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (siteResponse.ok) {
      const html = await siteResponse.text();
      pageContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1500);
    }
  } catch (e) {
    console.warn('Site fetch failed');
  }

  // ===== İKİNCİ ANALİZ: Rekabet + Kriter + Sinyal =====
  const competitionPrompt = `
Sen bir pazar ve rekabet analistisin.
Marka: ${brandName}
Sektör: ${sector || 'Genel'}
URL: ${url}

Bu markanın sektöründeki AI görünürlük rekabetini analiz et. GERÇEKÇİ ol — bu sektördeki gerçek rakip markaları kullan.

Aşağıdaki JSON formatında yanıt ver:
{
  "ranking": [
    {"brand": "Gerçek rakip marka adı", "score": 0-100, "trend": "+2 veya -1 gibi", "me": false},
    {"brand": "${brandName}", "score": 0-100, "trend": "+3", "me": true}
  ],
  "reasons": [
    {"type": "bad", "title": "Kısa başlık", "desc": "Bu marka neden rakiplerinin gerisinde — spesifik teknik/içerik sebebi, 1-2 cümle"},
    {"type": "bad", "title": "Kısa başlık", "desc": "İkinci sebep"},
    {"type": "good", "title": "Kısa başlık", "desc": "Bu markanın güçlü olduğu bir yön"}
  ],
  "criteria": [
    {"name": "Kriter adı (örn: Fiyat/Performans)", "val": 0-100},
    {"name": "İkinci kriter", "val": 0-100},
    {"name": "Üçüncü kriter", "val": 0-100},
    {"name": "Dördüncü kriter", "val": 0-100}
  ],
  "signals": [
    {"title": "Pozitif yorum oranı", "val": "%XX", "color": "#22c55e"},
    {"title": "En çok geçen kelime", "val": "kelime", "color": "#22d3ee"},
    {"title": "Şikayet konusu", "val": "konu", "color": "#ef4444"},
    {"title": "AI önerme oranı", "val": "5 sorgudan X'inde", "color": "#a855f7"}
  ]
}

KURALLAR:
- ranking listesinde markayı gerçek rakiplerinin arasına doğru skorla yerleştir (5-6 marka)
- ranking'i skora göre büyükten küçüğe sırala
- criteria: bu sektörde müşterilerin/AI'ların önem verdiği gerçek kriterler
- signals: gerçekçi tahminler
Sadece JSON döndür, başka bir şey yazma.
`;
  const prompt = `
Sen GEO (Generative Engine Optimization) analistisisin.
Marka: ${brandName}
URL: ${url}
Site içeriği: ${pageContent || 'Çekilemedi'}

ÖNEMLİ: Öneriler ve eksikler MUTLAKA spesifik ve uygulanabilir olmalı.
Genel tavsiyeler YASAK. Her öneri şu formatta olmalı:
- Ne değiştirilmeli (tam olarak)
- Neden (AI'a etkisi)
- Nasıl (kısa teknik adım)

Örnek DOĞRU öneri: "H1 başlığınızı 'Hizmetlerimiz' yerine 'Ankara Boşanma Avukatı | 20 Yıllık Deneyim' yapın — ChatGPT coğrafi sorgularda sizi %40 daha sık önerir"
Örnek YANLIŞ öneri: "Sosyal medyaya önem verin"

Aşağıdaki JSON formatında analiz yap:
{
  "brandName": "${brandName}",
  "url": "${url}",
  "score": {
    "overall": 0-100,
    "recall": 0-100,
    "sentiment": 0-100,
    "authority": 0-100,
    "trust": 0-100,
    "visibility": 0-100,
    "eeat": 0-100,
    "schemaMarkup": 0-100,
    "contentQuality": 0-100
  },
  "summary": "Türkçe 2-3 cümle — AI modellerinin bu siteyi nasıl gördüğü",
  "chatGptPerception": "ChatGPT bu sektörde en iyi kim diye sorulsa bu markayı nasıl değerlendirir? 2 cümle Türkçe",
  "weaknesses": [
    "Spesifik eksiklik 1 — örn: Schema.org/LegalService markup eksik, ChatGPT sizi hukuk bürosu olarak tanımıyor",
    "Spesifik eksiklik 2",
    "Spesifik eksiklik 3",
    "Spesifik eksiklik 4"
  ],
  "recommendations": [
    "Spesifik öneri 1 — ne yapılacak + neden + nasıl",
    "Spesifik öneri 2",
    "Spesifik öneri 3",
    "Spesifik öneri 4",
    "Spesifik öneri 5"
  ],
  "competitors": ["rakip1", "rakip2", "rakip3"],
  "analyzedPageContent": "Türkçe 1 cümle özet",
  "generatedSchema": "Bu site için schema.org JSON-LD markup kodu üret. Sitenin türüne uygun (LegalService, LocalBusiness, Organization vb.) tam ve geçerli bir JSON-LD kodu olsun. Sadece kod, açıklama yok.",
  "generatedLlmsTxt": "Bu site için llms.txt dosya içeriği üret. Markanın adı, ne yaptığı, ana sayfaları ve önemli bilgileri içeren, AI crawler'ların okuyacağı düz metin formatında bir llms.txt içeriği."
}
Sadece JSON döndür, başka bir şey yazma.
`;

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const data = JSON.parse(result.choices[0].message.content || '{}');
    // ===== İKİNCİ ANALİZ ÇAĞRISI: Rekabet analizi =====
    try {
      const competitionResult = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: competitionPrompt }],
        response_format: { type: 'json_object' }
      });
      const competitionData = JSON.parse(competitionResult.choices[0].message.content || '{}');
      
      // Rekabet verisini ana sonuca ekle
      data.ranking = competitionData.ranking || [];
      data.reasons = competitionData.reasons || [];
      data.criteria = competitionData.criteria || [];
      data.signals = competitionData.signals || [];
    } catch (e) {
      console.warn('Rekabet analizi başarısız:', e);
      data.ranking = [];
      data.reasons = [];
      data.criteria = [];
      data.signals = [];
    }
    let groqScore = null;
    try {
      const groqResult = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });
      const groqData = JSON.parse(groqResult.choices[0].message.content || '{}');
      groqScore = groqData.score?.overall || null;
    } catch (e) {
      console.warn('Groq analizi başarısız:', e);
    }
     // İki modelin ortalamasını al (Groq çalıştıysa)
    if (groqScore !== null && data.score) {
      const openaiScore = data.score.overall;
      data.score.overall = Math.round((openaiScore + groqScore) / 2);
      data.modelScores = {
        openai: openaiScore,
        llama: groqScore
      };
    }

    try {
      await supabase.from('site_analyses').insert({
        url: url,
        ai_model: 'gpt-4o-mini',
        brand_score: data.score?.overall || 0,
        ai_readiness_score: data.score?.visibility || 0,
        recommendations: data.recommendations || [],
        raw_analysis: data,
        user_id: userId || null
      });
    } catch (e) {
      console.warn('Supabase kayıt hatası:', e);
    }

    // ===== BORSA GEÇMİŞİNE SKOR KAYDET =====
    try {
      await supabase.from('brand_score_history').insert({
        brand_name: brandName,
        sector: sector || null,
        score: data.score?.overall || 0,
        user_id: userId || null
      });
    } catch (e) {
      console.warn('Borsa geçmişi kayıt hatası:', e);
    }

    // ===== BORSA GEÇMİŞİNİ ÇEK (son 7 kayıt) =====
    try {
      const { data: history } = await supabase
        .from('brand_score_history')
        .select('score, recorded_at')
        .eq('brand_name', brandName)
        .order('recorded_at', { ascending: true })
        .limit(30);
      
      data.scoreHistory = history || [];
    } catch (e) {
      console.warn('Borsa geçmişi okuma hatası:', e);
      data.scoreHistory = [];
    }

    return response.status(200).json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}