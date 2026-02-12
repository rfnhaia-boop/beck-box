"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Download, ChevronRight, Filter, ShieldCheck, Clock, Tag, ExternalLink, Briefcase, FileCode, Lock } from "lucide-react";
import { useState } from "react";
import { Product, ContractCategory, ContractTemplate } from "@/lib/data";

interface ContractHubProps {
    product: Product;
}

export function ContractHub({ product }: ContractHubProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const filteredCategories = product.categories?.map(cat => ({
        ...cat,
        contracts: cat.contracts.filter(c =>
            (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedCategory === "all" || cat.id === selectedCategory)
        )
    })).filter(cat => cat.contracts.length > 0);

    return (
        <div className="space-y-12">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="Buscar contratos, termos ou cláusulas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#0A0A0A] border border-white/5 text-sm text-white focus:outline-none focus:border-[#E1FD3F]/30 transition-all font-medium placeholder:text-white/20"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === "all"
                                ? 'bg-[#E1FD3F] text-black shadow-[0_0_20px_rgba(225,253,63,0.2)]'
                                : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                            }`}
                    >
                        Todos
                    </button>
                    {product.categories?.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-[#E1FD3F] text-black shadow-[0_0_20px_rgba(225,253,63,0.2)]'
                                    : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {cat.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contract List */}
            <div className="grid gap-16">
                {filteredCategories?.map((category, catIdx) => (
                    <div key={category.id} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center border border-[#E1FD3F]/30">
                                <Briefcase className="w-5 h-5 text-[#E1FD3F]" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-white">{category.title}</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.contracts.map((contract, i) => (
                                <motion.div
                                    key={contract.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative"
                                >
                                    <div className="h-full p-8 rounded-[32px] bg-[#0A0A0A] border border-white/5 hover:border-[#E1FD3F]/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col">
                                        {/* Status / Tags */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex gap-2">
                                                {contract.tags?.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 rounded-lg bg-white/5 text-[9px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-[10px] font-mono text-white/20 group-hover:text-[#E1FD3F] transition-colors">
                                                .{contract.fileType}
                                            </div>
                                        </div>

                                        {/* Title area */}
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#E1FD3F] transition-colors mb-3">
                                                {contract.title}
                                            </h3>
                                            <p className="text-sm text-white/40 leading-relaxed font-medium line-clamp-2">
                                                {contract.description}
                                            </p>
                                        </div>

                                        {/* Metadata */}
                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30">
                                                    <Clock className="w-3 h-3" />
                                                    {contract.fileSize}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-500/50">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    VERIFICADO
                                                </div>
                                            </div>

                                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#E1FD3F] group-hover:text-black transition-all">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Hover decoration */}
                                        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#E1FD3F]/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Need something custom? */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 text-center mt-12 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1FD3F] blur-[120px] opacity-[0.03] pointer-events-none" />
                <Lock className="w-10 h-10 text-white/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-3">Não encontrou o que precisava?</h3>
                <p className="text-white/40 text-sm max-w-xl mx-auto mb-8 font-medium">
                    Nossa equipe jurídica pode elaborar um contrato personalizado para sua demanda específica. Entre em contato com seu gestor de conta.
                </p>
                <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Solicitar Template Personalizado
                </button>
            </motion.div>
        </div>
    );
}
