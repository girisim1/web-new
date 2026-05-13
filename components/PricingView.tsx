import React from 'react';
import { Check, Star, Zap, ChevronRight } from 'lucide-react';

interface PricingViewProps {
    onSelectPlan: (plan: string) => void;
}

const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan }) => {
    return (
        <div className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-cyan-400 text-sm font-medium mb-4">
                    <Star className="w-4 h-4" />
                    <span>Fiyatlandırma & Paketler</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    Analiz İçin <span className="gradient-text">Paket Seçin</span>
                </h2>
                <p className="text-slate-400 text-lg">
                    AI modellerinin markanızı nasıl anladığını derinlemesine analiz etmek için size en uygun planı seçin.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {/* Free Plan */}
                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Başlangıç</h3>
                        <p className="text-slate-400 text-sm h-10">Basit bir deneme ile sistemin gücünü görün.</p>
                        <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                            Ücretsiz
                        </div>
                        <p className="text-slate-500 text-sm mt-2">Kredi kartı gerekmez</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-slate-300">
                            <Check className="text-cyan-500 w-5 h-5 flex-shrink-0" />
                            <span>1 Ücretsiz Deneme Analizi</span>
                        </li>
                        <li className="flex gap-3 text-slate-300">
                            <Check className="text-cyan-500 w-5 h-5 flex-shrink-0" />
                            <span>Temel AI Skoru Ölçümü</span>
                        </li>
                        <li className="flex gap-3 text-slate-500">
                            <Check className="text-slate-600 w-5 h-5 flex-shrink-0" />
                            <span>Detaylı Kapsam Analizi</span>
                        </li>
                        <li className="flex gap-3 text-slate-500">
                            <Check className="text-slate-600 w-5 h-5 flex-shrink-0" />
                            <span>Aylık Raporlama ve Takip</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => onSelectPlan('free')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-auto"
                    >
                        Ücretsiz Başla <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="glass p-8 rounded-3xl border-2 border-cyan-500 relative flex flex-col transform md:-translate-y-4 shadow-2xl shadow-cyan-500/20">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-cyan-500/30">
                        <Zap className="w-3 h-3" /> EN ÇOK TERCİH EDİLEN
                    </div>

                    <div className="mb-8 mt-4">
                        <h3 className="text-2xl font-bold mb-2 text-white">Pro Paket</h3>
                        <p className="text-slate-400 text-sm h-10">Büyüyen markalar için ideal, tam kapsamlı analiz.</p>
                        <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                            ₺1.499
                            <span className="text-xl text-slate-500 font-medium ml-2">/aylık</span>
                        </div>
                        <p className="text-cyan-400 text-sm mt-2 font-medium">10 Detaylı Analiz Kredisi/Ay</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-white">
                            <Check className="text-cyan-400 w-5 h-5 flex-shrink-0" />
                            <span>Her şey Başlangıç paketine dahil</span>
                        </li>
                        <li className="flex gap-3 text-white">
                            <Check className="text-cyan-400 w-5 h-5 flex-shrink-0" />
                            <span>Detaylı Kapsam Analizi & Eksikler</span>
                        </li>
                        <li className="flex gap-3 text-white">
                            <Check className="text-cyan-400 w-5 h-5 flex-shrink-0" />
                            <span>Aksiyon Alınabilir GEO Tavsiyeleri</span>
                        </li>
                        <li className="flex gap-3 text-white">
                            <Check className="text-cyan-400 w-5 h-5 flex-shrink-0" />
                            <span>Tarihsel Takip (Gelişim Grafiği)</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => onSelectPlan('pro')}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-auto"
                    >
                        Pro Pakete Geç <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col relative overflow-hidden group hover:border-purple-500/30 transition-all">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Kurumsal</h3>
                        <p className="text-slate-400 text-sm h-10">Ajanslar ve büyük markalar için sınırsız güç.</p>
                        <div className="mt-6 flex items-baseline text-5xl font-extrabold">
                            Özel
                        </div>
                        <p className="text-slate-500 text-sm mt-2">İhtiyacınıza göre fiyatlandırma</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-slate-300">
                            <Check className="text-purple-500 w-5 h-5 flex-shrink-0" />
                            <span>Sınırsız Analiz Kredisi</span>
                        </li>
                        <li className="flex gap-3 text-slate-300">
                            <Check className="text-purple-500 w-5 h-5 flex-shrink-0" />
                            <span>Özel API Erişimi</span>
                        </li>
                        <li className="flex gap-3 text-slate-300">
                            <Check className="text-purple-500 w-5 h-5 flex-shrink-0" />
                            <span>Beyaz Etiket (White-Label) Rapor</span>
                        </li>
                        <li className="flex gap-3 text-slate-300">
                            <Check className="text-purple-500 w-5 h-5 flex-shrink-0" />
                            <span>Özel Müşteri Temsilcisi</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => onSelectPlan('enterprise')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-auto"
                    >
                        İletişime Geç <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingView;
