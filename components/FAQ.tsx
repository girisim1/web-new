import React, { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "GEO (Generative Engine Optimization) Nedir?",
            answer: "Klasik arama motoru optimizasyonu (SEO), Google'ın sayfaları nasıl sıraladığına odaklanırken; GEO markanızın ChatGPT, Gemini, Claude gibi Üretken Yapay Zeka (AI) modelleri tarafından nasıl bilindiğini, anlaşıldığını ve kullanıcılara ne sıklıkla önerildiğini optimize etme sürecidir."
        },
        {
            question: "Analiz süreci nasıl işliyor?",
            answer: "Web sitesi adresinizi ve marka adınızı sisteme girdiğinizde, AI-MARK gelişmiş proxy ağları üzerinden devasa bir sorgu simülasyonu başlatır. ChatGPT ve Gemini'ye markanız veya sektörünüzle ilgili yüzlerce soru sorulur. Alınan yanıtlar; hatırlanabilirlik, algı (sentiment), ve güvenilirlik gibi metriklerle analiz edilerek skorlanır."
        },
        {
            question: "Kredi sistemi nasıl çalışır?",
            answer: "Sisteme ilk kayıt olduğunuzda size hediye olarak 1 adet Ücretsiz Analiz kredisi tanımlanır. Bu krediyle markanızın genel röntgenini çekebilirsiniz. Daha derinlemesine (rakip analizi vb.) incelemeler ve aylık takipler için Pro veya Kurumsal paketlerimizden ek kredi satın almanız gerekir."
        },
        {
            question: "Paketimi istediğim zaman iptal edebilir miyim?",
            answer: "Evet. Pro paket aboneliğinizi dilediğiniz zaman, hiçbir taahhüt veya ek ücret ödemeden paneliniz üzerinden iptal edebilirsiniz. İptal durumunda o ayki kullanılmayan kredileriniz fatura kesim tarihinize kadar geçerli olmaya devam eder."
        },
        {
            question: "Sonuçların güvenilirliğinden nasıl emin olabilirim?",
            answer: "Platformumuz doğrudan AI sağlayıcılarının resmi API'leri (OpenAI, Google, Anthropic vb.) üzerinden çalışır. Çıkan sonuçlar, gerçek zamanlı AI model ağırlıklarına ve güncel eğitim/optimizasyon verilerine dayanmaktadır."
        }
    ];

    return (
        <div className="py-24 border-t border-white/5 relative">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 px-4 py-1.5 rounded-full text-slate-400 text-sm font-medium mb-4">
                    <MessageCircleQuestion className="w-4 h-4" />
                    <span>Sıkça Sorulan Sorular</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Aklınıza Takılanlar
                </h2>
                <p className="text-slate-400 text-lg">
                    GEO ve AI analizi hakkında en çok merak edilen konular.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                : 'border-white/5 hover:border-white/10'
                            }`}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full text-left p-6 flex items-center justify-between gap-4"
                        >
                            <h3 className={`font-bold pr-8 transition-colors ${openIndex === index ? 'text-white' : 'text-slate-300'}`}>
                                {faq.question}
                            </h3>
                            <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-cyan-400' : 'text-slate-500'
                                }`} />
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out ${openIndex === index
                                    ? 'max-h-96 opacity-100 pb-6 px-6'
                                    : 'max-h-0 opacity-0 px-6'
                                }`}
                        >
                            <p className="text-slate-400 leading-relaxed pt-2 border-t border-slate-800/50">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
