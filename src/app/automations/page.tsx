"use client";

import { motion } from "framer-motion";
import {
    Play, Pause, RefreshCw, CheckCircle, XCircle, Clock,
    Zap, Settings, ArrowLeft, Loader2, Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Workflow {
    id: string;
    name: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Execution {
    id: string;
    finished: boolean;
    mode: string;
    startedAt: string;
    stoppedAt: string;
    status: string;
}

export default function AutomationsPage() {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [executions, setExecutions] = useState<Record<string, Execution[]>>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkflows = async () => {
        try {
            const response = await fetch("/api/n8n");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setWorkflows(data.data || []);
            setError(null);
        } catch (err) {
            setError("Erro ao conectar com n8n");
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const toggleWorkflow = async (workflowId: string, currentActive: boolean) => {
        try {
            const response = await fetch("/api/n8n", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workflowId, active: !currentActive }),
            });
            if (response.ok) {
                setWorkflows(prev => prev.map(w =>
                    w.id === workflowId ? { ...w, active: !currentActive } : w
                ));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(dateString));
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E1FD3F] to-[#007AFF] flex items-center justify-center">
                                <Zap className="w-5 h-5 text-[#0a0a0a]" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">Automações n8n</h1>
                                <p className="text-xs text-white/40">Gerencie seus workflows</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => { setRefreshing(true); fetchWorkflows(); }}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                        Atualizar
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#171717] rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-5 h-5 text-[#E1FD3F]" />
                            <span className="text-white/60 text-sm">Total Workflows</span>
                        </div>
                        <p className="text-3xl font-black">{workflows.length}</p>
                    </div>
                    <div className="bg-[#171717] rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white/60 text-sm">Ativos</span>
                        </div>
                        <p className="text-3xl font-black text-green-400">
                            {workflows.filter(w => w.active).length}
                        </p>
                    </div>
                    <div className="bg-[#171717] rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Pause className="w-5 h-5 text-white/40" />
                            <span className="text-white/60 text-sm">Inativos</span>
                        </div>
                        <p className="text-3xl font-black text-white/40">
                            {workflows.filter(w => !w.active).length}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#E1FD3F]" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                        <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={fetchWorkflows}
                            className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* Workflows Grid */}
                {!loading && !error && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-4">Seus Workflows</h2>

                        {workflows.length === 0 ? (
                            <div className="bg-[#171717] rounded-2xl border border-white/10 p-12 text-center">
                                <Zap className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <p className="text-white/40">Nenhum workflow encontrado</p>
                                <a
                                    href="https://n8n.newflowsys.cloud"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-6 py-3 bg-[#E1FD3F] text-[#0a0a0a] font-bold rounded-xl hover:scale-105 transition-transform"
                                >
                                    Criar no n8n
                                </a>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {workflows.map((workflow, index) => (
                                    <motion.div
                                        key={workflow.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-[#171717] rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${workflow.active
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-white/5 text-white/40"
                                                    }`}>
                                                    <Zap className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{workflow.name}</h3>
                                                    <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatDate(workflow.updatedAt)}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-full ${workflow.active
                                                                ? "bg-green-500/20 text-green-400"
                                                                : "bg-white/10 text-white/40"
                                                            }`}>
                                                            {workflow.active ? "Ativo" : "Inativo"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleWorkflow(workflow.id, workflow.active)}
                                                    className={`p-3 rounded-xl transition-all ${workflow.active
                                                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                            : "bg-white/5 text-white/40 hover:bg-white/10"
                                                        }`}
                                                    title={workflow.active ? "Desativar" : "Ativar"}
                                                >
                                                    {workflow.active ? (
                                                        <Pause className="w-5 h-5" />
                                                    ) : (
                                                        <Play className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <a
                                                    href={`https://n8n.newflowsys.cloud/workflow/${workflow.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                                                    title="Editar no n8n"
                                                >
                                                    <Settings className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Link */}
                <div className="mt-12 text-center">
                    <a
                        href="https://n8n.newflowsys.cloud"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-all"
                    >
                        <Zap className="w-4 h-4" />
                        Abrir painel completo do n8n
                    </a>
                </div>
            </main>
        </div>
    );
}
