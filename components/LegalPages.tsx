import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  page: 'privacy' | 'kvkk' | 'terms';
  onBack: () => void;
}

const LegalPages: React.FC<LegalPageProps> = ({ page, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <button onClick={onBack} className="text-cyan-400 text-sm flex items-center gap-2 mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
      </button>

      {page === 'privacy' && <PrivacyPolicy />}
      {page === 'kvkk' && <KvkkText />}
      {page === 'terms' && <TermsOfUse />}

      <p className="text-slate-500 text-xs mt-12 pt-6 border-t border-slate-800">
        Son güncelleme: {new Date().toLocaleDateString('tr-TR')} · Sorularınız için: info@nytome.com
      </p>
    </div>
  );
};

const PrivacyPolicy = () => (
  <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
    <h1 className="text-3xl font-bold text-white mb-6">Gizlilik Politikası</h1>

    <p>Nytome ("biz", "platform") olarak gizliliğinize önem veriyoruz. Bu politika, hizmetimizi kullanırken hangi verileri topladığımızı, nasıl kullandığımızı ve koruduğumuzu açıklar.</p>

    <h2 className="text-xl font-bold text-white mt-6">1. Topladığımız Veriler</h2>
    <p>Hizmetimizi kullanırken şu verileri topluyoruz:</p>
    <ul className="list-disc pl-6 space-y-1">
      <li><strong>Hesap bilgileri:</strong> E-posta adresiniz (kayıt ve giriş için).</li>
      <li><strong>Analiz verileri:</strong> Analiz için girdiğiniz marka adı, web sitesi adresi (URL) ve sektör bilgisi.</li>
      <li><strong>Kullanım verileri:</strong> Yaptığınız analizlerin sonuçları ve tarihleri.</li>
    </ul>

    <h2 className="text-xl font-bold text-white mt-6">2. Verileri Nasıl Kullanıyoruz</h2>
    <p>Topladığımız verileri yalnızca hizmeti sunmak için kullanırız: analiz yapmak, sonuçları size göstermek, geçmiş analizlerinizi ve zaman içindeki değişimi takip etmenizi sağlamak.</p>

    <h2 className="text-xl font-bold text-white mt-6">3. Üçüncü Taraf Hizmetler</h2>
    <p>Analiz yaparken, girdiğiniz marka ve URL bilgisi yapay zeka sağlayıcılarına (OpenAI ve Meta Llama modelleri) analiz amacıyla iletilir. Verileriniz Supabase altyapısında güvenli şekilde saklanır. Bu sağlayıcıların kendi gizlilik politikaları geçerlidir.</p>

    <h2 className="text-xl font-bold text-white mt-6">4. Web Sitesi Taraması</h2>
    <p>Analiz sırasında yalnızca girdiğiniz web sitesinin herkese açık içeriğini tararız. Kişisel veri, çerez veya oturum bilgisi toplamayız. Yalnızca kamuya açık, robots.txt tarafından izin verilen içerik incelenir.</p>

    <h2 className="text-xl font-bold text-white mt-6">5. Veri Güvenliği</h2>
    <p>Verileriniz şifreli bağlantılar üzerinden iletilir ve erişim kontrolleriyle korunur. Hesabınıza yalnızca siz erişebilirsiniz.</p>

    <h2 className="text-xl font-bold text-white mt-6">6. Haklarınız</h2>
    <p>Verilerinize erişme, düzeltme veya silinmesini talep etme hakkınız vardır. Bu talepler için info@nytome.com adresinden bize ulaşabilirsiniz.</p>

    <h2 className="text-xl font-bold text-white mt-6">7. Değişiklikler</h2>
    <p>Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikleri size bildiririz.</p>
  </div>
);

