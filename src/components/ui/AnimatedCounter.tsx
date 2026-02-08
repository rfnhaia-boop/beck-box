"use client";

import { motion, useSpring, useTransform, useMotionValue, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    delay?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export const AnimatedCounter = ({
    value,
    duration = 2,
    delay = 0,
    className = "",
    prefix = "",
    suffix = ""
}: AnimatedCounterProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);

    const springValue = useSpring(motionValue, {
        stiffness: 100,
        damping: 30,
        duration: duration * 1000
    });

    const displayValue = useTransform(springValue, (latest) => Math.round(latest));

    useEffect(() => {
        if (isInView) {
            const timeout = setTimeout(() => {
                motionValue.set(value);
            }, delay * 1000);
            return () => clearTimeout(timeout);
        }
    }, [isInView, value, motionValue, delay]);

    return (
        <span ref={ref} className={`font-mono ${className}`}>
            {prefix}
            <motion.span>
                {displayValue}
            </motion.span>
            {suffix}
        </span>
    );
};

// Terminal-style counter with typing effect
export const TerminalCounter = ({
    value,
    label,
    delay = 0,
}: {
    value: number;
    label: string;
    delay?: number;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);

    const springValue = useSpring(motionValue, {
        stiffness: 50,
        damping: 20
    });

    useEffect(() => {
        if (isInView) {
            const timeout = setTimeout(() => {
                motionValue.set(value);
            }, delay * 1000);
            return () => clearTimeout(timeout);
        }
    }, [isInView, value, motionValue, delay]);

    return (
        <motion.div
            ref={ref}
            className="inline-flex items-center gap-2 font-mono"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay }}
        >
            <span className="text-[#E1FD3F]/50">&gt;</span>
            <span className="text-white/30">loading</span>
            <motion.span
                className="text-[#E1FD3F] font-bold"
                style={{
                    textShadow: "0 0 10px rgba(225, 253, 63, 0.5)"
                }}
            >
                {springValue}
            </motion.span>
            <span className="text-white/50">{label}</span>
            <motion.span
                className="inline-block w-2 h-4 bg-[#E1FD3F]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            />
        </motion.div>
    );
};
