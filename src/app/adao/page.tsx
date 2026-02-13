"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { GlassButton } from "@/components/ui/GlassButton";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Brain, Sparkles, Fingerprint, ArrowRight, Shield, Zap, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// --- Components ---

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md ${className}`}>
        {children}
    </div>
);

export default function AdaoSalesPage() {
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
                    .from("user_products")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("product_id", "adao")
                    .single();

                if (data) setHasAccess(true);
            }
            setCheckingAccess(false);
        };
        checkAccess();
    }, [supabase]);

    const handlePurchase = async () => {
        if (hasAccess) {
            router.push("/adao/chat");
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login?redirect=/adao");
                return;
            }

            const { error } = await supabase
                .from("user_products")
                .insert({
                    user_id: user.id,
                    product_id: "adao"
                });

            if (error) {
                if (error.code === "23505") {
                    router.push("/adao/chat");
                } else {
                    alert("Erro ao processar. Tente novamente.");
                }
            } else {
                router.push("/adao/chat");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative bg-[#050505] text-[#E0E0E0] overflow-x-hidden font-sans selection:bg-[#E1FD3F] selection:text-black">
            <Header />

            {/* Background System */}
            <div className="fixed inset-0 z-0">
                <FuturisticBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none" />
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative z-10 pt-48 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Badge className="bg-[#E1FD3F]/10 border-[#E1FD3F]/20 text-[#E1FD3F] shadow-[0_0_20px_rgba(225,253,63,0.1)]">
                            <Sparkles className="w-3 h-3" />
                            Nova Era da Inteligência Comercial
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-[120px] font-black tracking-tighter leading-[0.85] mb-8 text-white"
                    >
                        Pense Melhor com o <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                            AGENTE ADÃO IA
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
                    >
                        O sparring cognitivo que elimina sua insegurança, <br className="hidden md:block" />
                        domina objeções e fecha contratos no automático.
                    </motion.p>
                </div>
            </section>

            {/* --- CENTERPIECE: AMBIENT GLOW + MOCKUP --- */}
            <section className="relative z-10 px-6 pb-40">
                <div className="max-w-6xl mx-auto relative">

                    {/* Ambient Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-video bg-[#E1FD3F]/20 blur-[160px] rounded-full pointer-events-none opacity-40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-[#E1FD3F]/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />

                    {/* Chat Mockup Window */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative bg-[#0A0A0A]/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-4 md:p-8 shadow-2xl overflow-hidden group"
                    >
                        {/* Mockup Header */}
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                                <div className="w-3 h-3 rounded-full bg-white/10" />
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                                ADAIA_PROTOCOL_v4.0
                            </div>
                        </div>

                        {/* Mockup Content */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 min-h-[500px]">
                            {/* Sidebar Mockup */}
                            <div className="hidden md:block md:col-span-3 space-y-4">
                                <div className="h-4 w-2/3 bg-white/10 rounded-full" />
                                <div className="h-4 w-full bg-white/5 rounded-full" />
                                <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                                <div className="pt-8 space-y-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4">
                                            <div className="w-3 h-3 rounded-full bg-[#E1FD3F]/20 mr-3" />
                                            <div className="h-2 w-full bg-white/5 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Chat Mockup */}
                            <div className="col-span-1 md:col-span-9 flex flex-col justify-end gap-6 h-full pb-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white/5 p-6 rounded-3xl rounded-tl-none border border-white/5 max-w-[80%]"
                                >
                                    <p className="text-sm text-white/80 leading-relaxed font-medium">"O orçamento está um pouco apertado agora, podemos ver isso no próximo trimestre?"</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 }}
                                    className="bg-[#E1FD3F]/10 p-8 rounded-3xl rounded-tr-none border border-[#E1FD3F]/20 max-w-[85%] ml-auto"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-lg bg-[#E1FD3F] items-center justify-center flex">
                                            <Brain className="w-3 h-3 text-black" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#E1FD3F]">Adão Analisa:</span>
                                    </div>
                                    <p className="text-base text-white font-bold leading-relaxed">
                                        "Entendo, João. Mas me diga uma coisa: adiar essa solução vai poupar seu orçamento ou vai continuar drenando ele com esses gargalos que vimos?"
                                    </p>
                                </motion.div>

                                {/* Input Bar Mockup */}
                                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                    <span className="text-sm text-white/20 font-medium">Digite sua dúvida comercial...</span>
                                    <div className="w-8 h-8 rounded-xl bg-[#E1FD3F] flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

                        {/* Floating CTA over mockup */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
                            <GlassButton
                                onClick={handlePurchase}
                                disabled={loading || checkingAccess}
                                variant="soft"
                                className="h-20 px-16 !text-black hover:!text-black shadow-[0_20px_40px_rgba(225,253,63,0.3)] hover:scale-105 active:scale-95 transition-all"
                            >
                                <span className="font-black tracking-tighter text-2xl">ASSINE POR R$ 37</span>
                            </GlassButton>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- CLEAN FEATURES GRID (4 COLUMNS) --- */}
            <section className="relative z-10 py-32 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                        {[
                            {
                                icon: Brain,
                                title: "Sparring Cognitivo",
                                desc: "Treine negociações com uma IA que replica padrões de clientes reais."
                            },
                            {
                                icon: Shield,
                                title: "Blindagem Jurídica",
                                desc: "Cláusulas estratégicas que protegem seu lucro e autoridade."
                            },
                            {
                                icon: Zap,
                                title: "Gatilhos Mentais",
                                desc: "Sugestões em tempo real para destravar qualquer orçamento apertado."
                            },
                            {
                                icon: MessageSquare,
                                title: "Analista Privado",
                                desc: "Tenha um especialista em conversão ao seu lado em cada reunião."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E1FD3F]">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase text-xs tracking-widest mb-3">{item.title}</h4>
                                    <p className="text-sm text-white/40 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
