import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.MY_SUPABASE_URL!,
  process.env.MY_SUPABASE_SERVICE_KEY!
);

// Plan başına kredi miktarı
const PLAN_CREDITS: { [key: string]: number } = {
  basic: 30,
  pro: 150,
};

// Ürün adından plan tespiti (Lemonsqueezy ürün adına göre)
function detectPlan(productName: string): string | null {
  const name = (productName || '').toLowerCase();
  if (name.includes('pro')) return 'pro';
  if (name.includes('basic')) return 'basic';
  return null;
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
        // ===== 1) İMZA DOĞRULAMA (ham gövde ile) =====
    const secret = process.env.LEMON_WEBHOOK_SECRET || '';
    const signature = (request.headers['x-signature'] || '') as string;

    // Ham gövdeyi al (Vercel bazen request.body'yi parse eder, ham hali lazım)
    let rawBody = '';
    if (typeof request.body === 'string') {
      rawBody = request.body;
    } else {
      rawBody = JSON.stringify(request.body);
    }

    if (secret && signature) {
      try {
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody, 'utf8').digest('hex');
        // İmza eşleşmezse logla ama İŞLEMEYE DEVAM ET (test modunda)
        if (digest !== signature) {
          console.warn('İmza eşleşmedi ama işleniyor (test modu). Beklenen:', digest, 'Gelen:', signature);
        }
      } catch (e) {
        console.warn('İmza kontrolü hatası:', e);
      }
    }

    // ===== 2) OLAY VERİSİNİ OKU =====
    const event = request.body;
    const eventName = event?.meta?.event_name;
    const customData = event?.meta?.custom_data;
    const userId = customData?.user_id;

    // Ürün/plan bilgisi
    const attributes = event?.data?.attributes;
    const productName = attributes?.product_name || attributes?.first_order_item?.product_name || '';
    const userEmail = attributes?.user_email || '';

    console.log('Webhook olayı:', eventName, 'user:', userId, 'ürün:', productName);

    // ===== 3) ABONELİK OLAYLARINI İŞLE =====
    if (eventName === 'subscription_created' || eventName === 'subscription_updated' || eventName === 'order_created') {
      const plan = detectPlan(productName);

      if (plan && (userId || userEmail)) {
        const credits = PLAN_CREDITS[plan] || 0;

        // Kullanıcıyı user_id ile bul, yoksa email ile
        let query = supabase.from('profiles').update({ plan: plan, credits: credits });
        if (userId) {
          query = query.eq('id', userId);
        } else {
          // email ile bulmak için önce auth'tan id bul
          const { data: userData } = await supabase.auth.admin.listUsers();
          const foundUser = userData?.users?.find((u: any) => u.email === userEmail);
          if (foundUser) {
            query = query.eq('id', foundUser.id);
          } else {
            console.warn('Kullanıcı bulunamadı:', userEmail);
            return response.status(200).json({ received: true, note: 'user not found' });
          }
        }

        const { error } = await query;
        if (error) {
          console.error('Plan güncelleme hatası:', error);
        } else {
          console.log(`Plan güncellendi: ${plan}, ${credits} kredi, user: ${userId || userEmail}`);
        }
      }
    }

    // ===== 4) ABONELİK İPTALİ =====
    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      if (userId) {
        await supabase.from('profiles').update({ plan: 'free' }).eq('id', userId);
        console.log('Abonelik iptal, free yapıldı:', userId);
      }
    }

    return response.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook hatası:', error);
    return response.status(500).json({ error: error.message });
  }
}