"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Footer } from "@/components/ui/Footer";
import { LiquidGlass } from "@/components/ui/LiquidGlass";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Rocket, Check, ArrowRight, Shield, PlayCircle, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcaoSalesPage() {
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
                    .eq('product_id', 'acao') // Assuming 'acao' or 'acao_30k' - using 'acao' based on folder name but plans page used 'acao_30k'. Let's check plans. page used 'acao_30k'. Wait.
                    // Actually, let's use 'acao_30k' to match the plans page logic logic if that's what was used. 
                    // In PlansPage snippet: id: "acao_30k".
                    // So I must use "acao_30k".
                    .eq('product_id', 'acao_30k')
                    .single();

                if (data) setHasAccess(true);
            }
            setCheckingAccess(false);
        };
        checkAccess();
    }, [supabase]);

    const handlePurchase = async () => {
        if (hasAccess) {
            router.push("/sede"); // Redirect to dashboard to access it
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login?redirect=/acao");
                return;
            }

            const { error } = await supabase
                .from('user_products')
                .insert({
                    user_id: user.id,
                    product_id: 'acao_30k'
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
        <main className="min-h-screen relative bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-blue-500 selection:text-white">
            <FuturisticBackground />

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Método Validado
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8"
                    >
                        AÇÃO <span className="text-blue-500">30K</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/50 max-w-2xl font-medium leading-relaxed mb-12"
                    >
                        O plano de voo completo. Aulas, contratos blindados e a estrutura exata para escalar sua operação.
                        <span className="text-white block mt-2">Simples. Direto. Brutal.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row gap-6 w-full max-w-lg"
                    >
                        <button
                            onClick={handlePurchase}
                            disabled={loading || checkingAccess}
                            className="flex-1 py-6 px-8 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-[1.02] flex items-center justify-center gap-3"
                        >
                            {loading ? "Processando..." : hasAccess ? "Acessar Plataforma" : "Comprar Agora - R$ 33"}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-24 bg-[#0A0A0A] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: PlayCircle,
                            title: "Masterclasses",
                            desc: "Aulas práticas ensinando o passo a passo da operação."
                        },
                        {
                            icon: Shield,
                            title: "Contratos Blindados",
                            desc: "Modelos jurídicos validados para proteger seu negócio."
                        },
                        {
                            icon: FolderOpen,
                            title: "Kit de Ferramentas",
                            desc: "Planilhas, scripts e arquivos prontos para download."
                        }
                    ].map((feature, i) => (
                        <LiquidGlass
                            key={i}
                            intensity="medium"
                            className="p-8 group hover:border-blue-500/30 transition-colors"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform relative z-10">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 relative z-10">{feature.title}</h3>
                            <p className="text-white/40 font-medium leading-relaxed relative z-10">{feature.desc}</p>
                        </LiquidGlass>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
