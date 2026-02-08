"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Users, TrendingUp, DollarSign, PieChart, BarChart3,
    Calendar, Clock, CheckCircle2, FileText, AlertCircle, Filter,
    ChevronDown, Activity, Target, Award, CreditCard, Percent
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Budget {
    id: string;
    company_name: string;
    client_name: string;
    project_type: string;
    description: string;
    features: string;
    deadline: string;
    budget_value: string;
    payment_terms: string;
    status: "criado" | "enviado" | "em_andamento" | "entregue" | "cancelado";
    created_at: string;
    updated_at: string;
    delivered_at: string | null;
    accepted_at: string | null;
    accepted_notes: string | null;
    final_value: string | null;
    value_changed: boolean;
    started_at: string | null;
    completion_notes: string | null;
    execution_days: number | null;
}

type ViewTab = "overview" | "clients" | "financial" | "performance";

export default function ReportsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ViewTab>("overview");
    const [periodFilter, setPeriodFilter] = useState<"all" | "month" | "quarter" | "year">("all");

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const res = await fetch("/api/budgets");
            const data = await res.json();
            setBudgets(data.budgets || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const parseValue = (val: string) => {
        return parseFloat(val.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    };

    // Filter by period
    const filterByPeriod = (items: Budget[]) => {
        if (periodFilter === "all") return items;
        const now = new Date();
        const filterDate = new Date();
        if (periodFilter === "month") filterDate.setMonth(now.getMonth() - 1);
        if (periodFilter === "quarter") filterDate.setMonth(now.getMonth() - 3);
        if (periodFilter === "year") filterDate.setFullYear(now.getFullYear() - 1);
        return items.filter(b => new Date(b.created_at) >= filterDate);
    };

    const filteredBudgets = filterByPeriod(budgets);

    // Stats
    const totalBudgets = filteredBudgets.length;
    const totalValue = filteredBudgets.reduce((acc, b) => acc + parseValue(b.final_value || b.budget_value), 0);
    const delivered = filteredBudgets.filter(b => b.status === "entregue");
    const deliveredValue = delivered.reduce((acc, b) => acc + parseValue(b.final_value || b.budget_value), 0);
    const inProgress = filteredBudgets.filter(b => b.status === "em_andamento");
    const inProgressValue = inProgress.reduce((acc, b) => acc + parseValue(b.final_value || b.budget_value), 0);
    const pending = filteredBudgets.filter(b => b.status === "criado" || b.status === "enviado");
    const pendingValue = pending.reduce((acc, b) => acc + parseValue(b.budget_value), 0);
    const avgExecutionDays = delivered.filter(b => b.execution_days).reduce((acc, b) => acc + (b.execution_days || 0), 0) / (delivered.filter(b => b.execution_days).length || 1);
    const conversionRate = filteredBudgets.filter(b => b.status === "enviado").length > 0
        ? (filteredBudgets.filter(b => b.accepted_at).length / filteredBudgets.filter(b => b.status !== "criado").length) * 100 : 0;

    // Top clients
    const clientStats = filteredBudgets.reduce((acc, b) => {
        if (!acc[b.client_name]) {
            acc[b.client_name] = { name: b.client_name, count: 0, value: 0, delivered: 0 };
        }
        acc[b.client_name].count++;
        acc[b.client_name].value += parseValue(b.final_value || b.budget_value);
        if (b.status === "entregue") acc[b.client_name].delivered++;
        return acc;
    }, {} as Record<string, { name: string; count: number; value: number; delivered: number }>);
    const topClients = Object.values(clientStats).sort((a, b) => b.value - a.value).slice(0, 10);

    // Project types
    const projectStats = filteredBudgets.reduce((acc, b) => {
        if (!acc[b.project_type]) {
            acc[b.project_type] = { type: b.project_type, count: 0, value: 0 };
        }
        acc[b.project_type].count++;
        acc[b.project_type].value += parseValue(b.final_value || b.budget_value);
        return acc;
    }, {} as Record<string, { type: string; count: number; value: number }>);
    const topProjects = Object.values(projectStats).sort((a, b) => b.count - a.count).slice(0, 5);

    // Monthly data for chart
    const monthlyData = filteredBudgets.reduce((acc, b) => {
        const month = new Date(b.created_at).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        if (!acc[month]) acc[month] = { month, count: 0, value: 0 };
        acc[month].count++;
        acc[month].value += parseValue(b.final_value || b.budget_value);
        return acc;
    }, {} as Record<string, { month: string; count: number; value: number }>);
    const chartData = Object.values(monthlyData).slice(-6);
    const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

    const TABS = [
        { id: "overview" as ViewTab, label: "Visão Geral", icon: PieChart },
        { id: "clients" as ViewTab, label: "Clientes", icon: Users },
        { id: "financial" as ViewTab, label: "Financeiro", icon: DollarSign },
        { id: "performance" as ViewTab, label: "Desempenho", icon: Activity },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#E1FD3F] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/automations" className="p-2 hover:bg-white/10 rounded-lg transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E1FD3F] to-[#007AFF] flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-[#0a0a0a]" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">Relatórios</h1>
                                <p className="text-xs text-white/40">Analytics e métricas</p>
                            </div>
                        </div>
                    </div>

                    {/* Period filter */}
                    <div className="relative">
                        <select
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value as typeof periodFilter)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-sm cursor-pointer hover:bg-white/10"
                        >
                            <option value="all">Todo período</option>
                            <option value="month">Último mês</option>
                            <option value="quarter">Últimos 3 meses</option>
                            <option value="year">Último ano</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-white/10 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
                                        ? "border-[#E1FD3F] text-[#E1FD3F]"
                                        : "border-transparent text-white/50 hover:text-white/80"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Main stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#E1FD3F]/20 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-[#E1FD3F]" />
                                        </div>
                                        <span className="text-xs text-white/40">Orçamentos</span>
                                    </div>
                                    <p className="text-3xl font-black">{totalBudgets}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="text-xs text-white/40">Faturado</span>
                                    </div>
                                    <p className="text-2xl font-black text-green-400">R$ {deliveredValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <Activity className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <span className="text-xs text-white/40">Em Andamento</span>
                                    </div>
                                    <p className="text-2xl font-black text-purple-400">R$ {inProgressValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <span className="text-xs text-white/40">Pendente</span>
                                    </div>
                                    <p className="text-2xl font-black text-yellow-400">R$ {pendingValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                                </div>
                            </div>

                            {/* Chart and status */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Monthly chart */}
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-[#E1FD3F]" /> Faturamento Mensal
                                    </h3>
                                    {chartData.length > 0 ? (
                                        <div className="flex items-end gap-2 h-40">
                                            {chartData.map((d, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                    <div className="w-full bg-[#E1FD3F]/80 rounded-t-lg transition-all hover:bg-[#E1FD3F]"
                                                        style={{ height: `${(d.value / maxChartValue) * 100}%`, minHeight: "8px" }} />
                                                    <span className="text-[10px] text-white/40">{d.month}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-white/40 text-center py-10">Sem dados</p>
                                    )}
                                </div>

                                {/* Status distribution */}
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <PieChart className="w-5 h-5 text-[#E1FD3F]" /> Distribuição
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Entregues", count: delivered.length, color: "bg-green-500", pct: (delivered.length / totalBudgets) * 100 },
                                            { label: "Em Andamento", count: inProgress.length, color: "bg-purple-500", pct: (inProgress.length / totalBudgets) * 100 },
                                            { label: "Pendentes", count: pending.length, color: "bg-yellow-500", pct: (pending.length / totalBudgets) * 100 },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-white/60">{item.label}</span>
                                                    <span className="font-bold">{item.count} ({item.pct.toFixed(0)}%)</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct || 0}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top projects */}
                            <div className="bg-[#171717] rounded-2xl border border-white/10 p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#E1FD3F]" /> Tipos de Projeto Mais Comuns
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {topProjects.map((p, i) => (
                                        <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                                            <p className="text-2xl font-black text-[#E1FD3F]">{p.count}</p>
                                            <p className="text-xs text-white/40 truncate">{p.type}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CLIENTS TAB */}
                    {activeTab === "clients" && (
                        <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 mb-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-[#E1FD3F]" /> Top Clientes por Faturamento
                                </h3>
                                {topClients.length > 0 ? (
                                    <div className="space-y-3">
                                        {topClients.map((client, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-[#0a0a0a] rounded-xl p-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-[#E1FD3F] text-[#0a0a0a]" :
                                                        i === 1 ? "bg-white/20 text-white" :
                                                            i === 2 ? "bg-orange-500/20 text-orange-400" :
                                                                "bg-white/5 text-white/40"
                                                    }`}>
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold">{client.name}</p>
                                                    <p className="text-xs text-white/40">{client.count} orçamentos • {client.delivered} entregues</p>
                                                </div>
                                                <p className="text-lg font-black text-[#E1FD3F]">
                                                    R$ {client.value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/40 text-center py-10">Nenhum cliente encontrado</p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5 text-center">
                                    <Users className="w-8 h-8 text-[#E1FD3F] mx-auto mb-3" />
                                    <p className="text-3xl font-black">{Object.keys(clientStats).length}</p>
                                    <p className="text-xs text-white/40">Clientes Únicos</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5 text-center">
                                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                                    <p className="text-3xl font-black text-green-400">
                                        R$ {(totalValue / Object.keys(clientStats).length || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                                    </p>
                                    <p className="text-xs text-white/40">Ticket Médio por Cliente</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5 text-center">
                                    <Percent className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                                    <p className="text-3xl font-black text-purple-400">
                                        {((topClients.filter(c => c.count > 1).length / topClients.length) * 100 || 0).toFixed(0)}%
                                    </p>
                                    <p className="text-xs text-white/40">Clientes Recorrentes</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* FINANCIAL TAB */}
                    {activeTab === "financial" && (
                        <motion.div key="financial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Financial summary */}
                            <div className="grid md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-gradient-to-br from-[#E1FD3F] to-[#c5df30] rounded-2xl p-5 text-[#0a0a0a]">
                                    <DollarSign className="w-6 h-6 mb-2" />
                                    <p className="text-xs font-bold opacity-60">VALOR TOTAL</p>
                                    <p className="text-2xl font-black">R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-green-500/30 p-5">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
                                    <p className="text-xs text-white/40">RECEBIDO</p>
                                    <p className="text-2xl font-black text-green-400">R$ {deliveredValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-purple-500/30 p-5">
                                    <Activity className="w-6 h-6 text-purple-400 mb-2" />
                                    <p className="text-xs text-white/40">A RECEBER (Em Andamento)</p>
                                    <p className="text-2xl font-black text-purple-400">R$ {inProgressValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-yellow-500/30 p-5">
                                    <AlertCircle className="w-6 h-6 text-yellow-400 mb-2" />
                                    <p className="text-xs text-white/40">PENDENTE ACEITE</p>
                                    <p className="text-2xl font-black text-yellow-400">R$ {pendingValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                                </div>
                            </div>

                            {/* Recent transactions */}
                            <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 mb-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-[#E1FD3F]" /> Últimas Movimentações
                                </h3>
                                <div className="space-y-2">
                                    {filteredBudgets.slice(0, 8).map((b, i) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${b.status === "entregue" ? "bg-green-500" :
                                                        b.status === "em_andamento" ? "bg-purple-500" :
                                                            b.status === "enviado" ? "bg-yellow-500" : "bg-blue-500"
                                                    }`} />
                                                <div>
                                                    <p className="font-medium text-sm">{b.client_name}</p>
                                                    <p className="text-xs text-white/40">{b.project_type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${b.status === "entregue" ? "text-green-400" : "text-white/60"}`}>
                                                    R$ {parseValue(b.final_value || b.budget_value).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                                                </p>
                                                <p className="text-xs text-white/30">{new Date(b.created_at).toLocaleDateString("pt-BR")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Value changed budgets */}
                            {filteredBudgets.filter(b => b.value_changed).length > 0 && (
                                <div className="bg-[#171717] rounded-2xl border border-orange-500/30 p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-orange-400" /> Orçamentos com Valor Alterado
                                    </h3>
                                    <div className="space-y-2">
                                        {filteredBudgets.filter(b => b.value_changed).map((b, i) => (
                                            <div key={i} className="flex items-center justify-between py-2">
                                                <span className="text-sm">{b.client_name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-white/40 line-through">{b.budget_value}</span>
                                                    <span className="text-sm text-orange-400 font-bold">{b.final_value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* PERFORMANCE TAB */}
                    {activeTab === "performance" && (
                        <motion.div key="performance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#E1FD3F]/20 flex items-center justify-center mx-auto mb-4">
                                        <Percent className="w-8 h-8 text-[#E1FD3F]" />
                                    </div>
                                    <p className="text-4xl font-black text-[#E1FD3F]">{conversionRate.toFixed(0)}%</p>
                                    <p className="text-sm text-white/40">Taxa de Conversão</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <p className="text-4xl font-black text-blue-400">{avgExecutionDays.toFixed(0)}</p>
                                    <p className="text-sm text-white/40">Dias Médios de Execução</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                                    </div>
                                    <p className="text-4xl font-black text-green-400">{delivered.length}</p>
                                    <p className="text-sm text-white/40">Projetos Entregues</p>
                                </div>
                            </div>

                            {/* Conversion funnel */}
                            <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 mb-6">
                                <h3 className="font-bold mb-6 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#E1FD3F]" /> Funil de Conversão
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { stage: "Criados", count: filteredBudgets.length, color: "bg-blue-500" },
                                        { stage: "Enviados", count: filteredBudgets.filter(b => b.status !== "criado").length, color: "bg-yellow-500" },
                                        { stage: "Aceitos", count: filteredBudgets.filter(b => b.accepted_at).length, color: "bg-purple-500" },
                                        { stage: "Entregues", count: delivered.length, color: "bg-green-500" },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>{item.stage}</span>
                                                <span className="font-bold">{item.count}</span>
                                            </div>
                                            <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                                                <div className={`h-full ${item.color} flex items-center justify-end pr-3 text-[#0a0a0a] font-bold text-sm`}
                                                    style={{ width: `${(item.count / Math.max(filteredBudgets.length, 1)) * 100}%`, minWidth: item.count ? "40px" : "0" }}>
                                                    {item.count > 0 && `${((item.count / Math.max(filteredBudgets.length, 1)) * 100).toFixed(0)}%`}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Execution times */}
                            {delivered.filter(b => b.execution_days).length > 0 && (
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-[#E1FD3F]" /> Tempos de Execução
                                    </h3>
                                    <div className="space-y-2">
                                        {delivered.filter(b => b.execution_days).slice(0, 6).map((b, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                <span className="text-sm">{b.client_name} - {b.project_type}</span>
                                                <span className={`font-bold ${b.execution_days && b.execution_days <= 30 ? "text-green-400" : "text-yellow-400"}`}>
                                                    {b.execution_days} dias
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
