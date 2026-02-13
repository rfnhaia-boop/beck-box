"use client";

import { motion } from "framer-motion";
import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import {
    Shield, Cpu, Zap, MessageSquare, TrendingUp,
    Award, DollarSign, Rocket, Code2,
    Database, Lock, Layers, ExternalLink, Bot
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EcosystemPage() {
    return (
        <main className="min-h-screen relative text-[#EFEFEF] overflow-x-hidden font-sans">
            <FuturisticBackground />

            {/* Grid mesh background */}
            <div className="fixed inset-0 -z-5 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(225, 253, 63, 0.4) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                    maskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 100%)"
                }} />
            </div>

            {/* Radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[#E1FD3F]/5 via-transparent to-transparent pointer-events-none" />

            <Header />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#0a0a0a] border border-[#E1FD3F]/30 text-sm mb-8 shadow-[0_0_20px_rgba(225,253,63,0.1)]">
                        <Rocket className="w-4 h-4 text-[#E1FD3F]" />
                        <span className="text-[#E1FD3F] font-semibold tracking-wide">Ecossistema Black Box</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
                        A Força por Trás do
                        <br />
                        <span className="text-[#E1FD3F] drop-shadow-[0_0_30px_rgba(225,253,63,0.3)]">Sistema Black Box</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed">
                        Uma união estratégica entre engenharia de software de ponta e
                        metodologia de vendas comprovada que já gerou múltiplos 6 dígitos.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">

                    {/* THE FACTORY - Purple Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group bg-[#0f0a14]/80 backdrop-blur-xl rounded-[2.5rem] border border-purple-500/20 p-10 relative overflow-hidden hover:border-purple-500/40 transition-all duration-500"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-600/20 transition-all duration-500" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />

                        <div className="relative z-10">
                            {/* Header Badges */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-purple-400 font-bold italic tracking-wider text-sm">NEW</span>
                                </div>
                                <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold tracking-widest uppercase">THE FACTORY</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">Tech-House de Inovação</h2>

                            <p className="text-white/50 mb-10 leading-relaxed text-sm">
                                A <span className="text-purple-400 font-semibold">New Company</span> é uma célula de inovação
                                focada em transformar fluxos complexos em interfaces de alta fidelidade.
                                Este sistema foi construído sobre uma infraestrutura de segurança
                                militar e design futurista.
                            </p>

                            <div className="space-y-4">
                                {/* Item 1 */}
                                <div className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl group/item hover:bg-purple-500/10 hover:border-purple-500/20 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                        <Shield className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white mb-1">Arquitetura de Segurança</h3>
                                        <p className="text-xs text-white/40 leading-relaxed">URLs assinadas e buckets privados via Supabase</p>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl group/item hover:bg-purple-500/10 hover:border-purple-500/20 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                        <Code2 className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white mb-1">Next.js 14 + Supabase</h3>
                                        <p className="text-xs text-white/40 leading-relaxed">Renderização híbrida para velocidade instantânea</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* THE MINDSET - Green Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group bg-[#0a0f0a]/80 backdrop-blur-xl rounded-[2.5rem] border border-[#E1FD3F]/20 p-10 relative overflow-hidden hover:border-[#E1FD3F]/40 transition-all duration-500"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1FD3F]/10 blur-[80px] rounded-full group-hover:bg-[#E1FD3F]/20 transition-all duration-500" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />

                        <div className="relative z-10">
                            {/* Header Badges */}
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[#4F4F4F] font-bold text-xl tracking-tighter">OTAH<span className="font-light">studio</span></span>
                                <span className="px-4 py-1.5 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[#E1FD3F] text-xs font-bold tracking-widest uppercase">THE MINDSET</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">Branding & Profit Strategy</h2>

                            <p className="text-white/50 mb-10 leading-relaxed text-sm">
                                <span className="text-[#E1FD3F] font-semibold">OTA</span> é a marca de Branding e Vendas
                                liderada pelo Otávio. A metodologia aplicada na Caixa Preta já gerou
                                múltiplos dígitos no mercado de ativos digitais. O foco é transformar
                                designers em autoridades de mercado.
                            </p>

                            <div className="space-y-4">
                                {/* Item 1 */}
                                <div className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl group/item hover:bg-[#E1FD3F]/10 hover:border-[#E1FD3F]/20 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                        <TrendingUp className="w-6 h-6 text-[#E1FD3F]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white mb-1">Metodologia de Escala</h3>
                                        <p className="text-xs text-white/40 leading-relaxed">Design focado em conversão e percepção de valor</p>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl group/item hover:bg-[#E1FD3F]/10 hover:border-[#E1FD3F]/20 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                        <Award className="w-6 h-6 text-[#E1FD3F]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white mb-1">Brand Equity</h3>
                                        <p className="text-xs text-white/40 leading-relaxed">De operador de software a consultor de alto ticket</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Link
                        href="/auth/register" // Redirecting to register/login flow
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E1FD3F] text-[#0a0a0a] font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-[#E1FD3F]/20"
                    >
                        <Zap className="w-5 h-5" />
                        Acessar a Black Box
                    </Link>
                </motion.div>
            </div>

            {/* Floating Chat Button */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 right-8 z-50"
            >
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-[#E1FD3F] blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
                    <div className="relative w-14 h-14 bg-[#E1FD3F] rounded-full flex items-center justify-center text-[#0a0a0a] shadow-xl transition-transform group-hover:scale-110">
                        {/* Using MessageSquare as fallback if Bot isn't imported, but assuming we can add it */}
                        <Bot className="w-7 h-7" />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-[#E1FD3F]" />
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

