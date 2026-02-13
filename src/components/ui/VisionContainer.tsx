"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, Zap, Target, Layers } from "lucide-react";
import React, { useState } from "react";

interface VisionContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const VisionContainer = ({ children, className }: VisionContainerProps) => {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

            {/* --- FLOATING SIDEBAR (Left Pill) --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-6 p-4 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
            >
                {[
                    { id: "adao", icon: Zap, href: "/adao", label: "Adão" },
                    { id: "acao", icon: Target, href: "/acao", label: "Ação 30k" },
                    { id: "combo", icon: Layers, href: "/combo", label: "Combo" },
                    { id: "home", icon: Home, href: "/", label: "Home" },
                ].map((item) => (
                    <a
                        key={item.id}
                        href={item.href}
                        title={item.label}
                        className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                            typeof window !== 'undefined' && window.location.pathname === item.href
                                ? "bg-white/20 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]"
                                : "text-white/40 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <item.icon className="w-5 h-5" />

                        {/* Tooltip */}
                        <span className="absolute left-full ml-4 px-2 py-1 rounded-md bg-black/80 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                            {item.label}
                        </span>
                    </a>
                ))}
            </motion.div>

            {/* --- MAIN GLASS WINDOW --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, rotateX: 5 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "relative w-full max-w-[1400px] h-[90vh] rounded-[40px] overflow-hidden",
                    "bg-[#1A1A1A]/60 backdrop-blur-3xl", // Darker base for legibility, heavy blur
                    "border border-white/10", // Subtle rim
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_-10px_rgba(0,0,0,0.5)]", // Multi-layer shadow
                    className
                )}
            >
                {/* Reflection/Sheen Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

                {/* Content Area (Scrollable) */}
                <div className="h-full overflow-y-auto scrollbar-hide p-8 md:p-12 relative z-10">
                    {children}
                </div>

            </motion.div>
        </div>
    );
};
