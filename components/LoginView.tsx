import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface LoginViewProps {
    onLogin: () => void;
    onNavigateToRegister: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (email && password) {
            setIsLoading(true);
            try {
                const { error, data } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    let userFriendlyMsg = "Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.";
                    if (error.message.includes("Invalid login credentials")) {
                        userFriendlyMsg = "E-posta adresi veya şifre hatalı.";
                    } else if (error.message.includes("Email not confirmed")) {
                        userFriendlyMsg = "Lütfen e-posta adresinizi doğrulayın.";
                    }
                    setErrorMsg(userFriendlyMsg);
                } else if (data.session) {
                    onLogin();
                } else {
                    setErrorMsg("Giriş bilgileri doğrulanamadı.");
                }
            } catch (err) {
                setErrorMsg('Beklenmeyen bir hata oluştu. Lütfen bağlantınızı kontrol edin.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setErrorMsg(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin },
            });
            if (error) setErrorMsg('Google girişi başlatılamadı. Lütfen tekrar deneyin.');
        } catch {
            setErrorMsg('Beklenmeyen bir hata oluştu.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh] px-4 animate-in fade-in zoom-in duration-500">
            <div className="glass p-8 md:p-12 rounded-3xl w-full max-w-md shadow-2xl shadow-cyan-500/10 border border-white/10 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h2>
                        <p className="text-slate-400">AI-MARK GEO paneline giriş yapın</p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-400 animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm">{errorMsg}</p>
                        </div>
                    )}

                    {/* Google OAuth */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Google ile Giriş Yap
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                        <span className="text-xs text-slate-500 font-medium">veya e-posta ile</span>
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">E-posta</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="ornek@sirket.com"
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-slate-300 ml-1">Şifre</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button type="button" onClick={() => alert('Şifre sıfırlama servisi yakında aktif edilecektir.')} className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                                    Şifremi Unuttum
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email || !password}
                            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 ${isLoading || !email || !password
                                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Giriş Yapılıyor...
                                </>
                            ) : (
                                <>
                                    Giriş Yap <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-sm">
                        Hesabınız yok mu?{' '}
                        <button
                            onClick={onNavigateToRegister}
                            className="text-cyan-400 font-bold hover:underline hover:text-cyan-300 transition-colors"
                        >
                            Hemen Kayıt Olun
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
