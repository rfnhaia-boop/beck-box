"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send, Bot, User, Plus, Trash2, Loader2, MessageSquare, Menu, X, Sparkles, Lock,
    Database, Archive, Phone, Cloud, RefreshCw, Layers, ArrowLeft
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
}

export default function AdaoPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem("adao-conversations");
        if (saved) {
            const parsed = JSON.parse(saved);
            setConversations(parsed.map((c: Conversation) => ({
                ...c,
                createdAt: new Date(c.createdAt),
                messages: c.messages.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }))
            })));
            if (parsed.length > 0) {
                setActiveConversationId(parsed[0].id);
            }
        }
    }, []);

    useEffect(() => {
        if (conversations.length > 0 && isMounted) {
            localStorage.setItem("adao-conversations", JSON.stringify(conversations));
        }
    }, [conversations, isMounted]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConversation?.messages]);

    const createNewConversation = () => {
        const newConv: Conversation = {
            id: Date.now().toString(),
            title: "Nova Sessão Estratégica",
            messages: [],
            createdAt: new Date()
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        let convId = activeConversationId;

        if (!convId) {
            const newConv: Conversation = {
                id: Date.now().toString(),
                title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
                messages: [],
                createdAt: new Date()
            };
            setConversations(prev => [newConv, ...prev]);
            convId = newConv.id;
            setActiveConversationId(convId);
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        };

        setInput("");
        setIsLoading(true);

        setConversations(prev => prev.map(c => {
            if (c.id === convId) {
                return { ...c, messages: [...c.messages, userMessage] };
            }
            return c;
        }));

        const currentConv = conversations.find(c => c.id === convId);
        const previousMessages = currentConv ? currentConv.messages : [];
        const allMessages = [...previousMessages, userMessage];

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: allMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message || "Sistema temporariamente fora de calibração.",
                timestamp: new Date()
            };

            setConversations(prev => prev.map(c => {
                if (c.id === convId) {
                    return { ...c, messages: [...c.messages, aiMessage] };
                }
                return c;
            }));
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [showComingSoon, setShowComingSoon] = useState(false);

    const partnerLogos = [
        { name: "OTAHSTUDIO", style: "border-[#00E5FF]/30 text-[#00E5FF]" },
        { name: "BLACK BOX", style: "border-[#E1FD3F]/30 text-[#E1FD3F]" },
        { name: "NEW COMPANY", style: "border-white/20 text-white/40" }
    ];

    return (
        <main className="h-screen w-screen relative bg-[#050505] text-[#EFEFEF] overflow-hidden flex flex-col items-center">
            <FuturisticBackground />

            {/* Massive Background Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,rgba(62,232,129,0.05)_0%,transparent_70%)] blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08)_0%,transparent_60%)] blur-[80px] translate-x-[20%]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(225,253,63,0.05)_0%,transparent_65%)] blur-[120px] -translate-x-[20%]" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-6xl h-full justify-between py-12 px-6">

                {/* Immersive Title Section */}
                <div className="text-center relative shrink-0">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 text-white"
                    >
                        Adão IA
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <p className="text-base md:text-lg font-medium tracking-[0.1em]">
                            <span className="text-[#3EE881]">Sua mente estratégica.</span>{" "}
                            <span className="text-white/40">Em</span>{" "}
                            <span className="text-[#A855F7]">alta fidelidade.</span>
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">
                            Braço direito de vendas do OTAHSTUDIO.
                        </p>
                    </motion.div>

                    {activeConversation && activeConversation.messages.length > 0 && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setActiveConversationId(null)}
                            className="mt-6 px-10 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#E1FD3F] hover:border-[#E1FD3F]/30 transition-all backdrop-blur-md"
                        >
                            + Nova Sessão
                        </motion.button>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full flex flex-col items-center justify-center overflow-hidden my-8">
                    {!activeConversation || activeConversation.messages.length === 0 ? (
                        /* Access Tiers View */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-4">
                            {/* Free Tier */}
                            <motion.a
                                href="https://gemini.google.com/gem/1P3zRUzyjAagVfQakWCydQvOxnPq9jwZx?usp=sharing"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative p-10 rounded-[48px] bg-white/[0.01] border border-white/5 hover:border-[#E1FD3F]/30 transition-all flex flex-col h-[320px] overflow-hidden backdrop-blur-3xl"
                            >
                                <div className="relative z-10 h-full flex flex-col">
                                    <span className="px-4 py-1.5 rounded-full bg-white/5 text-[9px] font-black tracking-[0.3em] text-white/30 uppercase mb-8 self-start">ACESSO IMEDIATO</span>
                                    <h3 className="text-3xl font-black mb-4 tracking-tight">Adão via Gemini</h3>
                                    <p className="text-white/30 text-base font-medium leading-relaxed max-w-[280px]">
                                        Workspace oficial do Adão diretamente no ecossistema Google Workspace.
                                    </p>
                                    <div className="mt-auto flex items-center gap-4 text-[#E1FD3F] text-[10px] font-black uppercase tracking-[0.5em] group-hover:gap-6 transition-all">
                                        ABRIR GEMINI <Send className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 group-hover:border-[#E1FD3F]/40 transition-colors" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10 group-hover:border-[#E1FD3F]/40 transition-colors" />
                            </motion.a>

                            {/* Pro Tier */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="group relative p-10 rounded-[48px] bg-gradient-to-br from-[#A855F7]/5 to-transparent border border-[#A855F7]/10 hover:border-[#A855F7]/40 transition-all flex flex-col h-[320px] backdrop-blur-3xl cursor-default overflow-hidden"
                            >
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-8">
                                        <span className="px-4 py-1.5 rounded-full bg-[#A855F7]/10 text-[9px] font-black tracking-[0.3em] text-[#A855F7] uppercase">ECOSSISTEMA PRO</span>
                                        <Sparkles className="w-5 h-5 text-[#A855F7] animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 tracking-tight text-white">Adão Integrado</h3>
                                    <p className="text-white/30 text-base font-medium leading-relaxed max-w-[280px]">
                                        IA conectada ao ecossistema com memória de contexto e sparrings de elite.
                                    </p>

                                    <div className="mt-auto relative">
                                        <AnimatePresence mode="wait">
                                            {showComingSoon ? (
                                                <motion.div
                                                    key="coming-soon"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="w-full py-5 rounded-[24px] bg-[#E1FD3F] text-black text-[11px] font-black uppercase tracking-[0.5em] text-center"
                                                >
                                                    Em breve
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    key="upgrade-btn"
                                                    onClick={() => {
                                                        setShowComingSoon(true);
                                                        setTimeout(() => setShowComingSoon(false), 2500);
                                                    }}
                                                    className="w-full py-5 rounded-[24px] bg-white text-black text-[11px] font-black uppercase tracking-[0.5em] hover:bg-[#E1FD3F] transition-all hover:shadow-[0_0_30px_rgba(225,253,63,0.3)]"
                                                >
                                                    Fazer Upgrade
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="absolute inset-[2px] rounded-[46px] border border-white/5 pointer-events-none" />
                            </motion.div>
                        </div>
                    ) : (
                        /* Chat Workspace View */
                        <div className="w-full h-full flex flex-col items-center">
                            <div className="flex-1 overflow-y-auto w-full max-w-4xl px-4 space-y-8 scrollbar-hide pb-10">
                                {activeConversation.messages.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[85%] px-8 py-6 rounded-[32px] text-lg font-medium leading-relaxed shadow-xl backdrop-blur-3xl ${m.role === 'assistant'
                                            ? 'bg-[#121212]/40 border border-white/5 text-white/80'
                                            : 'bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[#E1FD3F]'
                                            }`}>
                                            <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 opacity-20 italic">
                                                {m.role === 'assistant' ? 'ADÃO IA' : 'ESTRATEGISTA'}
                                            </div>
                                            <div className="whitespace-pre-wrap">{m.content}</div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="px-8 py-6 rounded-[32px] bg-[#121212]/40 backdrop-blur-3xl border border-white/5 space-x-2 flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-[#E1FD3F] animate-bounce" />
                                            <div className="w-2 h-2 rounded-full bg-[#E1FD3F] animate-bounce delay-75" />
                                            <div className="w-2 h-2 rounded-full bg-[#E1FD3F] animate-bounce delay-150" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="w-full max-w-4xl relative px-4 shrink-0">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/10 via-white/5 to-purple-600/10 rounded-[36px] blur-xl opacity-30 pointer-events-none" />
                                <form
                                    onSubmit={handleSubmit}
                                    className="relative bg-[#0A0A0A]/60 backdrop-blur-3xl rounded-[32px] border border-white/10 p-4"
                                >
                                    <div className="flex flex-col">
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmit(e);
                                                }
                                            }}
                                            placeholder="Descreva seu desafio..."
                                            className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 text-white placeholder:text-white/10 px-6 py-4 min-h-[100px] max-h-[180px] resize-none text-lg font-medium scrollbar-hide"
                                            disabled={isLoading}
                                        />
                                        <div className="flex items-center justify-between px-6 pb-2 pt-2 border-t border-white/5">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.1em] hover:text-[#E1FD3F] cursor-pointer transition-all">
                                                    <span>Tools</span>
                                                    <Layers className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.1em] hover:text-[#E1FD3F] cursor-pointer transition-all">
                                                    <span>Protocols</span>
                                                    <Layers className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!input.trim() || isLoading}
                                                className="p-4 rounded-[18px] bg-[#E1FD3F]/10 border border-[#E1FD3F]/10 text-[#E1FD3F] hover:bg-[#E1FD3F] hover:text-black transition-all active:scale-95 disabled:opacity-5"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ecosystem Logos Row */}
                <div className="w-full flex flex-col items-center gap-10 shrink-0">
                    <div className="flex items-center justify-center gap-10">
                        {partnerLogos.map((logo, idx) => (
                            <div
                                key={idx}
                                className={`px-6 py-2.5 bg-white/[0.02] border backdrop-blur-md relative transform transition-all hover:scale-105 hover:bg-white/[0.05] ${logo.style}`}
                                style={{
                                    clipPath: 'polygon(10% 0, 90% 0, 100% 30%, 100% 70%, 90% 100%, 10% 100%, 0 70%, 0 30%)'
                                }}
                            >
                                <span className="text-[10px] md:text-xs font-black italic tracking-widest leading-none">
                                    {logo.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Link href="/sede" className="text-[9px] font-black uppercase tracking-[0.6em] text-white/10 hover:text-[#3EE881] transition-all">
                            &lt; Voltar para a Sede
                        </Link>
                        <div className="w-px h-6 bg-gradient-to-b from-white/10 to-transparent" />
                    </div>
                </div>
            </div>
        </main>
    );
}
