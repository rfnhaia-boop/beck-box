"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import { Search, Grid, List, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function LibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isMounted, setIsMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setIsMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const filteredProducts = PRODUCTS.filter(p =>
        p.id !== "all" &&
        (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <main className="min-h-screen relative bg-[#050505] text-[#EFEFEF] overflow-x-hidden">
            <FuturisticBackground />

            {/* Futuristic Grid Mesh Background */}
            <div className="fixed inset-0 -z-5 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(225, 253, 63, 0.3) 1px, transparent 1px), 
                                          linear-gradient(90deg, rgba(225, 253, 63, 0.3) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)"
                    }}
                />
            </div>

            {/* Mouse Aura Effect */}
            {isMounted && (
                <div
                    className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(225, 253, 63, 0.03), transparent 40%)`
                    }}
                />
            )}

            <Header />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">

                {/* Header with Gradient Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-gradient">
                        Biblioteca
                    </h1>
                    <p className="text-white/50 text-lg max-w-2xl mx-auto">
                        Acesse todos os seus assets premium. Contratos, apresentações, vídeo aulas e muito mais.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar with Glow */}
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#E1FD3F] transition-colors duration-300" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar na biblioteca..."
                                className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-12 py-4 outline-none 
                                           focus:border-[#E1FD3F]/50 focus:bg-black/60 transition-all text-sm placeholder:text-white/20
                                           focus:shadow-[0_0_0_2px_rgba(225,253,63,0.15),0_0_30px_rgba(225,253,63,0.1)]"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-[#E1FD3F] animate-pulse-glow" />
                                <span className="text-xs font-mono text-white/50 uppercase tracking-wider">Sistema Online</span>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === "grid"
                                        ? "bg-[#E1FD3F] text-[#050505] shadow-[0_0_15px_rgba(225,253,63,0.3)]"
                                        : "text-white/40 hover:text-white hover:bg-white/5"}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === "list"
                                        ? "bg-[#E1FD3F] text-[#050505] shadow-[0_0_15px_rgba(225,253,63,0.3)]"
                                        : "text-white/40 hover:text-white hover:bg-white/5"}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-white/40 text-lg">Nenhum resultado encontrado para &quot;{searchQuery}&quot;</p>
                        </div>
                    ) : (
                        <div className={viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "flex flex-col gap-4"
                        }>
                            {filteredProducts.map((product, index) => (
                                viewMode === "grid" ? (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ) : (
                                    <motion.a
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.01, x: 4 }}
                                        className="flex items-center gap-6 p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08] 
                                                   hover:border-[#E1FD3F]/40 transition-all group relative overflow-hidden"
                                    >
                                        {/* Spotlight on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#E1FD3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 group-hover:ring-[#E1FD3F]/30 transition-all">
                                            {product.thumbnail && (
                                                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            )}
                                        </div>
                                        <div className="flex-grow relative z-10">
                                            <h3 className="text-lg font-bold text-white group-hover:text-[#E1FD3F] transition-colors">{product.title}</h3>
                                            <p className="text-sm text-white/50">{product.description}</p>
                                        </div>
                                        <div className="text-[#E1FD3F] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 relative z-10">
                                            Acessar <Zap className="w-4 h-4" />
                                        </div>
                                    </motion.a>
                                )
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Stats Footer with Terminal Style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 flex items-center justify-center gap-6"
                >
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
                        <Shield className="w-4 h-4 text-[#E1FD3F]" />
                        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                            {filteredProducts.length} produtos disponíveis
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-xs font-mono text-[#E1FD3F] uppercase tracking-wider">
                            Acesso Vitalício
                        </span>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
