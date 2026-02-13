"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { LiquidGlass } from "@/components/ui/LiquidGlass";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    Rocket,
    Check,
    ArrowRight,
    Shield,
    PlayCircle,
    FolderOpen,
    Sparkles,
    MessageSquare,
    Monitor,
    ShieldAlert,
    XCircle,
    CheckCircle2
} from "lucide-react";
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
        <main className="min-h-screen relative bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-[#E1FD3F] selection:text-black">
            <FuturisticBackground />
            <Header />

            {/* --- SECTION 1: THE HERO --- */}
            <section className="relative z-10 pt-48 pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[#E1FD3F] text-[10px] font-black uppercase tracking-[0.3em] mb-12"
                    >
                        <Sparkles className="w-3 h-3" />
                        Arsenal Visual de Elite
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 max-w-5xl"
                    >
                        Você não fecha contratos de 5 dígitos porque você ainda <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">fala de design, não de negócio.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto font-medium leading-relaxed mb-16"
                    >
                        Baixe a "Blackbox" do Otahstudio: Os arquivos editáveis de Apresentação e Contrato que usamos para fechar projetos High-Ticket.
                    </motion.p>

                    {/* Pricing & CTA Unit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-[#E1FD3F] text-xs font-black uppercase tracking-widest mb-2 opacity-50 text-center">Invista apenas</span>
                            <div className="text-6xl font-black text-white flex items-start gap-2">
                                <span className="text-2xl mt-4">R$</span>
                                <span className="tracking-tighter">57,00</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePurchase}
                            disabled={loading || checkingAccess}
                            className="h-20 px-12 rounded-2xl bg-[#E1FD3F] text-black font-black uppercase tracking-[0.2em] text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(225,253,63,0.2)] flex items-center gap-4 hover:bg-[#d4f030]"
                        >
                            {loading ? "PROCESSANDO..." : "BAIXAR ARSENAL VISUAL AGORA"}
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Acesso vitalício + Aula Bônus</p>
                    </motion.div>

                    {/* Hero Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="mt-32 relative w-full max-w-5xl aspect-video mx-auto"
                    >
                        <div className="absolute inset-0 bg-[#E1FD3F]/20 blur-[120px] rounded-full pointer-events-none opacity-30" />
                        <div className="relative bg-[#101010]/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-4 md:p-8 flex items-center justify-center overflow-hidden h-full shadow-2xl">
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent z-10" />
                            <div className="grid grid-cols-12 gap-4 w-full h-full opacity-40">
                                <div className="col-span-8 bg-white/5 rounded-3xl" />
                                <div className="col-span-4 space-y-4">
                                    <div className="h-1/2 bg-white/5 rounded-3xl" />
                                    <div className="h-1/2 bg-white/5 rounded-3xl" />
                                </div>
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                <div className="w-32 h-32 rounded-3xl bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 flex items-center justify-center mb-6">
                                    <FolderOpen className="w-16 h-16 text-[#E1FD3F]" />
                                </div>
                                <span className="text-[#E1FD3F]/40 font-mono tracking-[0.5em] text-sm uppercase">[ ASSETS_30K_PREVIEW ]</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 2: THE PROBLEM (UGLINESS TAX) --- */}
            <section className="relative z-10 py-32 px-6 border-y border-white/5 bg-black/40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-black text-[#E1FD3F] tracking-[0.3em] uppercase mb-4">O Imposto do Amadorismo</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Por que você perde a venda.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: MessageSquare,
                                title: "Orçamento via WhatsApp.",
                                desc: "Você envia um PDF solto e torce para ser respondido. Sem narrativa, sem controle."
                            },
                            {
                                icon: Monitor,
                                title: "Design Bom, Apresentação Muda.",
                                desc: "Seu portfólio é ótimo, mas seus slides de venda não conduzem o cliente e não ancoram o valor."
                            },
                            {
                                icon: ShieldAlert,
                                title: "Insegurança Jurídica.",
                                desc: "Você aceita os termos do cliente e leva calote porque não sabe impor suas regras em contrato."
                            }
                        ].map((pain, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#E1FD3F]/20 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:text-[#E1FD3F] transition-colors mb-8">
                                    <pain.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black text-white mb-4">{pain.title}</h4>
                                <p className="text-white/40 font-medium leading-relaxed">{pain.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: THE SOLUTION (INSIDE THE BOX) --- */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-32">
                        <h2 className="text-sm font-black text-[#E1FD3F] tracking-[0.3em] uppercase mb-4">A Armadura de Fechamento</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight">O que você recebe:</h3>
                    </div>

                    <div className="space-y-40">
                        {[
                            {
                                title: "A PROPOSTA IRRECUSÁVEL.",
                                desc: "Template editável focado em Ancoragem de Preço. Estruturado para guiar o olho do cliente até o 'Sim', eliminando a comparação por preço.",
                                visual: "DOC_PROPOSAL_v1",
                                icon: FolderOpen
                            },
                            {
                                title: "O ROTEIRO VISUAL (DECK).",
                                desc: "Não gagueje. Os slides conduzem a reunião por você, do problema à solução. Minimalista e imponente.",
                                visual: "SLIDE_SYSTEM_v1",
                                icon: Monitor
                            },
                            {
                                title: "O CONTRATO BLINDADO.",
                                desc: "Modelo jurídico com comentários estratégicos (em vermelho). Proteja seu caixa e imponha respeito com multas e prazos claros.",
                                visual: "LEGAL_PROTOCOL_v1",
                                icon: Shield
                            },
                            {
                                title: "AULA DE DEBRIEFING.",
                                desc: "Eu te mostro em vídeo como apresentar esses arquivos na vida real e como lidar com cada impasse comercial.",
                                visual: "MASTERCLASS_LIVE",
                                icon: PlayCircle
                            }
                        ].map((module, i) => (
                            <div key={i} className={`flex flex-col md:flex-row items-center gap-20 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 flex items-center justify-center text-[#E1FD3F]">
                                            <module.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1FD3F]">Módulo 0{i + 1}</span>
                                    </div>
                                    <h4 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">{module.title}</h4>
                                    <p className="text-xl text-white/40 leading-relaxed font-medium mb-12 max-w-xl">
                                        {module.desc}
                                    </p>
                                </div>
                                <div className="flex-1 w-full relative group">
                                    <div className="absolute inset-0 bg-[#E1FD3F]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                                    <LiquidGlass intensity="high" className="w-full aspect-[4/3] md:aspect-square rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden bg-[#0A0A0A]">

                                        {/* Background Grid Pattern */}
                                        <div className="absolute inset-0 opacity-20"
                                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                        />

                                        {/* VISUAL MOCKUPS SWITCH - CENTERED CONTAINER */}
                                        <div className="relative w-full h-full flex items-center justify-center p-8">
                                            {module.visual === "DOC_PROPOSAL_v1" && (
                                                /* PROPOSAL MOCKUP - High Fidelity Document */
                                                <div className="relative w-48 h-64 bg-white rounded-lg shadow-2xl rotate-[-6deg] group-hover:rotate-0 transition-transform duration-500 flex flex-col p-6 border border-white/20">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                                            <div className="w-3 h-3 bg-[#E1FD3F] rounded-full" />
                                                        </div>
                                                        <div className="px-2 py-1 bg-[#E1FD3F] text-black text-[8px] font-black uppercase tracking-wider rounded">
                                                            Aprovado
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3 mb-auto">
                                                        <div className="h-2 w-24 bg-black/10 rounded" />
                                                        <div className="h-2 w-16 bg-black/10 rounded" />
                                                    </div>
                                                    <div className="space-y-2 opacity-50">
                                                        <div className="h-1 w-full bg-black/20 rounded" />
                                                        <div className="h-1 w-full bg-black/20 rounded" />
                                                        <div className="h-1 w-full bg-black/20 rounded" />
                                                        <div className="h-1 w-3/4 bg-black/20 rounded" />
                                                    </div>
                                                    <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-end">
                                                        <div className="h-8 w-24 bg-black/5 rounded" />
                                                        <div className="text-[10px] font-bold text-black">R$ 15.000</div>
                                                    </div>
                                                </div>
                                            )}

                                            {module.visual === "SLIDE_SYSTEM_v1" && (
                                                /* DECK MOCKUP - Presentation Software View */
                                                <div className="relative w-72 h-44 bg-[#151515] rounded-xl border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden flex flex-col">
                                                    {/* Toolbar */}
                                                    <div className="h-8 bg-[#222] border-b border-white/5 flex items-center px-4 justify-between">
                                                        <div className="flex gap-1.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                                        </div>
                                                        <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                                                    </div>
                                                    <div className="flex flex-1 overflow-hidden">
                                                        {/* Sidebar */}
                                                        <div className="w-12 border-r border-white/5 bg-[#1A1A1A] flex flex-col gap-2 p-2">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className={`w-full aspect-video rounded border ${i === 1 ? 'border-[#E1FD3F] bg-[#E1FD3F]/10' : 'border-white/5 bg-white/5'}`} />
                                                            ))}
                                                        </div>
                                                        {/* Main Stage */}
                                                        <div className="flex-1 p-4 bg-[#111] flex items-center justify-center">
                                                            <div className="w-full h-full bg-[#000] border border-white/5 rounded flex flex-col justify-center items-center shadow-lg relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1FD3F]/20 blur-[40px] rounded-full" />
                                                                <div className="z-10 text-center space-y-2">
                                                                    <div className="h-3 w-32 bg-white rounded mx-auto" />
                                                                    <div className="h-1.5 w-20 bg-[#E1FD3F] rounded mx-auto" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {module.visual === "LEGAL_PROTOCOL_v1" && (
                                                /* CONTRACT MOCKUP - Digital Signing */
                                                <div className="relative w-56 h-72 bg-[#F5F5F5] rounded-lg shadow-2xl rotate-[3deg] group-hover:rotate-0 transition-transform duration-500 flex flex-col border border-white/20">
                                                    <div className="h-8 border-b border-black/5 flex items-center px-4 justify-between bg-white rounded-t-lg">
                                                        <span className="text-[8px] font-bold text-gray-400">DOC-2024-001.PDF</span>
                                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    </div>
                                                    <div className="p-6 flex-1 flex flex-col relative">
                                                        <div className="space-y-3 mb-6">
                                                            <div className="h-2 w-1/3 bg-black rounded" />
                                                            <div className="space-y-1.5 opacity-60">
                                                                <div className="h-1 w-full bg-black rounded" />
                                                                <div className="h-1 w-full bg-black rounded" />
                                                                <div className="h-1 w-2/3 bg-black rounded" />
                                                            </div>
                                                        </div>

                                                        {/* Highlighted Clause */}
                                                        <div className="p-3 bg-red-50 border-l-2 border-red-500 rounded-r mb-4">
                                                            <div className="h-1.5 w-16 bg-red-500/50 rounded mb-1" />
                                                            <div className="h-1 w-3/4 bg-red-500/20 rounded" />
                                                        </div>

                                                        {/* Signature Area */}
                                                        <div className="mt-auto border-t border-black/10 pt-4">
                                                            <div className="flex justify-between items-end">
                                                                <div className="font-handwriting text-blue-600 text-lg rotate-[-5deg]">Rafael</div>
                                                                <div className="px-3 py-1.5 bg-[#E1FD3F] text-black text-[8px] font-bold uppercase rounded shadow-sm">
                                                                    Assinado Digitalmente
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {module.visual === "MASTERCLASS_LIVE" && (
                                                /* VIDEO MOCKUP - Course Player */
                                                <div className="relative w-72 h-44 bg-[#050505] rounded-xl border border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden flex flex-col">
                                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />

                                                    {/* Header */}
                                                    <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
                                                        <div className="flex gap-2">
                                                            <div className="w-8 h-8 rounded bg-white/10 backdrop-blur flex items-center justify-center">
                                                                <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-white font-bold">Aula 01: O Início</div>
                                                                <div className="text-[8px] text-white/50">Módulo Implementação</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Controls */}
                                                    <div className="mt-auto p-3 relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent">
                                                        <div className="h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
                                                            <div className="h-full w-1/3 bg-[#E1FD3F]" />
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-2 text-white/70">
                                                                <div className="w-3 h-3 bg-white/20 rounded" />
                                                                <div className="w-3 h-3 bg-white/20 rounded" />
                                                            </div>
                                                            <div className="px-2 py-0.5 rounded bg-white/10 text-[8px] text-white">
                                                                1080p
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="w-12 h-12 rounded-full bg-[#E1FD3F] flex items-center justify-center shadow-lg shadow-[#E1FD3F]/40 scale-0 group-hover:scale-100 transition-transform duration-300">
                                                            <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Label Tag */}
                                        <div className="absolute bottom-6 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-mono">
                                            {module.visual}
                                        </div>

                                    </LiquidGlass>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: THE TRANSFORMATION --- */}
            <section className="relative z-10 py-32 px-6 border-y border-white/5 bg-black/40">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-black text-[#E1FD3F] tracking-[0.3em] uppercase mb-4">A Evolução do Status</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Pare de vender "Arte", venda Negócio.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-[2.5rem] overflow-hidden border border-white/10">
                        {/* Side Before */}
                        <div className="p-12 md:p-16 bg-[#050505] flex flex-col gap-8">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4B4B] flex items-center gap-2">
                                <XCircle className="w-3 h-3" /> O Amador
                            </span>
                            <ul className="space-y-6">
                                {[
                                    "Vende apenas execução e horas",
                                    "PDF básico sem narrativa",
                                    "Postura insegura na reunião",
                                    "Termos impostos pelo cliente",
                                    "Insegurança contra calotes"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-white/30 text-base font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Side After */}
                        <div className="p-12 md:p-16 bg-[#0A0A0A] flex flex-col gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-[#E1FD3F]/5 blur-[80px] rounded-full pointer-events-none" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#E1FD3F] flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> O Estrategista (Ação 30k)
                            </span>
                            <ul className="space-y-6">
                                {[
                                    "Vende valor e ROI claro",
                                    "Apresentação Visual de Cinema",
                                    "Postura firme e autoritária",
                                    "Regras do jogo são suas",
                                    "Contrato Blindado e Multas"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-white/80 text-base font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#E1FD3F]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 5: FINAL OFFER --- */}
            <section className="relative z-10 py-48 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-16 leading-tight">
                        Quanto custa 100 horas de trabalho para criar isso do zero? <br />
                        Quanto custa <span className="text-[#FF4B4B] italic underline decoration-[#FF4B4B]/30">um calote de 5k</span> que você levou?
                    </h3>

                    <div className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#E1FD3F]/5 pointer-events-none" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="text-left space-y-6">
                                {[
                                    "Template de Proposta High-Ticket",
                                    "Deck de Apresentação Visual",
                                    "Contrato Modelo Comentado",
                                    "Aula Bônus de Implementação"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-white font-bold uppercase text-xs tracking-widest">
                                        <div className="w-6 h-6 rounded-full bg-[#E1FD3F] flex items-center justify-center">
                                            <Check className="w-3 h-3 text-black" />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-8">
                                <div className="text-right">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30 block mb-2">Pagamento Único</span>
                                    <div className="text-7xl md:text-8xl font-black text-white leading-none">
                                        R$ 57
                                    </div>
                                </div>
                                <button
                                    onClick={handlePurchase}
                                    disabled={loading || checkingAccess}
                                    className="w-full md:w-auto h-20 px-12 rounded-2xl bg-[#E1FD3F] text-black font-black uppercase tracking-[0.2em] text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(225,253,63,0.4)] flex items-center justify-center gap-4 hover:bg-[#d4f030]"
                                >
                                    {loading ? "PROCESSANDO..." : "QUERO O ARSENAL COMPLETO"}
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
