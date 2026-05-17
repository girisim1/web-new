import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.MY_SUPABASE_URL!,
  process.env.MY_SUPABASE_SERVICE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { brandName, url } = request.body || {};

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

  const prompt = `
Sen GEO (Generative Engine Optimization) analistisisin.
Marka: ${brandName}
URL: ${url}
Site içeriği: ${pageContent || 'Çekilemedi'}

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
  "summary": "Türkçe 2-3 cümle",
  "chatGptPerception": "Türkçe 2 cümle",
  "weaknesses": ["madde1", "madde2", "madde3", "madde4"],
  "recommendations": ["öneri1", "öneri2", "öneri3", "öneri4", "öneri5"],
  "competitors": ["rakip1", "rakip2", "rakip3"],
  "analyzedPageContent": "Türkçe 1 cümle özet"
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

    try {
      await supabase.from('site_analyses').insert({
        url: url,
        ai_model: 'gpt-4o-mini',
        brand_score: data.score?.overall || 0,
        ai_readiness_score: data.score?.visibility || 0,
        recommendations: data.recommendations || [],
        raw_analysis: data
      });
    } catch (e) {
      console.warn('Supabase kayıt hatası:', e);
    }

    return response.status(200).json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}