"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { motion } from "framer-motion";
import { User, LogOut, Crown, Sparkles, Shield, Zap, Download, Loader2, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Get user and profile
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // Fetch profile for logo
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("logo_url")
                    .eq("id", user.id)
                    .single();
                if (profile?.logo_url) setLogoUrl(profile.logo_url);
            }
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
        { label: "Downloads", value: "∞", icon: Download, color: "text-[#A855F7]" },
        { label: "Updates", value: "Free", icon: Zap, color: "text-[#E1FD3F]" },
        { label: "Suporte", value: "VIP", icon: Shield, color: "text-[#A855F7]" },
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
                        backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), 
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
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(225, 253, 63, 0.03), rgba(168, 85, 247, 0.02) 50%, transparent 60%)`
                    }}
                />
            )}

            <Header />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">

                {/* Welcome Section with Technical Grid */}
                <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 relative"
                >
                    {/* Technical Grid Background */}
                    <div className="absolute inset-0 -m-6 rounded-3xl overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-40"
                            style={{
                                backgroundImage: `linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)`,
                                backgroundSize: "24px 24px"
                            }}
                        />
                        {/* Edge fade mask */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-5">
                            {/* Squircle Avatar with Gradient - Clickable */}
                            <Link href="/settings">
                                <motion.div
                                    className="relative group cursor-pointer"
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {/* Outer glow ring */}
                                    <div className="absolute -inset-1 bg-gradient-to-br from-[#A855F7] via-[#E1FD3F] to-[#A855F7] rounded-2xl opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />

                                    {/* Avatar container */}
                                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#E1FD3F] flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] overflow-hidden">
                                        {logoUrl ? (
                                            <Image src={logoUrl} alt="Logo" fill className="object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-[#050505]" />
                                        )}

                                        {/* Hover overlay with settings icon */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Settings className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* LED Status Indicator with Ping Animation */}
                                    <div className="absolute -bottom-1 -right-1">
                                        <span className="absolute inline-flex h-4 w-4 rounded-full bg-[#c9ff00] opacity-75 animate-ping" />
                                        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#c9ff00] border-2 border-[#050505] shadow-[0_0_10px_rgba(201,255,0,0.8)]" />
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Text Content */}
                            <div>
                                {/* Spotlight effect on title */}
                                <motion.h1
                                    className="text-3xl font-black tracking-tight text-white relative group cursor-default"
                                    whileHover={{ textShadow: "0 0 30px rgba(255,255,255,0.5)" }}
                                >
                                    <span className="relative z-10">Bem-vindo de volta!</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                </motion.h1>

                                {/* Elite member text - mono spaced with neon glow */}
                                <div className="flex items-center gap-3 mt-2">
                                    <p
                                        className="font-mono text-xs font-bold tracking-[0.3em] uppercase"
                                        style={{
                                            color: "#c9ff00",
                                            textShadow: "0 0 10px rgba(201, 255, 0, 0.6), 0 0 20px rgba(201, 255, 0, 0.3)"
                                        }}
                                    >
                                        {user?.user_metadata?.company_name || user?.user_metadata?.full_name || "MEMBRO DE ELITE"}
                                    </p>

                                    {/* New Company Verified Badge */}
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#A855F7]/10 border border-[#A855F7]/30">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                                        <span className="text-[8px] font-bold tracking-wider text-[#A855F7]/80 uppercase">Verified by New</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Plan Badge */}
                            <motion.div
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E1FD3F]/10 to-[#A855F7]/10 border border-[#E1FD3F]/30 shadow-[0_0_20px_rgba(225,253,63,0.1)]"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(225, 253, 63, 0.2)" }}
                            >
                                <Crown className="w-4 h-4 text-[#E1FD3F]" />
                                <span className="text-[#E1FD3F] text-sm font-bold uppercase tracking-wider">Vitalício</span>
                            </motion.div>

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
                            <h2 className="text-2xl font-black tracking-tight">Seu Bunker</h2>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0F0F0F] border border-white/10 ml-2">
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
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                isEliteUser={user?.user_metadata?.plan === 'elite'}
                            />
                        ))}
                        {/* Ver Todos Card */}
                        <Link href="/library">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className="group relative h-full min-h-[220px] rounded-[28px] bg-gradient-to-br from-[#E1FD3F]/10 to-[#A855F7]/10 border border-white/10 hover:border-[#A855F7]/40 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#E1FD3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-12 h-12 rounded-xl bg-[#E1FD3F]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-[#E1FD3F]" />
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-lg font-black text-white mb-0.5">Ver Todos</p>
                                    <p className="text-xs text-white/40">Bunker completo</p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
