"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function FloatingAdao() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Fala! Sou o Adão, seu estrategista de elite. 🚀 Em que posso blindar seu negócio hoje?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && mounted) scrollToBottom();
    }, [messages, isOpen, mounted]);

    if (!mounted) return null;

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: data.message || "Tive um pequeno lapso na Matrix. 😅 Pode repetir?"
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch {
            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "Ops! Conexão interrompida. Tenta novamente em alguns segundos! ⚡"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            {/* Floating Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative group w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl ${isOpen
                    ? 'bg-white/10 backdrop-blur-xl border border-white/20'
                    : 'bg-gradient-to-br from-[#E1FD3F] via-[#E1FD3F] to-[#80ff00] border-0'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Glow Effect when closed */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-3xl bg-[#E1FD3F] blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                )}

                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            className="relative z-10"
                        >
                            <X className="w-7 h-7 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="relative z-10"
                        >
                            <Bot className="w-8 h-8 text-black" strokeWidth={2.5} />
                            {/* Unread indicator */}
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-black/20 border-2 border-[#E1FD3F] flex items-center justify-center">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                </span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-48px)] h-[620px] max-h-[calc(100vh-140px)]"
                    >
                        <div className="w-full h-full bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
                            {/* Decorative background light */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#E1FD3F]/10 blur-[100px] pointer-events-none rounded-full" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />

                            {/* Header */}
                            <div className="p-7 relative border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E1FD3F] to-[#80ff00] flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(225,253,63,0.3)]">
                                            <Bot className="w-8 h-8 text-black" strokeWidth={2.5} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#050505] rounded-full z-20"></div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-black text-white italic tracking-tight">ADÃO</h3>
                                            <div className="px-2 py-0.5 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[9px] font-black text-[#E1FD3F] uppercase tracking-widest">Premium AI</div>
                                        </div>
                                        <p className="text-xs text-white/40 font-medium">Mentor & Estrategista BLACK BOX</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                                {messages.map((message, i) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className={`flex items-start gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity ${message.role === "user" ? "hidden" : "bg-white/5 border border-white/10"}`}>
                                            <Bot className="w-4 h-4 text-[#E1FD3F]" />
                                        </div>

                                        <div
                                            className={`relative px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${message.role === "user"
                                                ? "bg-[#E1FD3F] text-black font-semibold rounded-tr-md"
                                                : "bg-white/[0.04] text-white/90 border border-white/5 rounded-tl-md backdrop-blur-md"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                            <span className={`text-[8px] uppercase tracking-widest font-black absolute -bottom-5 ${message.role === "user" ? "right-0 text-white/20" : "left-0 text-white/20"}`}>
                                                {message.role === "user" ? "Voc\u00ea" : "Ad\u00e3o"}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}

                                {isLoading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 text-[#E1FD3F] animate-spin" />
                                        </div>
                                        <div className="px-5 py-4 rounded-[24px] rounded-tl-md bg-white/[0.02] border border-white/5">
                                            <div className="flex gap-1.5">
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-[#E1FD3F] rounded-full" />
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#E1FD3F] rounded-full" />
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#E1FD3F] rounded-full" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Footer */}
                            <div className="p-6 bg-gradient-to-t from-black to-transparent">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E1FD3F] to-blue-500 rounded-[24px] blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
                                    <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[22px] p-2 transition-all group-focus-within:border-[#E1FD3F]/30 backdrop-blur-md">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Pergunte qualquer coisa sobre neg\u00f3cios..."
                                            disabled={isLoading}
                                            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none"
                                        />
                                        <motion.button
                                            onClick={sendMessage}
                                            disabled={!input.trim() || isLoading}
                                            className="w-11 h-11 rounded-18 flex items-center justify-center bg-[#E1FD3F] text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale overflow-hidden relative"
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
                                            <Send className="w-4 h-4" strokeWidth={3} />
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <p className="text-[10px] text-white/10 uppercase font-black tracking-[0.2em]">Powered by Black Box Intelligence</p>
                                    <Sparkles className="w-3 h-3 text-white/10" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(225, 253, 63, 0.2);
                }
            `}</style>
        </div>
    );
}
