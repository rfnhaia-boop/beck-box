"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { User as UserIcon, LogOut } from "lucide-react";

export const Header = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    const guestNavItems = [
        { label: "Home", href: "/" },
        { label: "Produtos", href: "/products", isDropdown: true },
        { label: "Blog", href: "/blog" },
    ];

    const loggedInNavItems = [
        { label: "Home", href: "/" },
        { label: "Sede", href: "/sede" },
        { label: "Produtos", href: "/products", isDropdown: true },
        { label: "Blog", href: "/blog" },
    ];

    const currentNavItems = user ? loggedInNavItems : guestNavItems;

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#101010]/80 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
            <Link
                href={user ? "/sede" : "/"}
                className="flex items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="w-8 h-8 bg-[#E1FD3F] flex items-center justify-center rounded-lg group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(225,253,63,0)] group-hover:shadow-[0_0_20px_rgba(225,253,63,0.3)]">
                    <span className="text-[#101010] font-black text-xl italic leading-none">B</span>
                </div>

                <div className="h-8 flex items-center overflow-hidden">
                    <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                            width: isHovered ? "auto" : 0,
                            opacity: isHovered ? 1 : 0
                        }}
                        className="font-black tracking-tighter text-lg whitespace-nowrap pl-2 text-white"
                    >
                        BLACKBOX
                    </motion.span>
                </div>
            </Link>

            <div className="hidden md:flex gap-1 items-center">
                {currentNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                    if (item.isDropdown) {
                        return (
                            <div
                                key={item.label}
                                className="relative px-4 py-2 group cursor-pointer"
                                onMouseEnter={() => setIsProductsOpen(true)}
                                onMouseLeave={() => setIsProductsOpen(false)}
                            >
                                <span className={`relative z-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 ${isProductsOpen ? 'text-[#E1FD3F]' : 'text-white/40 group-hover:text-white'}`}>
                                    {item.label}
                                </span>

                                <AnimatePresence>
                                    {isProductsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-2 rounded-2xl bg-[#101010] border border-white/5 shadow-2xl backdrop-blur-3xl z-50 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-b from-[#E1FD3F]/5 to-transparent pointer-events-none" />

                                            {[
                                                { label: "Adão IA", href: "/adao", desc: "Inteligência Comercial", color: "#E1FD3F" },
                                                { label: "Ação 30k", href: "/acao", desc: "Método de Escala", color: "#3B82F6" },
                                                { label: "Combo Elite", href: "/combo", desc: "O Arsenal Completo", color: "#A855F7" }
                                            ].map((prod) => (
                                                <Link
                                                    key={prod.href}
                                                    href={prod.href}
                                                    className="flex flex-col p-4 rounded-xl hover:bg-white/[0.03] transition-colors group/item"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover/item:text-[#E1FD3F] transition-colors" style={{ color: prod.color }}>
                                                        {prod.label}
                                                    </span>
                                                    <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.15em] mt-1">
                                                        {prod.desc}
                                                    </span>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E1FD3F] shadow-[0_0_10px_#E1FD3F] transition-all duration-500 ${isProductsOpen ? 'opacity-100' : 'opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-100'}`}
                                />
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative px-4 py-2 group"
                        >
                            <span className={`relative z-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 ${isActive ? 'text-[#E1FD3F]' : 'text-white/40 group-hover:text-white'}`}>
                                {item.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="navGlow"
                                    className="absolute inset-0 rounded-xl bg-[#E1FD3F]/5 border border-[#E1FD3F]/10 z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <motion.div
                                className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E1FD3F] shadow-[0_0_10px_#E1FD3F] transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 scale-0 group-hover:opacity-40 group-hover:scale-100'}`}
                            />
                        </Link>
                    );
                })}
            </div>

            {user ? (
                <div className="flex items-center gap-3">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group group/header"
                    >
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#E1FD3F] to-[#E1FD3F]/60 flex items-center justify-center text-[#050505] shadow-[0_0_15px_rgba(225,253,63,0.3)]">
                            <UserIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white/70 group-hover/header:text-[#E1FD3F] transition-colors">
                            {user.user_metadata?.company_name || user.email?.split('@')[0]}
                        </span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-white/20 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all"
                        title="Sair"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/login"
                        className="text-[10px] font-black uppercase tracking-widest bg-[#E1FD3F] text-[#050505] px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(225,253,63,0.2)] hover:scale-105 active:scale-95 transition-all"
                    >
                        Acessar Sede
                    </Link>
                </div>
            )}
        </nav>
    );
};
