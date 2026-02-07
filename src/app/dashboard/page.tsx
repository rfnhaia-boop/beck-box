"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import { User, LogOut, Crown, Sparkles, Shield, Zap, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();

    const [isMounted, setIsMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Get user
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [supabase.auth]);

    const handleLogout = async () => {
        setLoggingOut(true);
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const stats = [
        { label: "Produtos", value: PRODUCTS.length - 1, icon: Sparkles, color: "text-[#E1FD3F]" },
        { label: "Downloads", value: "∞", icon: Download, color: "text-[#007AFF]" },
        { label: "Updates", value: "Free", icon: Zap, color: "text-[#E1FD3F]" },
        { label: "Suporte", value: "VIP", icon: Shield, color: "text-[#007AFF]" },
    ];

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#050505]">
                <Loader2 className="w-8 h-8 text-[#E1FD3F] animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen relative text-[#EFEFEF] overflow-x-hidden">
            <FuturisticBackground />

            {/* Futuristic Grid Mesh */}
            <div className="fixed inset-0 -z-5 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(225, 253, 63, 0.4) 1px, transparent 1px), 
                                          linear-gradient(90deg, rgba(225, 253, 63, 0.4) 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                        maskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, black 20%, transparent 100%)"
                    }}
                />
            </div>

            {/* Mouse Aura */}
            {isMounted && (
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(225, 253, 63, 0.04), transparent 40%)`
                    }}
                />
            )}

            <Header />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">

                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {/* Avatar with Glow */}
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E1FD3F] to-[#007AFF] flex items-center justify-center shadow-[0_0_30px_rgba(225,253,63,0.3)]">
                                    <User className="w-8 h-8 text-[#050505]" />
                                </div>
                                {/* Online indicator */}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#E1FD3F] border-2 border-[#050505] animate-pulse-glow" />
                            </motion.div>

                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-gradient">Bem-vindo de volta!</h1>
                                <p className="text-[#E1FD3F] text-sm font-bold tracking-[0.2em] uppercase mt-1">
                                    {user?.user_metadata?.company_name || user?.user_metadata?.full_name || "Membro de Elite"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Plan Badge */}
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/30 shadow-[0_0_20px_rgba(225,253,63,0.1)]">
                                <Crown className="w-4 h-4 text-[#E1FD3F]" />
                                <span className="text-[#E1FD3F] text-sm font-bold uppercase tracking-wider">Vitalício</span>
                            </div>

                            {/* Logout Button */}
                            <motion.button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium disabled:opacity-50"
                            >
                                {loggingOut ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <LogOut className="w-4 h-4" />
                                )}
                                {loggingOut ? "Saindo..." : "Sair"}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="relative group p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08] overflow-hidden
                                       hover:border-[#E1FD3F]/30 transition-all duration-300"
                            whileHover={{ scale: 1.02, y: -2 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E1FD3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <stat.icon className={`w-5 h-5 ${stat.color} mb-3 relative z-10`} />
                            <p className="text-3xl font-black text-white mb-1 relative z-10">{stat.value}</p>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-mono relative z-10">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Products Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black tracking-tight">Sua Biblioteca</h2>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0F0F0F] border border-white/10">
                                <div className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                </div>
                                <span className="text-[8px] font-bold tracking-widest text-green-500/80 uppercase">Online</span>
                            </div>
                        </div>
                        <Link
                            href="/library"
                            className="group flex items-center gap-2 text-sm text-[#E1FD3F] hover:underline font-bold"
                        >
                            Ver todos
                            <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PRODUCTS.filter(p => p.id !== "all").slice(0, 3).map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                        {/* Ver Todos Card */}
                        <Link href="/library">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className="group relative h-full min-h-[220px] rounded-[28px] bg-gradient-to-br from-[#E1FD3F]/10 to-[#007AFF]/10 border border-white/10 hover:border-[#E1FD3F]/40 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#E1FD3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-12 h-12 rounded-xl bg-[#E1FD3F]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-[#E1FD3F]" />
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-lg font-black text-white mb-0.5">Ver Todos</p>
                                    <p className="text-xs text-white/40">Biblioteca completa</p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
