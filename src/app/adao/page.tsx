"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Plus, Trash2, Loader2, MessageSquare, Menu, X, Sparkles } from "lucide-react";
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
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
            title: "Nova conversa",
            messages: [],
            createdAt: new Date()
        };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
    };

    const deleteConversation = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
            const remaining = conversations.filter(c => c.id !== id);
            setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        let convId = activeConversationId;

        // Create new conversation if none exists
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

        // Update conversation title if first message
        setConversations(prev => prev.map(c => {
            if (c.id === convId) {
                const isFirstMessage = c.messages.length === 0;
                return {
                    ...c,
                    title: isFirstMessage ? input.slice(0, 30) + (input.length > 30 ? "..." : "") : c.title,
                    messages: [...c.messages, userMessage]
                };
            }
            return c;
        }));

        setInput("");
        setIsLoading(true);

        const currentConv = conversations.find(c => c.id === convId);
        const allMessages = [...(currentConv?.messages || []), userMessage];

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
                content: data.message || "Desculpa, tive um problema ao processar sua mensagem. Pode tentar novamente?",
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
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Ops! Tive um problema técnico. Pode tentar novamente em alguns segundos? 😅",
                timestamp: new Date()
            };
            setConversations(prev => prev.map(c => {
                if (c.id === convId) {
                    return { ...c, messages: [...c.messages, errorMessage] };
                }
                return c;
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden relative">
            {/* Background Aura */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-mesh opacity-[0.2]" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-gradient from-[#E1FD3F]/10 to-transparent rounded-full blur-[100px]"
                />
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-72 bg-[#171717]/80 backdrop-blur-xl flex flex-col border-r border-white/10 z-20 relative"
                    >
                        {/* Sidebar Header */}
                        <div className="p-4 border-b border-white/10">
                            <button
                                onClick={createNewConversation}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            >
                                <Plus className="w-4 h-4" />
                                Novo chat
                            </button>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            <p className="px-3 py-2 text-xs text-white/40 font-medium uppercase tracking-wider">Seus chats</p>
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${activeConversationId === conv.id
                                        ? "bg-white/10 border border-white/5"
                                        : "hover:bg-white/5 border border-transparent"
                                        }`}
                                    onClick={() => setActiveConversationId(conv.id)}
                                >
                                    <MessageSquare className="w-4 h-4 text-white/40 flex-shrink-0" />
                                    <span className="flex-1 truncate text-sm text-white/80">{conv.title}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar Footer */}
                        <div className="p-4 border-t border-white/10">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-sm text-white/60"
                            >
                                <div className="w-6 h-6 bg-[#E1FD3F] rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(225,253,63,0.2)]">
                                    <span className="text-[#0a0a0a] font-black text-xs italic">B</span>
                                </div>
                                <span>Voltar ao Dashboard</span>
                            </Link>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col z-10 relative">

                {/* Top Bar */}
                <header className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="font-bold tracking-tight">Adão</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#E1FD3F]/10 border border-[#E1FD3F]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E1FD3F] animate-pulse"></span>
                                <span className="text-[10px] text-[#E1FD3F] font-bold tracking-wider">AI AGENT</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    {!activeConversation || activeConversation.messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center px-4">
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 20px rgba(225, 253, 63, 0.2)",
                                        "0 0 60px rgba(225, 253, 63, 0.4)",
                                        "0 0 20px rgba(225, 253, 63, 0.2)"
                                    ],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-20 rounded-3xl bg-[#0a0a0a] border border-[#E1FD3F]/30 flex items-center justify-center mb-6 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E1FD3F]/20 to-transparent" />
                                <Sparkles className="w-10 h-10 text-[#E1FD3F] relative z-10" />
                            </motion.div>
                            <h1 className="text-3xl font-black mb-2 tracking-tight">Adão AI</h1>
                            <p className="text-white/40 text-center max-w-md text-sm leading-relaxed">
                                Seu mentor de negócios pessoal. Pergunte sobre vendas, contratos ou estratégia.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
                            {activeConversation.messages.map((message) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={message.id}
                                    className="flex gap-6"
                                >
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${message.role === "assistant"
                                        ? "bg-[#0a0a0a] border border-[#E1FD3F]/30 text-[#E1FD3F]"
                                        : "bg-[#1a1a1a] border border-white/10 text-white/50"
                                        }`}>
                                        {message.role === "assistant" ? (
                                            <Bot className="w-4 h-4" />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <p className="font-bold text-xs text-white/30 mb-2 uppercase tracking-widest">
                                            {message.role === "assistant" ? "Adão AI" : "Você"}
                                        </p>
                                        <div className={`text-sm leading-7 whitespace-pre-wrap ${message.role === "assistant" ? "text-white/90 font-light" : "text-white/70"
                                            }`}>
                                            {message.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-6"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] border border-[#E1FD3F]/30 flex items-center justify-center relative">
                                        <div className="absolute inset-0 rounded-lg bg-[#E1FD3F]/20 animate-pulse" />
                                        <Bot className="w-4 h-4 text-[#E1FD3F] relative z-10" />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="font-bold text-xs text-white/30 mb-2 uppercase tracking-widest">Adão</p>
                                        <div className="flex items-center gap-2 text-[#E1FD3F] text-sm">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs font-mono uppercase tracking-wider">Processando...</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative group">
                        {/* Glow Effect behind input */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E1FD3F]/30 to-[#007AFF]/30 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md pointer-events-none" />

                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Pergunte ao Adão sobre seu negócio..."
                                className="w-full bg-[#1a1a1a]/80 backdrop-blur-xl rounded-2xl px-6 py-4 pr-16 
                                           outline-none text-sm text-white placeholder:text-white/20 
                                           border border-white/10 focus:border-[#E1FD3F]/50 
                                           shadow-[0_4px_24px_rgba(0,0,0,0.4)]
                                           transition-all duration-300"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-3 p-2 rounded-xl bg-[#E1FD3F] text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d0ea2e] hover:shadow-[0_0_15px_rgba(225,253,63,0.4)] transition-all duration-300 transform active:scale-95"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-[10px] text-white/20 mt-4 font-mono uppercase tracking-widest">
                        Adão AI v2.0 • Powered by Gemini
                    </p>
                </div>
            </div>
        </div>
    );
}
