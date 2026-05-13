import React from 'react';
import { Target, Search, Activity } from 'lucide-react';

const Features: React.FC = () => {
    const services = [
        {
            icon: <Search className="w-6 h-6 text-cyan-400" />,
            title: "Yapay Zeka Referans Durumu Analizi",
            description: "Girişimlerin yapay zekaya göre referans durumu, yapay zeka ürünleri ve markaları ile ilgili AI'ın ne düşündüğünün analizi."
        },
        {
            icon: <Target className="w-6 h-6 text-emerald-400" />,
            title: "Yapay Zeka Site Optimizasyon Hizmeti",
            description: "Sitenizi veya markanızı genel yapay zeka modelleri, asistanları ve arama motorları için optimize etme hizmeti (GEO)."
        },
        {
            icon: <Activity className="w-6 h-6 text-purple-400" />,
            title: "Yapay Zekayı İnternette Manipüle Etme Hizmeti",
            description: "Markanızın dijital varlığını güçlendirmek için yapay zeka modellerini stratejik olarak manipüle edip AI kaynaklarında markanızı ön çıkarma hizmeti."
        }
    ];

    return (
        <div id="services" className="py-24 border-t border-white/5 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

            <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        Sitemizin Hizmetleri
                    </span>
                </h2>
                <p className="text-slate-400 text-lg">
                    Bu platform ile yararlanabileceğiniz üç ana odak alanındaki hizmetlerimiz.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <div key={index} className="glass p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all group overflow-hidden relative">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
                        </div>

                        <div className="bg-slate-800/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50 group-hover:scale-110 transition-transform">
                            {service.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Visual Break */}
            <div className="mt-24 p-8 md:p-12 glass rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-cyan-950/30 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold">Markanız AI ile Konuşuyor Mu?</h3>
                    <p className="text-slate-300">
                        Arama motorlarının ötesine geçin. Geleceğin müşterileri doğrudan AI araçlarına "Bana en iyi markayı öner" diyor. Orada olmak zorundasınız.
                    </p>
                </div>
                <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 rounded-full"></div>
                    <div className="relative glass border border-cyan-500/30 px-6 py-4 rounded-xl flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="font-mono text-sm text-cyan-400">AI Readiness: %98</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
