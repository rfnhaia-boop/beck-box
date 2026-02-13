"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
    children?: React.ReactNode;
    active?: boolean;
    variant?: "glass" | "soft";
}

export const GlassButton = ({ className, children, active, variant = "glass", ...props }: GlassButtonProps) => {
    return (
        <motion.button
            className={cn(
                "relative px-8 py-4 rounded-full group overflow-hidden transition-all duration-300",
                // VARIANT: GLASS (Default)
                variant === "glass" && [
                    "bg-white/5 backdrop-blur-md",
                    "border border-white/10",
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_10px_20px_-10px_rgba(0,0,0,0.5)]",
                    "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_15px_30px_-10px_rgba(225,253,63,0.1)]",
                    "hover:bg-white/10 hover:border-white/20",
                    "active:scale-95 active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)]"
                ],
                // VARIANT: SOFT (Neumorphic/Clay)
                variant === "soft" && [
                    "bg-[#E0E0E0] text-black", // Light base
                    "border border-white/40", // Subtle highlight rim
                    "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]", // Soft outer shadow
                    "hover:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff]", // Pressed look on hover? Or just deeper shadow? 
                    // Let's do a "lifted" hover and "pressed" active
                    "hover:-translate-y-1 hover:shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff]",
                    "active:translate-y-0 active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]",
                ],
                className
            )}
            whileHover={variant === "glass" ? { y: -2 } : {}}
            whileTap={{ y: 0 }}
            {...props}
        >
            {/* GLASS EFFECTS ONLY */}
            {variant === "glass" && (
                <>
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/10 pointer-events-none" />
                    <div className="absolute inset-[1px] rounded-full ring-1 ring-black/20 pointer-events-none" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E1FD3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
            )}

            {/* SOFT EFFECTS ONLY */}
            {variant === "soft" && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/80 to-transparent opacity-50 pointer-events-none" />
            )}

            {/* Content */}
            <div className={cn(
                "relative z-10 flex items-center justify-center gap-3 font-bold tracking-wide transition-colors text-lg",
                variant === "glass" ? "text-white/90 group-hover:text-white" : "text-black/80 group-hover:text-black"
            )}>
                {children}
            </div>
        </motion.button>
    );
};
