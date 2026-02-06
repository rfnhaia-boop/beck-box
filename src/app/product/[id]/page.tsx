import { PRODUCTS } from "@/lib/data";
import { Header } from "@/components/ui/Header";
import { FuturisticBackground } from "@/components/ui/Background";
import { ArrowLeft, CheckCircle2, Download, FileText, Shield, Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define params type according to Next.js standards
type Props = {
    params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = PRODUCTS.find((p) => p.id === id);

    if (!product) {
        return notFound();
    }

    return (
        <main className="min-h-screen relative bg-[#101010] text-[#EFEFEF] overflow-x-hidden">
            <FuturisticBackground />
            <Header />

            <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto relative z-10">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-[#E1FD3F] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar para Biblioteca</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-center lg:text-left">

                    {/* Visual Preview Area */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative aspect-video rounded-[24px] overflow-hidden border border-white/[0.08] bg-white/[0.03] shadow-2xl group backdrop-blur-xl">
                            {product.thumbnail ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                    <FileText className="w-16 h-16 text-white/20" />
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/90 via-transparent to-transparent" />

                            {/* Play Button for video */}
                            {product.icon === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(225,253,63,0.2)]">
                                        <Play className="w-6 h-6 text-[#E1FD3F] fill-[#E1FD3F]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title & Badge Mobile Only */}
                        <div className="lg:hidden">
                            <h1 className="text-3xl font-black tracking-tight mb-2 text-[#EFEFEF]">{product.title}</h1>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[#E1FD3F] text-xs font-bold uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> Acesso Liberado
                            </div>
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-8">

                        {/* Header Desktop */}
                        <div className="hidden lg:block space-y-4">
                            <h1 className="text-5xl font-black tracking-tight leading-none text-[#EFEFEF]">
                                {product.title}
                            </h1>
                            <p className="text-lg text-white/50 font-normal leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Action Card - Liquid Glass */}
                        <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-8 relative overflow-hidden group hover:border-[#E1FD3F]/30 transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                            {/* Top Highlight */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/40 font-medium">Status</span>
                                    <span className="text-[#E1FD3F] font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#E1FD3F] animate-pulse" />
                                        Disponível
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/40 font-medium">Licença</span>
                                    <span className="text-[#EFEFEF] font-bold">Comercial & Pessoal</span>
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-xl bg-[#E1FD3F] text-[#101010] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(225,253,63,0.3)] hover:shadow-[0_0_50px_rgba(225,253,63,0.5)] flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" />
                                Baixar Agora
                            </button>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex flex-col gap-2 backdrop-blur-sm">
                                <Shield className="w-5 h-5 text-[#007AFF]" />
                                <span className="text-xs font-bold text-white/80">Verificado</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex flex-col gap-2 backdrop-blur-sm">
                                <CheckCircle2 className="w-5 h-5 text-[#E1FD3F]" />
                                <span className="text-xs font-bold text-white/80">Alta Qualidade</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
