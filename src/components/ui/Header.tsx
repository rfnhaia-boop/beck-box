"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { User as UserIcon, LogOut } from "lucide-react";

export const Header = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const router = useRouter();

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

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#101010]/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
            <Link
                href="/"
                className="flex items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="w-8 h-8 bg-[#E1FD3F] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#101010] font-black text-xl italic">B</span>
                </div>

                <div className="h-8 flex items-center overflow-hidden">
                    <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                            width: isHovered ? "auto" : 0,
                            opacity: isHovered ? 1 : 0
                        }}
                        className="font-bold tracking-tighter text-lg whitespace-nowrap pl-2 text-[#EFEFEF]"
                    >
                        BLACKBOX
                    </motion.span>
                </div>
            </Link>

            <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-white/50">
                {user?.user_metadata?.role !== 'CLIENT_ADMIN' && (
                    <>
                        <Link href="/sede" className="hover:text-[#E1FD3F] transition-colors font-mono">/sede</Link>
                        <Link href="/sede/companies" className="hover:text-[#E1FD3F] transition-colors font-mono">/empresas</Link>
                        <Link href="/library" className="hover:text-[#E1FD3F] transition-colors font-mono">/bunker</Link>
                        <Link href="/ecosystem" className="hover:text-[#E1FD3F] transition-colors font-mono">/ecosistema</Link>
                        <Link href="/blog" className="hover:text-[#E1FD3F] transition-colors font-mono">/blog</Link>
                    </>
                )}
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
                <Link
                    href="/login"
                    className="text-[10px] font-black uppercase tracking-widest bg-[#E1FD3F] text-[#050505] px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(225,253,63,0.2)] hover:scale-105 active:scale-95 transition-all"
                >
                    Acessar Bunker
                </Link>
            )}
        </nav>
    );
};
