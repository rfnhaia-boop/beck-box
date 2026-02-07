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
            rgba(225, 253, 63, 0.08),
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
                className="relative h-full flex flex-col justify-between p-6 rounded-[28px] overflow-hidden transition-all duration-500
                    bg-[#0f0f0f]/60 backdrop-blur-md 
                    border border-white/[0.04]
                    hover:border-[#E1FD3F]/20
                    hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                "
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
            >
                {/* Spotlight Effect */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition duration-500"
                    style={{ background }}
                />

                {/* Subtle White Glow on Top Border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className="mb-4 relative">
                        <motion.div
                            className="w-11 h-11 rounded-xl flex items-center justify-center 
                                       bg-[#1a1a1a] border border-white/5 
                                       group-hover:bg-[#E1FD3F] group-hover:border-[#E1FD3F]
                                       transition-all duration-300 shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 3 }}
                        >
                            <Icon
                                className="w-5 h-5 text-white/70 group-hover:text-black transition-colors duration-300"
                                strokeWidth={1.5}
                            />
                        </motion.div>
                        {/* Glow under icon on hover */}
                        <div className="absolute inset-0 bg-[#E1FD3F] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
                    </div>

                    <div className="space-y-1.5 mt-auto">
                        <h3 className={`text-lg font-bold tracking-tight ${isViewAll ? 'text-white/60' : 'text-white'} group-hover:text-[#E1FD3F] transition-colors duration-300`}>
                            {title}
                        </h3>

                        {description && (
                            <p className="text-xs text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors duration-300">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Arrow Action - Replaces simple download icon for more elegance */}
                {!isViewAll && (
                    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-[#E1FD3F] group-hover:border-[#E1FD3F]/30">
                            <Download className="w-3.5 h-3.5" />
                        </div>
                    </div>
                )}
            </motion.div>
        </Link>
    );
};
