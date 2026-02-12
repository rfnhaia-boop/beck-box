"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { PRODUCTS } from "@/lib/data";
import { ArrowLeft, Download, FileText, Lock, Shield, Star, Video, Zap } from "lucide-react";
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
        <main className="min-h-screen relative bg-[#050505] text-[#EFEFEF] overflow-x-hidden">
            <FuturisticBackground />
            <Header />

            <div className={`pt-32 pb-20 px-6 mx-auto relative z-10 ${product.id === "2" ? "max-w-7xl" : "max-w-5xl"}`}>
                {/* Back Link */}
                <Link
                    href="/library"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-[#E1FD3F] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar para o Bunker
                </Link>

                {!loading && (
                    <>
                        {hasAccess ? (
                            product.id === "2" ? (
                                <CoursePlayer product={product} />
                            ) : product.id === "1" ? (
                                <ContractHub product={product} />
                            ) : (
                                <div className="grid md:grid-cols-2 gap-12">
                                    {/* Left Column: Image & Details */}
                                    <div className="space-y-8">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5 relative group"
                                        >
                                            {product.thumbnail ? (
                                                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center ${product.color.replace("text-", "bg-").replace("bg-", "text-")}/20`}>
                                                    <Zap className="w-20 h-20 opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                                        </motion.div>

                                        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
                                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Detalhes do Asset</h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between border-b border-white/5 pb-2">
                                                    <span className="text-white/60">Formato</span>
                                                    <span className="text-white font-mono">Digital Download</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-2">
                                                    <span className="text-white/60">Tamanho</span>
                                                    <span className="text-white font-mono">~150MB</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-2">
                                                    <span className="text-white/60">Licença</span>
                                                    <span className="text-white font-mono">Uso Comercial</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-white/60">Atualizado em</span>
                                                    <span className="text-white font-mono">08/02/2026</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Content & Actions */}
                                    <div className="flex flex-col">
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                {product.eliteOnly && (
                                                    <span className="px-2 py-0.5 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/40 text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">
                                                        Elite Exclusive
                                                    </span>
                                                )}
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.color}`}>
                                                    {product.icon.toUpperCase()}
                                                </span>
                                            </div>

                                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">
                                                {product.title}
                                            </h1>

                                            <p className="text-lg text-white/60 leading-relaxed mb-8">
                                                {product.description}
                                                <br /><br />
                                                Tenha acesso imediato aos arquivos originais. Utilize este material para acelerar seus resultados e profissionalizar suas entregas. Todo o conteúdo foi validado em campo de batalha.
                                            </p>

                                            <div className="space-y-6">
                                                <button className="w-full py-4 rounded-xl bg-[#E1FD3F] text-[#050505] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(225,253,63,0.3)] flex items-center justify-center gap-2">
                                                    <Download className="w-5 h-5" /> Fazer Download Completo
                                                </button>

                                                <div className="space-y-3">
                                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Arquivos Inclusos</h3>
                                                    {mockFiles.map((file, i) => (
                                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group cursor-pointer">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-[#E1FD3F]/10 text-[#E1FD3F] flex items-center justify-center">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-white group-hover:text-[#E1FD3F] transition-colors">{file.name}</p>
                                                                    <p className="text-[10px] text-white/40">{file.size}</p>
                                                                </div>
                                                            </div>
                                                            <Download className="w-4 h-4 text-white/20 group-hover:text-[#E1FD3F] transition-colors" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="mt-12">
                                <div className="p-8 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/10 via-transparent to-[#A855F7]/10 animate-pulse pointer-events-none" />
                                    <Lock className="w-8 h-8 text-[#A855F7] mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Conteúdo Bloqueado</h3>
                                    <p className="text-white/60 text-sm mb-6">Esta ferramenta é exclusiva para membros da Elite. Faça o upgrade agora para desbloquear.</p>
                                    <Link
                                        href="/#pricing"
                                        className="inline-block px-12 py-3 rounded-xl bg-[#A855F7] text-white font-bold uppercase tracking-widest hover:bg-[#9333ea] transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                    >
                                        Desbloquear Acesso
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
