"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";

export const Header = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

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
                <Link href="/sede" className="hover:text-[#E1FD3F] transition-colors">Sede</Link>
                <Link href="/sede/companies" className="hover:text-[#E1FD3F] transition-colors">Empresas</Link>
                <Link href="/library" className="hover:text-[#E1FD3F] transition-colors">Bunker</Link>
                <Link href="/ecosystem" className="hover:text-[#E1FD3F] transition-colors">Ecosistema</Link>
                <Link href="/blog" className="hover:text-[#E1FD3F] transition-colors">Blog</Link>
            </div>

            {user ? (
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                >
                    <div className="w-6 h-6 rounded-full bg-[#E1FD3F] flex items-center justify-center text-[#050505]">
                        <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                        {user.email}
                    </span>
                </Link>
            ) : (
                <Link
                    href="/login"
                    className="text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-[#E1FD3F] hover:text-[#101010] px-6 py-2 rounded-full border border-white/10 hover:border-[#E1FD3F] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    Entrar
                </Link>
            )}
        </nav>
    );
};
