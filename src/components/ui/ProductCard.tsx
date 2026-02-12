"use client";

import { motion, useMotionTemplate, useMotionValue, Variants } from "framer-motion";
import Link from "next/link";
import { FileText, Presentation, Video, Download, LayoutGrid, Bot, Zap, Lock, Crown } from "lucide-react";
import { Product } from "@/lib/data";
import { useState } from "react";

const icons = {
    "file-text": FileText,
    presentation: Presentation,
    video: Video,
    download: Download,
    grid: LayoutGrid,
    bot: Bot,
    zap: Zap,
};

interface ProductCardProps {
    product: Product;
    index?: number;
    isEliteUser?: boolean;
    forceEliteStyle?: boolean;
}

export const ProductCard = ({ product, index = 0, isEliteUser = true, forceEliteStyle = false }: ProductCardProps) => {
    const { id, title, description, icon, link, eliteOnly: originalEliteOnly } = product;
    const eliteOnly = originalEliteOnly || forceEliteStyle;
    const Icon = icons[icon];
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    // Is this item locked for the current user?
    const isLocked = eliteOnly && !isEliteUser;

    const background = useMotionTemplate`
        radial-gradient(
            350px circle at ${mouseX}px ${mouseY}px,
            ${isLocked ? 'rgba(239, 68, 68, 0.08)' : eliteOnly ? 'rgba(168, 85, 247, 0.12)' : 'rgba(225, 253, 63, 0.08)'},
            transparent 80%
        )
    `;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const isViewAll = id === 'all';

    // Spring animation variant for staggered entry
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.08
            }
        }
    };

    const cardContent = (
        <motion.div
            className={`relative h-full flex flex-col justify-between p-6 rounded-[28px] overflow-hidden transition-all duration-500
                bg-[#0f0f0f]/60 backdrop-blur-md 
                border ${eliteOnly && !isLocked ? 'border-[#A855F7]/30' : 'border-white/[0.04]'}
                ${!isLocked && 'hover:border-[#E1FD3F]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]'}
            `}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 group-hover:opacity-100 transition duration-500"
                style={{ background }}
            />

            {/* Subtle Border Glow */}
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${eliteOnly ? 'via-[#A855F7]/30' : 'via-white/10'} to-transparent opacity-50`} />

            {/* LOCKED: Shader/Static Noise Overlay */}
            {isLocked && (
                <>
                    {/* Static noise effect */}
                    <div
                        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-20'}`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            mixBlendMode: "overlay"
                        }}
                    />

                    {/* Red scanlines */}
                    <div
                        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-15' : 'opacity-5'}`}
                        style={{
                            backgroundImage: "repeating-linear-gradient(0deg, rgba(239,68,68,0.1) 0px, rgba(239,68,68,0.1) 1px, transparent 1px, transparent 3px)",
                            animation: isHovered ? "scanline 0.1s linear infinite" : "none"
                        }}
                    />

                    {/* Upgrade text on hover */}
                    <motion.div
                        className="absolute inset-0 z-30 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 backdrop-blur-sm"
                            animate={isHovered ? {
                                x: [0, -2, 2, -1, 1, 0],
                                opacity: [1, 0.8, 1, 0.9, 1, 1]
                            } : {}}
                            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.5 }}
                        >
                            <span
                                className="text-xs font-bold tracking-wider uppercase"
                                style={{
                                    color: "#ef4444",
                                    textShadow: "0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.5)"
                                }}
                            >
                                ⚡ UPGRADE PARA ELITE
                            </span>
                        </motion.div>
                    </motion.div>
                </>
            )}

            {/* ELITE: Neon Pulsating Glow */}
            {eliteOnly && !isLocked && (
                <div
                    className="absolute -inset-1 rounded-[32px] opacity-30 blur-xl pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, #A855F7, #E1FD3F, #A855F7)",
                        backgroundSize: "200% 200%",
                        animation: "gradientShift 3s ease infinite"
                    }}
                />
            )}

            {/* Content Container */}
            <div className={`relative z-10 flex flex-col h-full ${isLocked ? 'opacity-50' : ''}`}>
                {/* Icon with Elite Glow */}
                <div className="mb-4 relative">
                    <motion.div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center 
                                   bg-[#1a1a1a] border ${eliteOnly ? 'border-[#A855F7]/30' : 'border-white/5'}
                                   ${!isLocked && 'group-hover:bg-[#E1FD3F] group-hover:border-[#E1FD3F]'}
                                   transition-all duration-300 shadow-lg`}
                        whileHover={!isLocked ? { scale: 1.1, rotate: 3 } : {}}
                        animate={eliteOnly && !isLocked ? {
                            boxShadow: [
                                "0 0 15px rgba(168, 85, 247, 0.3)",
                                "0 0 25px rgba(168, 85, 247, 0.5)",
                                "0 0 15px rgba(168, 85, 247, 0.3)"
                            ]
                        } : {}}
                        transition={eliteOnly && !isLocked ? { duration: 2, repeat: Infinity } : {}}
                    >
                        {isLocked ? (
                            <Lock className="w-5 h-5 text-red-400/70" strokeWidth={1.5} />
                        ) : (
                            <Icon
                                className={`w-5 h-5 ${eliteOnly ? 'text-[#A855F7]' : 'text-white/70'} group-hover:text-black transition-colors duration-300`}
                                strokeWidth={1.5}
                            />
                        )}
                    </motion.div>

                    {/* Neon glow under icon */}
                    {eliteOnly && !isLocked && (
                        <div
                            className="absolute inset-0 blur-xl -z-10"
                            style={{
                                background: "#A855F7",
                                opacity: isHovered ? 0.4 : 0.2,
                                transition: "opacity 0.3s"
                            }}
                        />
                    )}

                    {/* Standard glow under icon */}
                    {!eliteOnly && (
                        <div className="absolute inset-0 bg-[#E1FD3F] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
                    )}
                </div>

                {/* Elite Badge */}
                {eliteOnly && (
                    <div className="absolute top-5 right-5">
                        <motion.div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-500 ${isLocked
                                ? 'bg-white/5 border-white/10 text-white/20'
                                : 'bg-[#A855F7]/10 border-[#A855F7]/40 text-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                }`}
                            animate={!isLocked ? {
                                boxShadow: ["0 0 10px rgba(168,85,247,0.1)", "0 0 20px rgba(168,85,247,0.3)", "0 0 10px rgba(168,85,247,0.1)"]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Crown className={`w-3 h-3 ${isLocked ? 'text-white/20' : 'text-[#A855F7]'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Elite Pro</span>
                        </motion.div>
                    </div>
                )}

                <div className="space-y-1.5 mt-auto">
                    {/* Title with gradient animation for Elite */}
                    <motion.h3
                        className={`text-lg font-bold tracking-tight ${isViewAll ? 'text-white/60' : 'text-white'} ${!isLocked && 'group-hover:text-[#E1FD3F]'} transition-colors duration-300`}
                        style={eliteOnly && !isLocked && isHovered ? {
                            backgroundImage: "linear-gradient(90deg, #A855F7, #E1FD3F, #A855F7)",
                            backgroundSize: "200% 100%",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            animation: "textGradient 2s ease infinite"
                        } : {}}
                    >
                        {title}
                    </motion.h3>

                    {description && (
                        <p className={`text-xs text-white/40 leading-relaxed font-medium ${!isLocked && 'group-hover:text-white/60'} transition-colors duration-300`}>
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Arrow Action */}
            {!isViewAll && !isLocked && (
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border ${eliteOnly ? 'border-[#A855F7]/30 text-[#A855F7]/50 group-hover:text-[#A855F7] group-hover:border-[#A855F7]/50' : 'border-white/10 text-white/50 group-hover:text-[#E1FD3F] group-hover:border-[#E1FD3F]/30'}`}>
                        <Download className="w-3.5 h-3.5" />
                    </div>
                </div>
            )}
        </motion.div>
    );

    return (
        <>
            {isLocked ? (
                <div className="block h-full relative group cursor-not-allowed">
                    {cardContent}
                    <style jsx global>{`
                        @keyframes scanline {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(3px); }
                        }
                    `}</style>
                </div>
            ) : (
                <Link href={link || `/product/${id}`} className="block h-full relative group">
                    {cardContent}
                    <style jsx global>{`
                        @keyframes gradientShift {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        @keyframes textGradient {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}</style>
                </Link>
            )}
        </>
    );
};
