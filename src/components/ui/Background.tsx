"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect, useState } from "react";

export const FuturisticBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMounted, setIsMounted] = useState(false);

    // Fix: Hook called at top level
    const background = useMotionTemplate`
        radial-gradient(
            800px circle at ${mouseX}px ${mouseY}px,
            rgba(225, 253, 63, 0.06),
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
            className="fixed inset-0 -z-10 overflow-hidden bg-black"
        >
            {/* Grid Pattern Mesh */}
            <div className="absolute inset-0 bg-grid-mesh opacity-[0.4] pointer-events-none" />

            {/* Top Radial Fade */}
            <div className="absolute inset-0 bg-radial-fade pointer-events-none" />

            {/* Interactive Aura - Mouse Follow */}
            {isMounted && (
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-40 transition duration-300"
                    style={{ background }}
                />
            )}

            {/* Deep Ambient Moving Blobs (Subtler) */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#007AFF]/20 to-transparent rounded-full blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    x: [0, -50, 0],
                    y: [0, 30, 0],
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-[#E1FD3F]/10 to-transparent rounded-full blur-[100px] mix-blend-screen"
            />
        </div>
    );
};
