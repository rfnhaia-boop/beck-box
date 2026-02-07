"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect, useState } from "react";

export const FuturisticBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMounted, setIsMounted] = useState(false);

    const background = useMotionTemplate`
        radial-gradient(
            800px circle at ${mouseX}px ${mouseY}px,
            rgba(225, 253, 63, 0.15),
            transparent 80%
        )
    `;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-0 overflow-hidden bg-[#0A0A0A]"
        >
            {/* GRID SUPREMO - Opacidade alta e linhas nítidas */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.3]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Apenas um leve fade nas bordas extremas, mantendo o centro visível */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, #0A0A0A 100%)',
                }}
            />

            {/* Linhas de destaque horizontais brilhantes */}
            <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E1FD3F]/40 to-transparent" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#007AFF]/40 to-transparent" />

            {/* Interactive Aura - Mouse Follow */}
            {isMounted && (
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-50 transition duration-300"
                    style={{ background }}
                />
            )}

            {/* Moving Blobs for Depth */}
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, -40, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#007AFF]/10 rounded-full blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, -40, 0],
                    y: [0, 30, 0],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E1FD3F]/5 rounded-full blur-[80px]"
            />
        </div>
    );
};
