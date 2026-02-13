"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { PRODUCTS } from "@/lib/data";
import { ArrowLeft, Download, FileText, Lock, Shield, Star, Video, Zap, ExternalLink, Presentation } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CoursePlayer } from "@/components/ui/CoursePlayer";
import { ContractHub } from "@/components/ui/ContractHub";

export default function ProductPage() {
    const params = useParams<{ id: string }>();
    const product = PRODUCTS.find(p => p.id === params?.id);
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (product?.eliteOnly) {
                if (user?.user_metadata?.plan === 'elite') {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            } else {
                setHasAccess(true);
            }
            setLoading(false);
        };
        checkAccess();
    }, [product, supabase.auth]);

    if (!product) {
        notFound();
    }

    // Mock files for the viewer
    const mockFiles = [
        { name: "Guia Completo.pdf", size: "2.4 MB", type: "pdf" },
        { name: "Template Editável.docx", size: "1.1 MB", type: "doc" },
        { name: "Visual Assets.zip", size: "154 MB", type: "zip" },
    ];

    return (
        <main className="min-h-screen relative bg-[#050505] text-[#EFEFEF] overflow-x-hidden font-sans selection:bg-[#E1FD3F] selection:text-black">
            <FuturisticBackground />
            <Header />

            <div className={`pt-32 pb-20 px-6 mx-auto relative z-10 ${product.id === "2" ? "max-w-7xl" : "max-w-6xl"}`}>
                {/* Back Link */}
                <Link
                    href="/sede"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-[#E1FD3F] mb-12 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Retornar à Base</span>
                </Link>

                {!loading && (
                    <>
                        {hasAccess ? (
                            product.id === "2" ? (
                                <CoursePlayer product={product} />
                            ) : product.link && product.link.startsWith("http") ? (
                                <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A0A0A]">
                                    {/* Animated Grid Background */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,transparent,black)]" />

                                    <div className="relative z-10 flex flex-col items-center justify-center py-24 px-6 text-center">
                                        <div className="mb-8 relative">
                                            <div className="absolute inset-0 bg-[#E1FD3F] blur-3xl opacity-20 animate-pulse" />
                                            <div className="relative w-24 h-24 rounded-2xl bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 flex items-center justify-center">
                                                {product.id === "2" ? <Presentation className="w-10 h-10 text-[#E1FD3F]" /> : <Zap className="w-10 h-10 text-[#E1FD3F]" />}

                                                {/* Corner Accents */}
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E1FD3F]" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E1FD3F]" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#E1FD3F]" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#E1FD3F]" />
                                            </div>
                                        </div>

                                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                            {product.title}
                                        </h2>

                                        <p className="text-white/40 max-w-lg mb-12 text-lg font-medium leading-relaxed">
                                            Recurso externo seguro. O acesso será redirecionado para um ambiente verificado.
                                        </p>

                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn relative inline-flex items-center gap-4 px-10 py-5 rounded-xl bg-[#E1FD3F] text-[#050505] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-[0_0_40px_rgba(225,253,63,0.3)]"
                                        >
                                            <span className="relative z-10">Inicializar Conexão</span>
                                            <ExternalLink className="w-4 h-4 relative z-10" />
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                        </a>

                                        <div className="mt-8 flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] uppercase tracking-widest text-white/20 font-mono">Link Secure Connection: Active</span>
                                        </div>
                                    </div>
                                </div>
                            ) : product.id === "1" ? (
                                <ContractHub product={product} />
                            ) : (
                                <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">
                                    {/* Left Column: Asset Preview */}
                                    <div className="space-y-6 sticky top-32">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-[#0A0A0A] relative group shadow-2xl"
                                        >
                                            {product.thumbnail ? (
                                                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center ${product.color.replace("text-", "bg-").replace("bg-", "text-")}/5`}>
                                                    <Zap className="w-24 h-24 opacity-10" />
                                                </div>
                                            )}

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

                                            {/* Tech Badges */}
                                            <div className="absolute top-6 left-6 flex gap-2">
                                                <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-wider">
                                                    v2.4.0
                                                </div>
                                            </div>
                                        </motion.div>

                                        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Asset Metadata</h3>
                                                <div className="w-1.5 h-1.5 bg-[#E1FD3F] rounded-full animate-pulse" />
                                            </div>
                                            <div className="space-y-4 text-sm">
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-white/40 font-medium">Type</span>
                                                    <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded">ZIP Archive</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-white/40 font-medium">Size</span>
                                                    <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded">154.2 MB</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-white/40 font-medium">License</span>
                                                    <span className="text-[#E1FD3F] font-mono text-xs bg-[#E1FD3F]/10 px-2 py-1 rounded border border-[#E1FD3F]/20">Commercial</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-white/40 font-medium">Last Update</span>
                                                    <span className="text-white font-mono text-xs">2026-02-08</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Content & Downloads */}
                                    <div className="flex flex-col">
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                                {product.eliteOnly && (
                                                    <span className="px-3 py-1 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/20 text-[10px] font-black text-[#A855F7] uppercase tracking-[0.2em]">
                                                        Elite Clearance
                                                    </span>
                                                )}
                                                <span className={`px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] ${product.color}`}>
                                                    {product.icon.toUpperCase()} Module
                                                </span>
                                            </div>

                                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white leading-[0.9]">
                                                {product.title}
                                            </h1>

                                            <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl">
                                                {product.description}
                                            </p>

                                            <div className="space-y-8">
                                                {/* Primary Action */}
                                                <button className="group w-full py-6 rounded-2xl bg-[#E1FD3F] text-[#050505] font-black uppercase tracking-[0.2em] hover:bg-[#d4ee3b] transition-all shadow-[0_0_40px_rgba(225,253,63,0.2)] hover:shadow-[0_0_60px_rgba(225,253,63,0.4)] flex items-center justify-center gap-4 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                    <Download className="w-6 h-6" />
                                                    <span className="relative z-10">Download Master File</span>
                                                </button>

                                                {/* Data Bank */}
                                                <div className="border-t border-white/10 pt-10">
                                                    <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                                                        Data Bank
                                                        <div className="h-px flex-1 bg-white/10" />
                                                    </h3>

                                                    <div className="grid gap-3">
                                                        {mockFiles.map((file, i) => (
                                                            <div key={i} className="group relative flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer overflow-hidden">
                                                                {/* Hover scanline */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                                                                <div className="flex items-center gap-5 relative z-10">
                                                                    <div className="w-12 h-12 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-center group-hover:border-[#E1FD3F]/50 transition-colors">
                                                                        <FileText className="w-5 h-5 text-white/40 group-hover:text-[#E1FD3F] transition-colors" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-white group-hover:text-[#E1FD3F] transition-colors mb-1">{file.name}</p>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">{file.type}</span>
                                                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                                                            <span className="text-[10px] text-white/30 font-mono">{file.size}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#E1FD3F] group-hover:text-black group-hover:border-[#E1FD3F] transition-all">
                                                                    <Download className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )
                        ) : (
                            // LOCKED STATE
                            <div className="min-h-[60vh] flex items-center justify-center">
                                <div className="max-w-2xl w-full p-12 rounded-[32px] bg-[#0A0A0A] border border-red-500/20 text-center relative overflow-hidden">
                                    {/* Scanlines & Noise */}
                                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_20px_#ef4444]" />

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-8 relative">
                                            <Lock className="w-10 h-10 text-red-500" />
                                            <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping opacity-50" />
                                        </div>

                                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                                            ACCESS <span className="text-red-500">DENIED</span>
                                        </h2>

                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-6" />

                                        <p className="text-white/50 text-lg mb-10 max-w-md">
                                            Nível de segurança insuficiente. Este módulo requer credenciais <span className="text-white font-bold">Elite</span> ou superior para descriptografia.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                            <Link
                                                href="/plans"
                                                className="px-8 py-4 rounded-xl bg-red-500 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 transition-colors shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                                            >
                                                Adquirir Credenciais
                                            </Link>
                                            <Link
                                                href="/sede"
                                                className="px-8 py-4 rounded-xl border border-white/10 text-white/60 font-black uppercase tracking-[0.2em] text-xs hover:bg-white/5 transition-colors"
                                            >
                                                Voltar à Base
                                            </Link>
                                        </div>

                                        <div className="mt-12 font-mono text-[10px] text-red-500/40 uppercase tracking-[0.3em]">
                                            Error Code: 403_FORBIDDEN_ACCESS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
