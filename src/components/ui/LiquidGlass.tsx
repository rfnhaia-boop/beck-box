"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";

interface LiquidGlassProps extends HTMLMotionProps<"div"> {
    intensity?: "low" | "medium" | "high";
    color?: string;
    children?: React.ReactNode;
}

export const LiquidGlass = ({
    className,
    intensity = "medium",
    color = "white",
    children,
    ...props
}: LiquidGlassProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const getIntensityStyles = () => {
        switch (intensity) {
            case "low":
                return "backdrop-blur-[10px] bg-white/[0.03] border-white/[0.08]";
            case "high":
                return "backdrop-blur-[40px] bg-white/[0.08] border-white/[0.2]";
            case "medium":
            default:
                return "backdrop-blur-[24px] bg-white/[0.05] border-white/[0.12]";
        }
    };

    return (
        <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "relative overflow-hidden rounded-[40px] border shadow-2xl transition-all duration-500",
                getIntensityStyles(),
                className
            )}
            style={{
                boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                    /* Simulated Chromatic Dispersion (Red/Blue shift) */
                    -1px -1px 2px 0 rgba(255, 0, 0, 0.1) inset,
                    1px 1px 2px 0 rgba(0, 0, 255, 0.1) inset
                `
            }}
            {...props}
        >
            {/* Fresnel Reflection (Edge Light) - Enhanced based on shader logic */}
            <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/20 pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-90" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none rounded-[40px]" />

            {/* Dynamic Glare Highlight based on mouse */}
            <div
                className="absolute w-[400px] h-[400px] bg-white rounded-full mix-blend-overlay blur-[100px] opacity-15 pointer-events-none transition-transform duration-75"
                style={{
                    transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`
                }}
            />

            {/* Refraction Noise Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};
