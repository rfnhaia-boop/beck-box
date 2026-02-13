"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { LiquidGlass } from "@/components/ui/LiquidGlass";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Crown, Check, ArrowRight, Star, Layers, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ComboSalesPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('user_products')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('product_id', 'combo')
                    .single();

                if (data) setHasAccess(true);
            }
            setCheckingAccess(false);
        };
        checkAccess();
    }, [supabase]);

    const handlePurchase = async () => {
        if (hasAccess) {
            router.push("/sede");
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login?redirect=/combo");
                return;
            }

            const { error } = await supabase
                .from('user_products')
                .insert({
                    user_id: user.id,
                    product_id: 'combo'
                });

            if (error) {
                if (error.code === '23505') {
                    router.push("/sede");
                } else {
                    alert("Erro ao processar. Tente novamente.");
                }
            } else {
                router.push("/sede");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-purple-500 selection:text-white">
            <FuturisticBackground />
            <Header />

            {/* Hero Section */}
            <section className="relative z-10 pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        Oferta Exclusiva Limitada
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8"
                    >
                        COMBO <span className="text-purple-500">ELITE</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/50 max-w-2xl font-medium leading-relaxed mb-12"
                    >
                        O arsenal completo. Leve o <span className="text-blue-400 font-bold">Ação 30k</span> e o <span className="text-[#E1FD3F] font-bold">Adão IA</span> juntos com desconto máximo.
                        A escolha lógica para quem não brinca em serviço.
                    </motion.p>
                </div>
            </section>

            {/* MODULE 1: COMPARATIVE ADVANTAGE */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <LiquidGlass className="p-12 relative overflow-hidden bg-white/[0.02] border-white/5">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-black mb-6">Por que o Combo?</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                            <Layers className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Integração Total</h3>
                                            <p className="text-white/50 leading-relaxed">
                                                O método do <span className="text-blue-400">Ação 30k</span> ensina a estratégia, o <span className="text-[#E1FD3F]">Adão IA</span> executa a operação. Use os scripts do Adão nas propostas do Ação.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center text-[#E1FD3F] shrink-0">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Velocidade de Implementação</h3>
                                            <p className="text-white/50 leading-relaxed">
                                                Quem tem os dois implementa 3x mais rápido. Você não perde tempo criando copy ou contratos do zero. Está tudo pronto.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                                            <Star className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Economia Inteligente</h3>
                                            <p className="text-white/50 leading-relaxed">
                                                Comprando separado você gasta quase R$ 500. No Combo, você leva tudo por uma fração do preço real das ferramentas.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Value Visualization */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-[60px] rounded-full" />
                                <div className="relative z-10 space-y-4">
                                    {/* Individual Prices */}
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
                                        <span className="font-bold">Ação 30k (Separado)</span>
                                        <span className="font-mono line-through">R$ 197</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
                                        <span className="font-bold">Adão IA (Separado)</span>
                                        <span className="font-mono line-through">R$ 297</span>
                                    </div>

                                    {/* Combo Price */}
                                    <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-purple-900/20 border border-purple-500/50 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-3">
                                            <Crown className="w-6 h-6 text-purple-400" />
                                            <span className="font-black text-xl tracking-wide">COMBO ELITE</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-purple-300 uppercase tracking-widest mb-1">Apenas Hoje</div>
                                            <span className="font-black text-4xl text-purple-400">R$ 66</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LiquidGlass>
                </div>
            </section>

            {/* Stack Effect & CTA */}
            <section className="relative z-10 pb-32 px-6">
                <div className="max-w-4xl mx-auto relative flex justify-center">
                    {/* Card 1 - Adão (Behind) */}
                    <motion.div
                        initial={{ rotate: -10, x: -50, opacity: 0 }}
                        whileInView={{ rotate: -6, x: -20, opacity: 0.6 }}
                        viewport={{ once: true }}
                        className="absolute w-full max-w-[400px] aspect-[4/5] bg-[#E1FD3F]/5 border border-[#E1FD3F]/10 rounded-[40px] z-0"
                    />
                    {/* Card 2 - Ação (Behind) */}
                    <motion.div
                        initial={{ rotate: 10, x: 50, opacity: 0 }}
                        whileInView={{ rotate: 6, x: 20, opacity: 0.6 }}
                        viewport={{ once: true }}
                        className="absolute w-full max-w-[400px] aspect-[4/5] bg-blue-500/5 border border-blue-500/10 rounded-[40px] z-0"
                    />

                    {/* Card 3 - Combo (Front) */}
                    <LiquidGlass
                        intensity="high"
                        className="relative w-full max-w-[500px] p-8 md:p-12 z-10 border-purple-500/30"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Crown className="w-8 h-8" />
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-purple-500/20">
                                Melhor Escolha
                            </div>
                        </div>

                        <h3 className="text-4xl font-black mb-2 relative z-10">Combo Elite</h3>
                        <p className="text-white/40 mb-8 relative z-10">Acesso irrestrito a todo o ecossistema Black Box.</p>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <Check className="w-5 h-5 text-purple-500" />
                                <span className="font-bold">Ação 30K Completo</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <Check className="w-5 h-5 text-purple-500" />
                                <span className="font-bold">Adão IA (V3.0)</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <Check className="w-5 h-5 text-purple-500" />
                                <span className="font-bold">Comunidade VIP</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/10 relative z-10 mb-8">
                            <div className="flex flex-col">
                                <span className="text-xs text-white/30 line-through">R$ 497</span>
                                <span className="text-5xl font-black">R$ 66</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-500">Pagamento Único</span>
                        </div>

                        <button
                            onClick={handlePurchase}
                            disabled={loading || checkingAccess}
                            className="w-full py-6 px-8 rounded-2xl bg-purple-500 text-white font-black uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-[0_0_50px_rgba(168,85,247,0.4)] hover:scale-[1.02] flex items-center justify-center gap-3 relative z-10"
                        >
                            {loading ? "Processando..." : hasAccess ? "Acessar Bunker" : "Desbloquear Tudo"}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </LiquidGlass>
                </div>
            </section>

            <Footer />
        </main>
    );
}
