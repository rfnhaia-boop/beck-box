"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { FileText, Presentation, Video, Download, LayoutGrid, Bot, Zap } from "lucide-react";
import { Product } from "@/lib/data";
import { useState, useRef } from "react";

const icons = {
    "file-text": FileText,
    presentation: Presentation,
    video: Video,
    download: Download,
    grid: LayoutGrid,
    bot: Bot,
    zap: Zap,
};

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
    const { id, title, description, icon, link } = product;
    const Icon = icons[icon];
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const background = useMotionTemplate`
        radial-gradient(
            350px circle at ${mouseX}px ${mouseY}px,
            rgba(225, 253, 63, 0.1),
            transparent 80%
        )
    `;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const isViewAll = id === 'all';

    return (
        <Link href={link || `/product/${id}`} className="block h-full relative group">
            <motion.div
                className="relative h-full flex flex-col justify-between p-6 rounded-[24px] overflow-hidden transition-all duration-500
                    bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/[0.06] 
                    group-hover:border-[#E1FD3F]/30
                "
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
            >
                {/* Spotlight Effect - Radial gradient tracking mouse */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background }}
                />

                {/* Border Beam - Only on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#E1FD3F]/40 to-transparent w-[30%] h-[200%] animate-border-beam transform -skew-x-12 mix-blend-overlay" style={{ filter: 'blur(8px)' }} />
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <motion.div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 
                                   bg-[#1a1a1a] border border-white/5 
                                   group-hover:bg-[#E1FD3F]/10 group-hover:border-[#E1FD3F]/30 
                                   transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                    >
                        <Icon
                            className="w-7 h-7 text-white/70 group-hover:text-[#E1FD3F] transition-colors duration-300"
                            strokeWidth={1.5}
                        />
                    </motion.div>

                    <div className="space-y-3 mt-auto">
                        <h3 className={`text-xl font-bold tracking-tight ${isViewAll ? 'text-white/60' : 'text-white'} group-hover:text-[#E1FD3F] transition-colors duration-300`}>
                            {title}
                        </h3>

                        {description && (
                            <p className="text-sm text-white/40 leading-relaxed font-medium group-hover:text-white/70 transition-colors duration-300">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Download/Action Button - Appears on Hover */}
                {!isViewAll && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-[#E1FD3F] flex items-center justify-center shadow-[0_0_15px_rgba(225,253,63,0.4)]">
                            <Download className="w-5 h-5 text-black" />
                        </div>
                    </div>
                )}
            </motion.div>
        </Link>
    );
};
