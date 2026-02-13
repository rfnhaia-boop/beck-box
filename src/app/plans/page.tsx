"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Footer } from "@/components/ui/Footer";
import { Check, Rocket, Zap, Crown, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PlansPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState<string | null>(null);

    const handlePurchase = async (productId: string) => {
        setLoading(productId);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            // Mock purchase - insert directly into user_products
            const { error } = await supabase
                .from('user_products')
                .insert({
                    user_id: user.id,
                    product_id: productId
                });

            if (error) {
                console.error("Purchase error:", error);
                if (error.code === '23505') { // Unique violation
                    router.push("/sede");
                    return;
                }
                alert(`Erro ao processar compra: ${error.message || error.details || "Erro desconhecido"}`);
            } else {
                router.push("/sede");
                router.refresh();
            }
        } catch (err: any) {
            console.error("Purchase error:", err);
            alert(`Erro inesperado: ${err.message || "Tente novamente"}`);
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            id: "acao_30k",
            title: "AÇÃO 30K",
            price: "33",
            oldPrice: "197",
            badge: "MÉTODO COMPROVADO",
            description: "Vídeo aulas, contratos e apresentação profissional.",
            features: [
                "Vídeo Aulas Exclusivas",
                "Método Comprovado",
                "Contrato Profissional",
                "Apres. de Estruturação",
                "Acesso Vitalício"
            ],
            icon: Rocket,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            buttonBg: "bg-blue-500 hover:bg-blue-400",
            buttonText: "ASSINAR AÇÃO 30K",
            highlight: false
        },
        {
            id: "adao",
            title: "ADÃO IA",
            price: "47",
            oldPrice: "297",
            badge: "INTELIGÊNCIA ARTIFICIAL",
            description: "IA modelada para designers e agências.",
            features: [
                "IA Treinada em Vendas",
                "Automação de Processos",
                "Aumento de Ticket Médio",
                "Suporte Especializado",
                "Integração n8n + Gemini"
            ],
            icon: Zap,
            color: "text-[#E1FD3F]",
            bg: "bg-[#E1FD3F]/10",
            border: "border-[#E1FD3F]/20",
            buttonBg: "bg-[#E1FD3F] text-black hover:bg-[#c5df30]",
            buttonText: "ASSINAR ADÃO IA",
            highlight: false
        },
        {
            id: "combo",
            title: "COMBO BLACK BOX",
            price: "66",
            oldPrice: "497",
            badge: "OFERTA EXCLUSIVA",
            description: "Leve TUDO: Ação 30k + Adão IA com desconto.",
            features: [
                "Tudo do Ação 30k",
                "Tudo do Adão IA",
                "Grupo de Networking",
                "Mentoria Mensal",
                "Acesso Vitalício Total"
            ],
            icon: Crown,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            buttonBg: "bg-purple-500 hover:bg-purple-400",
            buttonText: "QUERO O COMBO COMPLETO",
            highlight: true,
            popular: true
        }
    ];

    return (
        <main className="min-h-screen relative bg-[#050505] text-white overflow-x-hidden font-sans">
            <FuturisticBackground />

            {/* Hero Section */}
            <div className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E1FD3F] animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
                            Escolha seu Acesso
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E1FD3F] animate-pulse" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-4 text-white">
                        Planos Vitalícios
                        <span className="block text-white/20">Black Box</span>
                    </h1>

                    <p className="max-w-xl text-white/40 text-lg font-medium leading-relaxed">
                        Desbloqueie o sistema completo. Ferramentas, estratégias e inteligência para escalar sua operação.
                    </p>
                </motion.div>

                {/* Decorative Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-16 flex flex-col items-center gap-2 opacity-30"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.5em]">Explore os Planos</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
            </div>

            {/* Alternating Sections */}
            <div className="relative z-10 w-full">
                {/* Plans Stack */}
                <div className="relative z-10 w-full space-y-32 pb-24">
                    {plans.map((plan, index) => (
                        <section
                            key={plan.id}
                            className={`py-12 px-6 md:px-12 ${plan.highlight ? 'relative' : ''}`}
                        >
                            {/* Background Glow for Highlighted Plan */}
                            {plan.highlight && (
                                <div className="absolute inset-0 bg-gradient-to-b from-[#A855F7]/5 via-[#A855F7]/5 to-transparent -z-10 blur-3xl" />
                            )}

                            <div className="max-w-7xl mx-auto grid lg:grid-cols-[400px_1fr] gap-12 items-start">
                                {/* Left Column: Asset Preview & Metadata */}
                                <div className="space-y-6 sticky top-32">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-[#0A0A0A] relative group shadow-2xl"
                                    >
                                        <img
                                            src="/preview-hero.png"
                                            alt={plan.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                                        {/* Tech Badges */}
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <div className={`px-3 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase tracking-wider ${plan.highlight ? 'bg-[#A855F7]/20 border-[#A855F7]/30 text-[#A855F7]' : 'bg-black/50 border-white/10 text-white/60'}`}>
                                                {plan.badge}
                                            </div>
                                        </div>

                                        {/* Play/Action Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className={`w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center ${plan.highlight ? 'text-[#A855F7]' : 'text-[#E1FD3F]'}`}>
                                                <plan.icon className="w-8 h-8" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">System Specs</h3>
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${plan.highlight ? 'bg-[#A855F7]' : 'bg-[#E1FD3F]'}`} />
                                        </div>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-white/40 font-medium">Access Level</span>
                                                <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded">Lifetime</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-white/40 font-medium">Updates</span>
                                                <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded">Included</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-white/40 font-medium">Status</span>
                                                <span className={`${plan.highlight ? 'text-[#A855F7]' : 'text-[#E1FD3F]'} font-mono text-xs uppercase`}>Available Now</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Content & Actions */}
                                <div className="flex flex-col">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            <span className={`px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] ${plan.color}`}>
                                                {plan.id.toUpperCase()} MODULE
                                            </span>
                                            {plan.popular && (
                                                <span className="px-3 py-1 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[10px] font-black text-[#E1FD3F] uppercase tracking-[0.2em]">
                                                    Best Choice
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white leading-[0.9]">
                                            {plan.title}
                                        </h2>

                                        <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl">
                                            {plan.description}
                                        </p>

                                        <div className="space-y-8">
                                            {/* Pricing Block */}
                                            <div className="flex items-end gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-white/20 text-sm font-bold line-through mb-1">De R$ {plan.oldPrice},00</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-6xl font-black tracking-tighter text-white">R$ {plan.price}</span>
                                                        <span className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">/ único</span>
                                                    </div>
                                                </div>
                                                {/* Action Button */}
                                                <button
                                                    onClick={() => handlePurchase(plan.id)}
                                                    disabled={!!loading}
                                                    className={`flex-1 group py-6 rounded-xl font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 relative overflow-hidden ${plan.highlight ? 'bg-[#A855F7] hover:bg-[#9333ea] text-white shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'bg-[#E1FD3F] hover:bg-[#d4ee3b] text-black shadow-[0_0_30px_rgba(225,253,63,0.3)]'}`}
                                                >
                                                    <span className="relative z-10">{loading === plan.id ? "Processing..." : plan.buttonText}</span>
                                                    <ArrowRight className="w-5 h-5 relative z-10" />
                                                </button>
                                            </div>

                                            {/* Data Bank / Features */}
                                            <div className="border-t border-white/10 pt-10">
                                                <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                                                    Package Contents
                                                    <div className="h-px flex-1 bg-white/10" />
                                                </h3>

                                                <div className="grid gap-3">
                                                    {plan.features.map((feature, i) => (
                                                        <div key={i} className="group relative flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default overflow-hidden">
                                                            <div className="flex items-center gap-5 relative z-10">
                                                                <div className={`w-10 h-10 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-center group-hover:border-opacity-50 transition-colors ${plan.highlight ? 'group-hover:border-[#A855F7]' : 'group-hover:border-[#E1FD3F]'}`}>
                                                                    <Check className={`w-4 h-4 text-white/40 transition-colors ${plan.highlight ? 'group-hover:text-[#A855F7]' : 'group-hover:text-[#E1FD3F]'}`} />
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-bold text-white transition-colors mb-1 ${plan.highlight ? 'group-hover:text-[#A855F7]' : 'group-hover:text-[#E1FD3F]'}`}>{feature}</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] text-white/20 uppercase tracking-wider">Access Granted</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Premium Footer */}
            <Footer />
        </main>
    );
}


