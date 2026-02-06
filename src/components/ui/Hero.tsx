"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles } from "lucide-react";

export const Hero = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [text, setText] = useState("BLACK BOX");
    const [isVisible, setIsVisible] = useState(false);
    const mounted = useRef(false);

    useEffect(() => {
        // Mark as mounted to prevent hydration issues
        setIsMounted(true);
        setIsVisible(true);
        mounted.current = true;

        const words = ["BLACK BOX", "CAIXA PRETA"];
        let wordIndex = 0;
        let charIndex = words[0].length;
        let isDeleting = false;

        const tick = () => {
            if (!mounted.current) return;

            const currentWord = words[wordIndex];

            if (isDeleting) {
                charIndex--;
                setText(currentWord.substring(0, charIndex));

                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            } else {
                charIndex++;
                setText(words[wordIndex].substring(0, charIndex));

                if (charIndex === words[wordIndex].length) {
                    setTimeout(() => {
                        if (mounted.current) {
                            isDeleting = true;
                            tick();
                        }
                    }, 2000);
                    return;
                }
            }

            setTimeout(tick, isDeleting ? 50 : 150);
        };

        const startTimer = setTimeout(() => {
            tick();
        }, 3000);

        return () => {
            clearTimeout(startTimer);
            mounted.current = false;
        };
    }, []);

    // Render static content initially for SSR, then hydrate with animation
    if (!isMounted) {
        return (
            <div className="relative h-[25vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden mb-6 opacity-0">
                <div className="z-10 mt-8">
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[#E1FD3F] text-[10px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Acesso Liberado
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-[#EFEFEF] min-h-[80px] flex items-center justify-center">
                        BLACK BOX
                        <span className="text-[#E1FD3F]">_</span>
                    </h1>
                    <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-medium">
                        Sua Biblioteca Premium
                    </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#E1FD3F]/5 blur-[120px] rounded-full pointer-events-none" />
            </div>
        );
    }

    return (
        <div className={`relative h-[25vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden mb-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

            <div className={`z-10 mt-8 transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[#E1FD3F] text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Acesso Liberado
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 text-[#EFEFEF] min-h-[80px] flex items-center justify-center">
                    {text}
                    <span className="animate-pulse text-[#E1FD3F]">_</span>
                </h1>

                <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-medium">
                    Sua Biblioteca Premium
                </p>
            </div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#E1FD3F]/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
    );
};
