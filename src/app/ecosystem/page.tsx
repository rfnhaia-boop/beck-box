"use client";

import { motion } from "framer-motion";
import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import {
    Shield, Cpu, Zap, MessageSquare, TrendingUp,
    Award, DollarSign, Rocket, Code2,
    Database, Lock, Layers, ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EcosystemPage() {
    return (
        <main className="min-h-screen relative text-[#EFEFEF] overflow-x-hidden">
            <FuturisticBackground />

            {/* Grid mesh background */}
            <div className="fixed inset-0 -z-5 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(225, 253, 63, 0.4) 1px, transparent 1px)`,
                    backgroundSize: "80px 80px",
                    maskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, black 20%, transparent 100%)"
                }} />
            </div>

            {/* Radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#E1FD3F]/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />

            <Header />

            <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto relative z-10">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-6">
                        <Rocket className="w-4 h-4 text-[#E1FD3F]" />
                        Ecossistema Black Box
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        A Força por Trás do
                        <br />
                        <span className="text-[#E1FD3F]">Sistema Black Box</span>
                    </h1>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        Uma união estratégica entre engenharia de software de ponta e
                        metodologia de vendas comprovada que já gerou múltiplos 6 dígitos.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">

                    {/* NEW COMPANY Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-3xl border border-purple-500/20 p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <Image src="/logos/new-logo.png" alt="New Company" width={80} height={32} className="h-8 w-auto" />
                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">THE FACTORY</span>
                            </div>

                            <h2 className="text-2xl font-bold mb-4">Tech-House de Inovação</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                A <span className="text-purple-300 font-semibold">New Company</span> é uma célula de inovação
                                focada em transformar fluxos complexos em interfaces de alta fidelidade.
                                Este sistema foi construído sobre uma infraestrutura de segurança militar
                                e design futurista.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Arquitetura de Segurança</h3>
                                        <p className="text-xs text-white/40">URLs assinadas e buckets privados via Supabase</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Code2 className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Next.js 14 + Supabase</h3>
                                        <p className="text-xs text-white/40">Renderização híbrida para velocidade instantânea</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Adão AI</h3>
                                        <p className="text-xs text-white/40">Inteligência conversacional via n8n + Gemini</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#"
                                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all"
                            >
                                Desenvolva com a New Company
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>

                    {/* OTA Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-[#E1FD3F]/10 to-[#E1FD3F]/5 rounded-3xl border border-[#E1FD3F]/20 p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#E1FD3F]/20 blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <Image src="/logos/partner-logo.png" alt="OTA" width={80} height={32} className="h-6 w-auto invert" />
                                <span className="px-3 py-1 rounded-full bg-[#E1FD3F]/20 text-[#E1FD3F] text-xs font-bold">THE MINDSET</span>
                            </div>

                            <h2 className="text-2xl font-bold mb-4">Branding & Profit Strategy</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                <span className="text-[#E1FD3F] font-semibold">OTA</span> é a marca de Branding e Vendas
                                liderada pelo Otávio. A metodologia aplicada na Caixa Preta já gerou
                                múltiplos dígitos no mercado de ativos digitais. O foco é transformar
                                designers em autoridades de mercado.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[#E1FD3F]/20 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-5 h-5 text-[#E1FD3F]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Metodologia de Escala</h3>
                                        <p className="text-xs text-white/40">Design focado em conversão e percepção de valor</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[#E1FD3F]/20 flex items-center justify-center flex-shrink-0">
                                        <Award className="w-5 h-5 text-[#E1FD3F]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Brand Equity</h3>
                                        <p className="text-xs text-white/40">De operador de software a consultor de alto ticket</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-[#E1FD3F]/20 flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-5 h-5 text-[#E1FD3F]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Resultados Comprovados</h3>
                                        <p className="text-xs text-white/40">Múltiplos 6 dígitos em ativos digitais</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#"
                                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-[#E1FD3F] text-[#0a0a0a] font-bold hover:scale-105 transition-all"
                            >
                                Conheça a Metodologia OTA
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#171717] rounded-3xl border border-white/10 p-8 mb-16"
                >
                    <h2 className="text-xl font-bold mb-6 text-center">Stack Tecnológico</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { icon: Code2, label: "Next.js 14", desc: "React Framework" },
                            { icon: Database, label: "Supabase", desc: "Backend as Service" },
                            { icon: Lock, label: "RLS", desc: "Row Level Security" },
                            { icon: Layers, label: "Framer Motion", desc: "Animações" },
                            { icon: Cpu, label: "Gemini AI", desc: "Inteligência" },
                        ].map((tech, i) => (
                            <div key={i} className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                <tech.icon className="w-8 h-8 text-[#E1FD3F] mx-auto mb-2" />
                                <p className="font-bold text-sm">{tech.label}</p>
                                <p className="text-xs text-white/40">{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <p className="text-white/40 mb-4">Pronto para transformar seu negócio?</p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E1FD3F] to-[#c5df30] text-[#0a0a0a] font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-[#E1FD3F]/20"
                    >
                        <Zap className="w-5 h-5" />
                        Acessar a Black Box
                    </Link>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-20 relative z-10">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#E1FD3F] flex items-center justify-center font-black text-[#0a0a0a]">B</div>
                            <span className="text-sm text-white/40">Black Box © 2024</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-white/30">Powered by</span>
                            <Image src="/logos/new-logo.png" alt="New Company" width={40} height={16} className="h-4 w-auto opacity-60" />
                            <span className="text-white/20">×</span>
                            <Image src="/logos/partner-logo.png" alt="OTA" width={40} height={16} className="h-3 w-auto invert opacity-60" />
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}

