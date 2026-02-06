"use client";

import { motion } from "framer-motion";

interface LogoBannerProps {
    className?: string;
}

export const LogoBanner = ({ className = "" }: LogoBannerProps) => {
    // Array of logos to display - repeated for seamless loop
    const logos = [
        { src: "/logos/new-logo.png", alt: "New Logo", width: 120 },
        { src: "/logos/partner-logo.png", alt: "Partner Logo", width: 140 },
    ];

    // Duplicate logos multiple times for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

    return (
        <div className={`w-full overflow-hidden bg-black/40 backdrop-blur-xl border-y border-white/10 py-6 ${className}`}>
            <motion.div
                className="flex items-center gap-16 whitespace-nowrap"
                animate={{
                    x: ["0%", "-50%"],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                    },
                }}
            >
                {duplicatedLogos.map((logo, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-16 flex-shrink-0"
                    >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                            style={{ filter: "brightness(1.1)" }}
                        />

                        {/* Black Box Logo between partner logos */}
                        <div className="flex items-center gap-3 opacity-50">
                            <div className="w-8 h-8 bg-[#E1FD3F] flex items-center justify-center rounded-lg">
                                <span className="text-[#050505] font-black text-lg italic">B</span>
                            </div>
                            <span className="text-white/40 font-bold tracking-tight text-sm">BLACK BOX</span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
