"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, ChevronDown, ChevronRight, Clock, Star, ArrowRight, Bot, Layout, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, Module, Lesson } from "@/lib/data";

interface CoursePlayerProps {
    product: Product;
}

export function CoursePlayer({ product }: CoursePlayerProps) {
    const [activeModule, setActiveModule] = useState<string>(product.modules?.[0]?.id || "");
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(product.modules?.[0]?.lessons?.[0] || null);
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
        [product.modules?.[0]?.id || ""]: true
    });

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    return (
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 mt-8">
            {/* Main Player Area */}
            <div className="space-y-8">
                {/* Video Player Placeholder */}
                <div className="aspect-video rounded-[32px] bg-[#0A0A0A] border border-white/5 overflow-hidden relative group">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#E1FD3F] flex items-center justify-center shadow-[0_0_50px_rgba(225,253,63,0.3)] group-hover:scale-110 transition-transform cursor-pointer">
                            <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                        </div>
                    </div>
                    {/* Fake progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div className="h-full w-1/3 bg-[#E1FD3F]" />
                    </div>
                </div>

                {/* Lesson Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                        <span>Início</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>{product.title}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[#E1FD3F]">{activeLesson?.title}</span>
                    </div>

                    <h1 className="text-4xl font-black tracking-tighter text-white">
                        {activeLesson?.title}
                    </h1>

                    {activeLesson?.summary && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white">Resumo da aula</h2>
                            <ul className="space-y-3">
                                {activeLesson.summary.split(';').map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#E1FD3F] mt-2 flex-shrink-0" />
                                        {point.trim()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeLesson?.objectives && (
                        <div className="space-y-4 pt-4">
                            <h2 className="text-xl font-bold text-white">Objetivos do curso</h2>
                            <div className="space-y-4">
                                {activeLesson.objectives.map((obj, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="text-[#E1FD3F] font-mono text-xs font-bold mt-0.5">
                                            (0:{i * 2}0)
                                        </div>
                                        <p className="text-sm text-white/80 leading-relaxed">{obj}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar: Modules */}
            <div className="space-y-4">
                <div className="p-6 rounded-[32px] bg-[#0A0A0A] border border-white/5 h-fit sticky top-32">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6 px-2">Conteúdo do Curso</h3>

                    <div className="space-y-2">
                        {product.modules?.map((module, mIdx) => (
                            <div key={module.id} className="space-y-1">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${expandedModules[module.id]
                                            ? 'bg-white/5 border border-white/10'
                                            : 'hover:bg-white/[0.02] border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${expandedModules[module.id] ? 'border-[#E1FD3F] text-[#E1FD3F]' : 'border-white/10 text-white/10'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${expandedModules[module.id] ? 'bg-[#E1FD3F]' : 'bg-white/10'}`} />
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${expandedModules[module.id] ? 'text-white' : 'text-white/40'}`}>
                                            {module.title}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedModules[module.id] ? 'rotate-180 text-[#E1FD3F]' : 'text-white/20'}`} />
                                </button>

                                <AnimatePresence>
                                    {expandedModules[module.id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pl-7 relative"
                                        >
                                            {/* Vertical line connecting lessons */}
                                            <div className="absolute left-3 top-0 bottom-4 w-px bg-white/5" />

                                            <div className="py-2 space-y-1">
                                                {module.lessons.map((lesson, lIdx) => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => setActiveLesson(lesson)}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group relative ${activeLesson?.id === lesson.id
                                                                ? 'bg-[#E1FD3F]/5 text-[#E1FD3F]'
                                                                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
                                                            }`}
                                                    >
                                                        {activeLesson?.id === lesson.id && (
                                                            <div className="absolute left-[-17px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E1FD3F] shadow-[0_0_10px_rgba(225,253,63,0.5)]" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                                                            {lesson.duration && (
                                                                <div className="flex items-center gap-1 mt-1 opacity-60">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span className="text-[10px] font-mono">{lesson.duration}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {activeLesson?.id === lesson.id && <PlayCircle className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
