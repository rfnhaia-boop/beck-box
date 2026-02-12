"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { motion } from "framer-motion";
import { Shield, Cpu, Zap, TrendingUp, Award, Box } from "lucide-react";

export default function EcosystemPage() {
    return (
        <main className="min-h-screen relative bg-[#050505] text-[#EFEFEF] overflow-x-hidden">
            <FuturisticBackground />
            <Header />

            <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto relative z-10">
                {/* Badge */}
                <div className="flex justify-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E1FD3F]"
                    >
                        <Zap className="w-3 h-3" />
                        Ecossistema Black Box
                    </motion.div>
                </div>

                {/* Title Section */}
                <div className="text-center mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
                    >
                        A Força por Trás do <br />
                        <span className="text-[#E1FD3F]">Sistema Black Box</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/40 max-w-2xl mx-auto font-medium"
                    >
                        Uma união estratégica entre engenharia de software de ponta e metodologia de vendas comprovada que já gerou múltiplos 6 dígitos.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* The Factory - Tech House */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group p-1 bg-gradient-to-br from-purple-500/20 to-transparent rounded-[32px] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#0A0A0A] rounded-[31px] m-px" />
                        <div className="relative p-12 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-3">
                                    <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-[10px] font-black uppercase tracking-widest text-purple-400 italic">NEW</span>
                                    <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 italic">THE FACTORY</span>
                                </div>
                                <Box className="w-8 h-8 text-purple-500/20" />
                            </div>

                            <h2 className="text-3xl font-black text-white mb-6">Tech-House de Inovação</h2>
                            <p className="text-white/40 leading-relaxed mb-12 font-medium">
                                A <span className="text-white font-bold italic">New Company</span> é uma célula de inovação focada em transformar fluxos complexos em interfaces de alta fidelidade. Este sistema foi construído sobre uma infraestrutura de segurança militar e design futurista.
                            </p>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 group-hover:border-purple-500/20 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-0.5">Arquitetura de Segurança</h4>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider">URLs assinadas e buckets privados via Supabase</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 group-hover:border-purple-500/20 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Cpu className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-0.5">Next.js 14 + Supabase</h4>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Renderização híbrida para velocidade instantânea</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* The Mindset - Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative group p-1 bg-gradient-to-br from-[#E1FD3F]/20 to-transparent rounded-[32px] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#0A0A0A] rounded-[31px] m-px" />
                        <div className="relative p-12 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-black text-white group-hover:text-[#E1FD3F] transition-colors">OTAHSTUDIO</span>
                                    </div>
                                    <span className="px-3 py-1 rounded-lg bg-[#E1FD3F]/10 text-[10px] font-black uppercase tracking-widest text-[#E1FD3F] italic">THE MINDSET</span>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-white mb-6">Branding & Profit Strategy</h2>
                            <p className="text-white/40 leading-relaxed mb-12 font-medium">
                                <span className="text-[#E1FD3F] font-bold italic">OTA</span> é a marca de Branding e Vendas liderada pelo Olávio. A metodologia aplicada na Caixa Preta já gerou múltiplos dígitos no mercado de ativos digitais. O foco é transformar designers em autoridades de mercado.
                            </p>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 group-hover:border-[#E1FD3F]/20 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-[#E1FD3F]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-0.5">Metodologia de Escala</h4>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Design focado em conversão e percepção de valor</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 group-hover:border-[#E1FD3F]/20 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-[#E1FD3F]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-0.5">Brand Equity</h4>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider">De operador de software a consultor de alto ticket</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
