
import React, { useState, useEffect } from 'react';
import { Search, Activity, Cpu, Target, ArrowRight, CheckCircle, AlertTriangle, ShieldCheck, Zap, Globe, BarChart3, Users, FileText, Loader2 } from 'lucide-react';
import { analyzeBrandVisibility } from './services/geminiService';
import { AnalysisResult, Step } from './types';
import { Suspense, lazy } from 'react';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import PricingView from './components/PricingView';
import Features from './components/Features';
import FAQ from './components/FAQ';
import SiteFooter from './components/SiteFooter';
import { supabase } from './services/supabase';

const ScoreChart = lazy(() => import('./components/ScoreChart'));

const App: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [url, setUrl] = useState('');
  const [step, setStep] = useState<Step>(Step.INPUT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('Veriler taranıyor...');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [pastAnalyses, setPastAnalyses] = useState<any[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register' | 'pricing'>('home');

  // Kullanıcı oturumunu ve Supabase'den kredilerini çek
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session?.user) {
        fetchCredits(session.user.id);
        fetchPastAnalyses(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session?.user) {
        fetchCredits(session.user.id);
        fetchPastAnalyses(session.user.id);
      } else {
        setCredits(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCredits = async (userId: string) => {
    setLoadingCredits(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setCredits(data.credits ?? 0);
      }
    } catch (e) {
      console.error('Kredi bilgisi alınamadı:', e);
    } finally {
      setLoadingCredits(false);
    }
  };

  const fetchPastAnalyses = async (userId: string) => { 
    const { data } = await supabase
      .from('site_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
      if (data) setPastAnalyses(data);
  };

 
  const validateKey = async () => {
  if (!keyInput.trim()) return;
  
  const { data, error } = await supabase
    .from('access_keys')
    .select('*')
    .eq('key', keyInput.trim())
    .eq('used', false)
    .single();

  if (error || !data) {
    setKeyError('Geçersiz veya kullanılmış key.');
    return;
  }

  // Key'i kullanılmış olarak işaretle
  await supabase
    .from('access_keys')
    .update({ used: true, used_by: session?.user?.id })
    .eq('id', data.id);

  setHasFullAccess(true);
  setKeyError('');
};

  const deductCredit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const newCredits = credits - 1;
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', session.user.id);

    if (!error) {
      setCredits(newCredits);
      return true;
    }
    return false;
  };

  const saveAnalysis = async (analysisResult: AnalysisResult) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.from('analyses').insert({
      user_id: session.user.id,
      brand_name: analysisResult.brandName,
      url: analysisResult.url,
      result: analysisResult,
    });
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !url) return;

    if (!isAuthenticated) {
      setCurrentView('login');
      return;
    }
    /*
    if (credits <= 0) {
      setCurrentView('pricing');
      return;
    }*/

    setStep(Step.ANALYZING);
    setLoadingMsg('Site içeriği taranıyor...');

    try {
      const t1 = setTimeout(() => setLoadingMsg('Semantik ilişkiler analiz ediliyor...'), 2500);
      const t2 = setTimeout(() => setLoadingMsg('Gemini AI ile GEO skoru hesaplanıyor...'), 5000);
      const t3 = setTimeout(() => setLoadingMsg('E-E-A-T metrikleri değerlendiriliyor...'), 8000);

      const analysis = await analyzeBrandVisibility(brandName, url, session?.user?.id);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);

      // Kredi düş ve analizi kaydet
      await deductCredit();
      await saveAnalysis(analysis);

      setResult(analysis);
      setStep(Step.RESULT);
    } catch (error) {
      console.error(error);
      alert('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      setStep(Step.INPUT);
    }
  };

  const reset = () => {
    setStep(Step.INPUT);
    setResult(null);
    setBrandName('');
    setUrl('');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="p-6 flex justify-between items-center glass sticky top-0 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            setCurrentView('home');
            if (step === Step.RESULT) {
              setStep(Step.INPUT);
              setResult(null);
            }
          }}
        >
          <div className="bg-cyan-500 p-2 rounded-lg group-hover:scale-105 transition-transform">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">AI-MARK <span className="text-cyan-400">GEO</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <a href="#services" className="hover:text-cyan-400 transition-colors">Servisler</a>
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => setCurrentView('login')}
                className="text-sm font-bold text-slate-300 hover:text-cyan-400 transition-colors hidden sm:block"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="bg-white text-slate-950 px-4 py-2 rounded-full text-sm font-bold hover:bg-cyan-400 transition-all"
              >
                Kayıt Ol
              </button>
            </>
          ) : (
            <>
              <div
                onClick={() => setCurrentView('pricing')}
                className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                title="Kredi Yükle"
              >
                <Zap className={`w-4 h-4 ${credits > 0 ? 'text-cyan-400' : 'text-slate-500'}`} />
                {loadingCredits ? (
                  <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                ) : (
                  <span className={`text-sm font-bold ${credits > 0 ? 'text-white' : 'text-slate-400'}`}>
                    {credits} Kredi
                  </span>
                )}
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setCurrentView('home');
                  setBrandName('');
                  setUrl('');
                  setStep(Step.INPUT);
                  setResult(null);
                }}
                className="text-sm font-bold text-slate-400 hover:text-red-400 transition-colors hidden sm:block"
              >
                Çıkış
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {currentView === 'login' && (
          <LoginView
            onLogin={() => { setIsAuthenticated(true); setCurrentView('home'); }}
            onNavigateToRegister={() => setCurrentView('register')}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            onRegister={() => { setIsAuthenticated(true); setCurrentView('home'); }}
            onNavigateToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'pricing' && (
          <PricingView
            onSelectPlan={(plan) => { setCurrentView('home'); }}
          />
        )}

        {currentView === 'home' && (
          <>
            {step === Step.INPUT && (
              <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-cyan-400 text-sm font-medium mb-4">
                    <Zap className="w-4 h-4" />
                    <span>Yıkıcı İnovasyon: AI Engine Optimization</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                    AI Sizi <span className="gradient-text">Öneriyor Mu?</span>
                  </h1>
                  <p className="text-slate-400 text-lg md:text-xl">
                    Yapay zeka modelleri markanızı nasıl tanıyor? ChatGPT'de üst sıralara çıkmak ve AI tarafından tavsiye edilmek için veriye dayalı GEO analizinizi şimdi başlatın.
                  </p>
                </div>

                <div className="glass p-8 rounded-3xl max-w-2xl mx-auto shadow-2xl shadow-cyan-500/10">
                  <form onSubmit={handleStartAnalysis} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 ml-1">Marka Adı</label>
                      <div className="relative">
                        <Target className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Örn: Tesla, Getir, Markanız..."
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 ml-1">Web Sitesi URL</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                          type="url"
                          placeholder="https://markaniz.com"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      Ücretsiz AI Skoru Ölç <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>

                {pastAnalyses.length > 0 && (
                    <div className="glass p-6 rounded-2xl max-w-2xl mx-auto">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Geçmiş Analizleriniz</h3>
                      <div className="space-y-3">
                        {pastAnalyses.map((a, i) => {
                          const prev = pastAnalyses[i + 1];
                          const trend = prev ? a.brand_score - prev.brand_score : null;
                          return (
                            <div
                              key={i}
                              className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors"
                              onClick={() => {
                                setResult(a.raw_analysis);
                                setStep(Step.RESULT);
                              }}
                          >
                            <div>
                              <p className="font-medium text-sm">{a.url}</p>
                              <p className="text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString('tr-TR')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {trend !== null && (
                                <span className={`text-xs font-bold ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                  {trend > 0 ? `↑ +${trend}` : trend < 0 ? `↓ ${trend}` : '→ 0'}
                                </span>
                              )}
                              <div className="text-cyan-400 font-bold text-lg">{a.brand_score}/100</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Features />
                <FAQ />
              </div>
            )}

            {step === Step.ANALYZING && (
              <div className="flex flex-col items-center justify-center py-20 space-y-8">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                  <Activity className="absolute inset-0 m-auto w-12 h-12 text-cyan-500" />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold mono uppercase tracking-widest">{loadingMsg}</h2>
                  <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-cyan-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              </div>
            )}

            {step === Step.RESULT && result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                    <button onClick={reset} className="text-cyan-400 text-sm flex items-center gap-2 mb-4 hover:underline">
                      <ArrowRight className="w-4 h-4 rotate-180" /> Yeni Analiz Başlat
                    </button>
                    <h2 className="text-3xl font-bold">{result.brandName} Analiz Raporu</h2>
                    <p className="text-slate-400">{result.url}</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 px-6 py-4 rounded-2xl text-center">
                    <p className="text-xs text-cyan-400 uppercase font-bold tracking-widest mb-1">Genel AI Skoru</p>
                    <p className="text-5xl font-black text-white">{result.score.overall}<span className="text-xl text-cyan-400">/100</span></p>
                  </div>
                </div>

                {/* Analiz özeti + ChatGPT */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <BarChart3 className="text-cyan-400" /> Metrik Dağılımı
                    </h3>
                    <Suspense fallback={<div className="h-[300px] w-full flex items-center justify-center text-slate-500 animate-pulse">Grafik yükleniyor...</div>}>
                      <ScoreChart score={result.score} />
                    </Suspense>
                  </div>

                  <div className="glass p-8 rounded-3xl space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="text-cyan-400" /> AI Algısı (Özet)
                      </h3>
                      <p className="text-slate-300 leading-relaxed italic border-l-4 border-cyan-500/50 pl-4 py-2">
                        "{result.summary}"
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-2">ChatGPT Gözünden:</h4>
                      <p className="text-sm text-slate-300">{result.chatGptPerception}</p>
                    </div>
                  </div>
                </div>

                {hasFullAccess ? (
                <>
                {/* Rakipler + Analiz edilen içerik */}
                <div className="grid md:grid-cols-2 gap-8">
                  {result.competitors && result.competitors.length > 0 && (
                    <div className="glass p-8 rounded-3xl">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Users className="text-purple-400" /> Rakip Markalar (AI'ın Öne Çıkardıkları)
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {result.competitors.map((c, i) => (
                          <span key={i} className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.analyzedPageContent && (
                    <div className="glass p-8 rounded-3xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="text-slate-400" /> Analiz Edilen Sayfa
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{result.analyzedPageContent}</p>
                    </div>
                  )}
                </div>

                {/* Eksikler + Tavsiyeler */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
                      <AlertTriangle className="w-6 h-6" /> Eksikler ve Riskler
                    </h3>
                    <ul className="space-y-4">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="flex gap-3 text-slate-300">
                          <span className="text-red-500 font-bold">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-6 h-6" /> GEO Tavsiyeleri
                    </h3>
                    <ul className="space-y-4">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="flex gap-3 text-slate-300">
                          <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA bölümü */}
                <div className="glass p-12 rounded-3xl text-center space-y-6 bg-gradient-to-b from-slate-900/50 to-cyan-900/10">
                  <h3 className="text-2xl font-bold">Bu Markayı AI Dünyasında <span className="text-cyan-400">Domine Etmek</span> İster Misiniz?</h3>
                  <p className="text-slate-400 max-w-2xl mx-auto">
                    Analiz sadece ilk adımdı. Sitenizi "AI-Ready" hale getirmek ve rakip markaların önüne geçmek için yıkıcı inovasyon servislerimizi kullanın.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => setCurrentView('pricing')}
                      className="bg-white text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all"
                    >
                      Pakete Geç & Yeni Analiz Yap
                    </button>
                    <button onClick={reset} className="border border-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                      Yeni Marka Analiz Et
                    </button>
                  </div>
                </div>
                </>
                ) : (
                  <div className="relative mt-8">
                    <div className="blur-sm pointer-events-none select-none opacity-40 space-y-8">
                      <div className="glass p-8 rounded-3xl h-40"></div>
                      <div className="glass p-8 rounded-3xl h-40"></div>
                      <div className="glass p-8 rounded-3xl h-40"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 rounded-3xl z-10 p-8 text-center space-y-4">
                      <ShieldCheck className="w-12 h-12 text-cyan-400" />
                      <h3 className="text-xl font-bold">Tam Raporu Görmek İçin Key Girin</h3>
                      <p className="text-slate-400 text-sm">Size özel erişim keyinizi girerek tüm analiz detaylarına ulaşın.</p>
                      <div className="flex gap-2 w-full max-w-sm">
                        <input
                          type="text"
                          placeholder="Key girin..."
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value)}
                        />
                        <button
                          onClick={validateKey}
                          className="bg-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-cyan-400"
                        >
                          Gir
                        </button>
                      </div>
                      {keyError && <p className="text-red-400 text-sm">{keyError}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default App;