const KvkkText = () => (
  <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
    <h1 className="text-3xl font-bold text-white mb-6">KVKK Aydınlatma Metni</h1>

    <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin işlenmesine ilişkin olarak sizi bilgilendirmek isteriz.</p>

    <h2 className="text-xl font-bold text-white mt-6">1. Veri Sorumlusu</h2>
    <p>Nytome platformu, kişisel verilerinizin işlenmesinde veri sorumlusu olarak hareket eder. İletişim: info@nytome.com</p>

    <h2 className="text-xl font-bold text-white mt-6">2. İşlenen Kişisel Veriler</h2>
    <p>Kimlik ve iletişim verisi (e-posta adresiniz) ile hizmet kullanımına ilişkin veriler (analiz ettiğiniz marka, URL ve analiz sonuçları) işlenmektedir.</p>

    <h2 className="text-xl font-bold text-white mt-6">3. İşleme Amaçları</h2>
    <p>Kişisel verileriniz; hizmetin sunulması, hesabınızın oluşturulması ve yönetilmesi, analiz sonuçlarının üretilmesi ve size sunulması, geçmiş kayıtların takibi amaçlarıyla işlenir.</p>

    <h2 className="text-xl font-bold text-white mt-6">4. Hukuki Sebep</h2>
    <p>Verileriniz, hizmet sözleşmesinin kurulması ve ifası ile açık rızanıza dayanarak işlenir.</p>

    <h2 className="text-xl font-bold text-white mt-6">5. Verilerin Aktarılması</h2>
    <p>Analiz hizmetini sunabilmek için verileriniz, yurt dışında bulunan yapay zeka sağlayıcılarına (OpenAI, Meta Llama) ve bulut altyapı sağlayıcısına (Supabase) analiz amacıyla aktarılabilir. Bu aktarım hizmetin sunulması için zorunludur.</p>

    <h2 className="text-xl font-bold text-white mt-6">6. Haklarınız (KVKK Madde 11)</h2>
    <p>Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, düzeltilmesini veya silinmesini isteme ve işlemenin sınırlandırılmasını talep etme haklarına sahipsiniz. Bu haklarınızı kullanmak için info@nytome.com adresine başvurabilirsiniz.</p>
  </div>
);

const TermsOfUse = () => (
  <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
    <h1 className="text-3xl font-bold text-white mb-6">Kullanım Koşulları</h1>

    <p>Nytome platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz.</p>

    <h2 className="text-xl font-bold text-white mt-6">1. Hizmetin Tanımı</h2>
    <p>Nytome, markaların yapay zeka modelleri (ChatGPT, Llama ve benzeri) tarafından ne kadar görünür olduğunu ölçen ve iyileştirme önerileri sunan bir analiz platformudur.</p>

    <h2 className="text-xl font-bold text-white mt-6">2. Sonuçların Niteliği</h2>
    <p>Platformumuz, yapay zeka modellerinin verdiği yanıtlara dayalı analizler üretir. Yapay zeka yanıtları doğası gereği değişkenlik gösterebilir; sonuçlar bir tahmin ve analiz aracı olarak sunulur, kesin garanti içermez. Analiz sonuçları bilgilendirme amaçlıdır ve profesyonel danışmanlık yerine geçmez.</p>

    <h2 className="text-xl font-bold text-white mt-6">3. Kullanıcı Sorumlulukları</h2>
    <p>Yalnızca yasal olarak analiz etme hakkına sahip olduğunuz markaları ve web sitelerini analiz etmelisiniz. Platformu yasa dışı amaçlarla kullanmamayı kabul edersiniz.</p>

    <h2 className="text-xl font-bold text-white mt-6">4. Hesap Güvenliği</h2>
    <p>Hesabınızın güvenliğinden siz sorumlusunuz. Giriş bilgilerinizi üçüncü kişilerle paylaşmayınız.</p>

    <h2 className="text-xl font-bold text-white mt-6">5. Ödeme ve Abonelik</h2>
    <p>Ücretli paketler için ödeme koşulları satın alma sırasında belirtilir. Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz; iptal durumunda mevcut fatura döneminiz sonuna kadar erişiminiz devam eder.</p>

    <h2 className="text-xl font-bold text-white mt-6">6. Sorumluluk Sınırı</h2>
    <p>Nytome, analiz sonuçlarının kullanımından doğabilecek dolaylı zararlardan sorumlu tutulamaz. Hizmet "olduğu gibi" sunulur.</p>

    <h2 className="text-xl font-bold text-white mt-6">7. Değişiklikler</h2>
    <p>Bu koşulları güncelleme hakkımız saklıdır. Güncel koşullar bu sayfada yayınlanır.</p>
  </div>
);

export default LegalPages;