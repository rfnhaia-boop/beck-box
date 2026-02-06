"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export const Header = () => {
    const [isHovered, setIsHovered] = useState(false);

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
                <Link href="#" className="hover:text-[#E1FD3F] transition-colors">Biblioteca</Link>
                <Link href="#" className="hover:text-[#E1FD3F] transition-colors">Segurança</Link>
                <Link href="#" className="hover:text-[#E1FD3F] transition-colors">Contato</Link>
            </div>

            {/* FIXED: Replaced button inside Link with a styled Link */}
            <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-[#E1FD3F] hover:text-[#101010] px-6 py-2 rounded-full border border-white/10 hover:border-[#E1FD3F] transition-all duration-300 hover:scale-105 active:scale-95"
            >
                Entrar
            </Link>
        </nav>
    );
};
