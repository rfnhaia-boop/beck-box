"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowRight, AlertCircle, UserPlus, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [error, setError] = useState("");
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [success, setSuccess] = useState("");

    // Check if already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push("/dashboard");
            }
        };
        checkUser();
    }, [router, supabase.auth]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Preencha todos os campos");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("Erro ao fazer login. Tente novamente.");
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Preencha todos os campos");
            setIsLoading(false);
            return;
        }

        if (mode === "signup" && !companyName) {
            setError("Informe o nome da sua empresa");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                    data: {
                        company_name: companyName,
                    }
                }
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            setSuccess("Conta criada! Verifique seu email para confirmar.");
            setIsLoading(false);
        } catch {
            setError("Erro ao criar conta. Tente novamente.");
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#050505] text-white">
            <FuturisticBackground />

            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-5 z-20 mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="w-full max-w-md px-6 relative z-30">

                {/* Neon Blur Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E1FD3F]/5 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Top Highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6 group">
                            <div className="w-12 h-12 bg-[#E1FD3F] flex items-center justify-center rounded-xl mx-auto group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(225,253,63,0.3)]">
                                <span className="text-[#050505] font-black text-2xl italic">B</span>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                            {mode === "login" ? "Acesso ao Bunker" : "Criar Conta"}
                        </h1>
                        <p className="text-white/40 text-sm">
                            {mode === "login" ? "Insira suas credenciais de elite" : "Crie sua conta para acessar o sistema"}
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5 border border-white/10">
                        <button
                            type="button"
                            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === "login" ? "bg-[#E1FD3F] text-[#050505]" : "text-white/50 hover:text-white"}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === "signup" ? "bg-[#E1FD3F] text-[#050505]" : "text-white/50 hover:text-white"}`}
                        >
                            Cadastro
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="text-red-400 text-sm">{error}</span>
                        </motion.div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                        >
                            <UserPlus className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-green-400 text-sm">{success}</span>
                        </motion.div>
                    )}

                    <form onSubmit={mode === "login" ? handleLogin : handleSignUp} className="space-y-5">

                        {mode === "signup" && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Nome da Empresa</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#E1FD3F] transition-colors" />
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 outline-none focus:border-[#E1FD3F]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                                        placeholder="Sua Empresa Ltda"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#E1FD3F] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 outline-none focus:border-[#E1FD3F]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                                    placeholder="agente@blackbox.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#E1FD3F] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 outline-none focus:border-[#E1FD3F]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {mode === "signup" && (
                                <p className="text-xs text-white/30 pl-1">Mínimo 6 caracteres</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#E1FD3F] text-[#050505] font-bold uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(225,253,63,0.2)] flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="animate-pulse">{mode === "login" ? "Autenticando..." : "Criando conta..."}</span>
                                    <div className="absolute inset-0 bg-white/20 h-full w-[20%] skew-x-12 animate-scan" />
                                </>
                            ) : (
                                <>
                                    {mode === "login" ? "Entrar no Sistema" : "Criar Conta"} <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 text-sm disabled:opacity-70"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Entrar com Google
                        </button>
                    </div>

                    <p className="text-center text-xs text-white/30 mt-8">
                        {mode === "login" ? (
                            <>Não tem acesso? <Link href="/#pricing" className="text-[#E1FD3F] hover:underline font-bold">Adquira agora</Link></>
                        ) : (
                            <>Já tem conta? <button onClick={() => setMode("login")} className="text-[#E1FD3F] hover:underline font-bold">Fazer login</button></>
                        )}
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
