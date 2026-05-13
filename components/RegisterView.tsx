import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface RegisterViewProps {
    onRegister: () => void;
    onNavigateToLogin: () => void;
}

const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-400' : 'text-slate-400'}`}>
        {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />}
        <span>{text}</span>
    </div>
);


const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Password validation state
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        match: false,
    });

    useEffect(() => {
        setValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            match: password !== '' && password === confirmPassword,
        });
    }, [password, confirmPassword]);

    const isPasswordValid = validations.length && validations.uppercase && validations.lowercase && validations.number;
    const canSubmit = name && email && isPasswordValid && validations.match && !isLoading;

    const getStrengthScore = () => {
        if (!password) return 0;
        let score = 0;
        if (validations.length) score += 25;
        if (validations.uppercase) score += 25;
        if (validations.lowercase) score += 25;
        if (validations.number) score += 25;
        return score;
    };

    const strengthScore = getStrengthScore();

    const getStrengthColor = () => {
        if (strengthScore === 0) return 'bg-slate-700';
        if (strengthScore <= 50) return 'bg-red-500';
        if (strengthScore <= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (strengthScore === 0) return '';
        if (strengthScore <= 50) return 'Zayıf';
        if (strengthScore <= 75) return 'Orta';
        return 'Güçlü';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (canSubmit) {
            setIsLoading(true);
            try {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });

                if (error) {
                    let userFriendlyMsg = "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.";
                    if (error.message.includes("already registered") || error.message.includes("User already exists")) {
                        userFriendlyMsg = "Bu e-posta adresi ile zaten bir hesap mevcut.";
                    }
                    setErrorMsg(userFriendlyMsg);
                } else {
                    onRegister();
                }
            } catch (err) {
                setErrorMsg('Beklenmeyen bir hata oluştu. Lütfen bağlantınızı kontrol edin.');
            } finally {
                setIsLoading(false);
            }
        } else if (!validations.match) {
            setErrorMsg("Şifreler birbiriyle eşleşmiyor.");
        } else if (!isPasswordValid) {
            setErrorMsg("Lütfen şifre kurallarını karşılayan bir şifre belirleyin.");
        }
    };

    const handleGoogleRegister = async () => {
        setIsGoogleLoading(true);
        setErrorMsg(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin },
            });
            if (error) setErrorMsg('Google kaydı başlatılamadı. Lütfen tekrar deneyin.');
        } catch {
            setErrorMsg('Beklenmeyen bir hata oluştu.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-10 px-4 animate-in fade-in zoom-in duration-500">
            <div className="glass p-8 md:p-12 rounded-3xl w-full max-w-md shadow-2xl shadow-cyan-500/10 border border-white/10 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Kayıt Ol</h2>
                        <p className="text-slate-400">AI-MARK GEO dünyasına katılın</p>
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
                        onClick={handleGoogleRegister}
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
                        Google ile Kayıt Ol
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                        <span className="text-xs text-slate-500 font-medium">veya e-posta ile</span>
                        <div className="flex-1 h-px bg-slate-700/50"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Adınız Soyadınız"
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Şifre</label>
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

                            {/* Password validation UI */}
                            {password && (
                                <div className="mt-3 space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-400">Şifre Gücü</span>
                                        <span className={`text-xs font-medium ${strengthScore <= 50 ? 'text-red-400' : strengthScore <= 75 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {getStrengthText()}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                        <div
                                            className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`}
                                            style={{ width: `${strengthScore}%` }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        <ValidationItem isValid={validations.length} text="En az 8 karakter" />
                                        <ValidationItem isValid={validations.uppercase} text="En az 1 büyük harf" />
                                        <ValidationItem isValid={validations.lowercase} text="En az 1 küçük harf" />
                                        <ValidationItem isValid={validations.number} text="En az 1 rakam" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Şifre (Tekrar)</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-900/50 border rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600 ${confirmPassword && !validations.match ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' :
                                        confirmPassword && validations.match ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500' :
                                            'border-slate-700/50 focus:border-cyan-500 focus:ring-cyan-500'
                                        }`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {confirmPassword && !validations.match && (
                                <p className="text-xs text-red-500 ml-1">Şifreler eşleşmiyor</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || (password.length > 0 && !canSubmit)}
                            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 ${isLoading || (password.length > 0 && !canSubmit)
                                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Hesap Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    Hesap Oluştur <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-sm">
                        Zaten hesabınız var mı?{' '}
                        <button
                            onClick={onNavigateToLogin}
                            className="text-cyan-400 font-bold hover:underline hover:text-cyan-300 transition-colors"
                        >
                            Giriş Yapın
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
