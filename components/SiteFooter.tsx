import React from 'react';
import { Cpu, Twitter, Linkedin, Mail } from 'lucide-react';

const SiteFooter: React.FC = () => {
    return (
        <footer className="border-t border-white/5 bg-slate-950 pt-20 pb-10 mt-auto">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand & About */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-cyan-500 p-2 rounded-lg">
                                <Cpu className="text-white w-6 h-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">AI-MARK <span className="text-cyan-400">GEO</span></span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Yapay zeka modellerinin markanızı nasıl anladığını analiz eden, yeni nesil Generative Engine Optimization (GEO) platformu.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>

                            <a href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links - Product */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">Ürün</h4>
                        <ul className="space-y-4 text-sm text-slate-400 overflow-hidden">
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Neden GEO?</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Nasıl Çalışır</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Fiyatlandırma</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors flex items-center gap-2">Referans Analizi <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 uppercase">Beta</span></button></li>
                        </ul>
                    </div>

                    {/* Links - Company */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">Şirket</h4>
                        <ul className="space-y-4 text-sm text-slate-400 overflow-hidden">
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Hakkımızda</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Blog</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Kariyer</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">İletişim</button></li>
                        </ul>
                    </div>

                    {/* Links - Legal */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">Yasal Bilgiler</h4>
                        <ul className="space-y-4 text-sm text-slate-400 overflow-hidden">
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Kullanım Koşulları</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Gizlilik Politikası</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">Çerez Politikası</button></li>
                            <li><button onClick={() => alert('Yol haritasında inşa ediliyor.')} className="hover:text-cyan-400 transition-colors">KVKK Aydınlatma Metni</button></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
                    <p>© {new Date().getFullYear()} AI-MARK GEO Platform - Tüm Hakları Saklıdır.</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Sistem Aktif</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> API Bağlantısı Başarılı</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
