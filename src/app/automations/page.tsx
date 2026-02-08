"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ArrowRight, User, Briefcase, FileText, DollarSign,
    Calendar, Sparkles, Download, CheckCircle2, Building2, Loader2,
    Plus, Eye, Send, Truck, X, CreditCard, BarChart3, TrendingUp, Edit3,
    Clock, ThumbsUp, Flag, PieChart
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

interface BudgetData {
    companyName: string;
    clientName: string;
    projectType: string;
    description: string;
    features: string;
    deadline: string;
    budget: string;
    paymentTerms: string;
}

const STEPS = [
    { key: "companyName", label: "Qual o nome da sua empresa?", placeholder: "Digite o nome da sua empresa", icon: Building2, hint: "Aparecerá no cabeçalho do PDF" },
    { key: "clientName", label: "Para quem é este orçamento?", placeholder: "Nome do cliente ou empresa", icon: User, hint: "Destinatário da proposta" },
    { key: "projectType", label: "Que tipo de projeto?", placeholder: "Ex: Site, App, Automação...", icon: Briefcase, hint: "Tipo de serviço oferecido" },
    { key: "description", label: "Descreva o projeto", placeholder: "O que será desenvolvido?", icon: FileText, multiline: true, hint: "A IA vai aprimorar isso" },
    { key: "features", label: "Quais as entregas?", placeholder: "Liste as funcionalidades...", icon: Sparkles, multiline: true, hint: "Principais entregáveis" },
    { key: "deadline", label: "Qual o prazo?", placeholder: "Ex: 30 dias", icon: Calendar, hint: "Tempo de entrega" },
    { key: "budget", label: "Qual o valor?", placeholder: "Ex: R$ 5.000,00", icon: DollarSign, hint: "Investimento total" },
    { key: "paymentTerms", label: "Condições de pagamento?", placeholder: "Ex: 50% entrada, 50% entrega", icon: CreditCard, hint: "Como será pago" },
];

const STATUS_CONFIG = {
    criado: { label: "Criado", color: "bg-blue-500/20 text-blue-400", icon: FileText },
    enviado: { label: "Enviado", color: "bg-yellow-500/20 text-yellow-400", icon: Send },
    em_andamento: { label: "Em Andamento", color: "bg-purple-500/20 text-purple-400", icon: Truck },
    entregue: { label: "Entregue", color: "bg-green-500/20 text-green-400", icon: CheckCircle2 },
    cancelado: { label: "Cancelado", color: "bg-red-500/20 text-red-400", icon: X },
};

type ViewType = "dashboard" | "form" | "review" | "complete";
type ModalType = "actions" | "accept" | "complete" | "analytics" | null;

export default function BudgetManagementPage() {
    const [view, setView] = useState<ViewType>("dashboard");
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [budgetData, setBudgetData] = useState<BudgetData>({
        companyName: "", clientName: "", projectType: "", description: "",
        features: "", deadline: "", budget: "", paymentTerms: "50% na aprovação, 50% na entrega"
    });
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancedData, setEnhancedData] = useState<BudgetData | null>(null);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);

    // Accept form state
    const [acceptNotes, setAcceptNotes] = useState("");
    const [valueChanged, setValueChanged] = useState(false);
    const [finalValue, setFinalValue] = useState("");

    // Complete form state
    const [completionNotes, setCompletionNotes] = useState("");
    const [completionDate, setCompletionDate] = useState("");

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

    const saveBudget = async (data: BudgetData) => {
        try {
            await fetch("/api/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: data.companyName,
                    clientName: data.clientName,
                    projectType: data.projectType,
                    description: data.description,
                    features: data.features,
                    deadline: data.deadline,
                    budgetValue: data.budget,
                    paymentTerms: data.paymentTerms
                })
            });
            await fetchBudgets();
        } catch (e) {
            console.error(e);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch("/api/budgets", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            });
            await fetchBudgets();
        } catch (e) {
            console.error(e);
        }
    };

    const handleAccept = async () => {
        if (!selectedBudget) return;
        try {
            await fetch("/api/budgets", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedBudget.id,
                    action: "accept",
                    acceptedNotes: acceptNotes,
                    valueChanged: valueChanged,
                    finalValue: valueChanged ? finalValue : selectedBudget.budget_value
                })
            });
            await fetchBudgets();
            setModalType(null);
            setSelectedBudget(null);
            setAcceptNotes("");
            setValueChanged(false);
            setFinalValue("");
        } catch (e) {
            console.error(e);
        }
    };

    const handleComplete = async () => {
        if (!selectedBudget) return;
        try {
            await fetch("/api/budgets", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedBudget.id,
                    action: "complete",
                    completionNotes: completionNotes,
                    completionDate: completionDate || new Date().toISOString()
                })
            });
            await fetchBudgets();
            setModalType(null);
            setSelectedBudget(null);
            setCompletionNotes("");
            setCompletionDate("");
        } catch (e) {
            console.error(e);
        }
    };

    const openActionsModal = (budget: Budget) => {
        setSelectedBudget(budget);
        setModalType("actions");
    };

    const currentField = STEPS[currentStep];
    const CurrentIcon = currentField?.icon || FileText;
    const currentValue = budgetData[currentField?.key as keyof BudgetData] || "";
    const finalData = enhancedData || budgetData;

    const handleInputChange = (value: string) => {
        setBudgetData(prev => ({ ...prev, [currentField.key]: value }));
    };

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsEnhancing(true);
            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "enhance_budget", data: budgetData })
                });
                const result = await response.json();
                const enhanced = result.enhanced || budgetData;
                setEnhancedData(enhanced);
            } catch {
                setEnhancedData(budgetData);
            }
            setIsEnhancing(false);
            setView("review");
        }
    };

    const handleApprove = async () => {
        await saveBudget(finalData);
        setView("complete");
    };

    const handleReject = () => {
        setEnhancedData(null);
        setView("form");
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !currentField?.multiline) handleNext();
    };

    const resetForm = () => {
        setCurrentStep(0);
        setBudgetData({
            companyName: "", clientName: "", projectType: "", description: "",
            features: "", deadline: "", budget: "", paymentTerms: "50% na aprovação, 50% na entrega"
        });
        setEnhancedData(null);
        setView("dashboard");
    };

    const generatePDF = async (data: BudgetData | Budget) => {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

        const accent = [225, 253, 63] as [number, number, number];
        const dark = [15, 15, 15] as [number, number, number];
        const card = [30, 30, 30] as [number, number, number];
        const white = [255, 255, 255] as [number, number, number];
        const light = [220, 220, 220] as [number, number, number];
        const muted = [120, 120, 120] as [number, number, number];

        const company = "companyName" in data ? data.companyName : data.company_name;
        const client = "clientName" in data ? data.clientName : data.client_name;
        const project = "projectType" in data ? data.projectType : data.project_type;
        const desc = data.description || "";
        const feat = data.features || "";
        const dead = data.deadline || "";
        const budg = "budget" in data ? data.budget : data.budget_value;
        const terms = "paymentTerms" in data ? data.paymentTerms : data.payment_terms;

        const pageWidth = 210;
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;

        // Background
        doc.setFillColor(...dark);
        doc.rect(0, 0, 210, 297, "F");

        // Header bar
        doc.setFillColor(25, 25, 25);
        doc.rect(0, 0, 210, 50, "F");

        // Accent line
        doc.setFillColor(...accent);
        doc.rect(0, 50, 210, 3, "F");

        // Company name
        doc.setTextColor(...accent);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(company.toUpperCase(), margin, 30);

        // Subtitle and date
        doc.setTextColor(...muted);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("PROPOSTA COMERCIAL", margin, 42);
        doc.text(today, pageWidth - margin, 42, { align: "right" });

        // CLIENT card
        let y = 65;
        doc.setFillColor(...card);
        doc.roundedRect(margin, y, contentWidth, 32, 4, 4, "F");
        doc.setTextColor(...muted);
        doc.setFontSize(10);
        doc.text("CLIENTE", margin + 12, y + 14);
        doc.setTextColor(...white);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(client, margin + 12, y + 26);

        // PROJECT card
        y = 105;
        doc.setFillColor(...card);
        doc.roundedRect(margin, y, contentWidth, 32, 4, 4, "F");
        doc.setTextColor(...muted);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("PROJETO", margin + 12, y + 14);
        doc.setTextColor(...accent);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(project, margin + 12, y + 26);

        // DESCRIPTION section
        y = 150;
        doc.setTextColor(...accent);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("SOBRE O PROJETO", margin, y);
        doc.setDrawColor(...accent);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 4, margin + 45, y + 4);

        doc.setTextColor(...light);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(desc, contentWidth);
        doc.text(descLines, margin, y + 16);
        y = y + 16 + descLines.length * 6 + 10;

        // DELIVERABLES section
        doc.setTextColor(...accent);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("ENTREGAS", margin, y);
        doc.line(margin, y + 4, margin + 30, y + 4);

        doc.setTextColor(...light);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const featLines = doc.splitTextToSize(feat, contentWidth);
        doc.text(featLines, margin, y + 16);
        y = y + 16 + featLines.length * 6 + 15;

        // Ensure minimum position for value box
        y = Math.max(y, 205);

        // VALUE AND DEADLINE box - full width with accent background
        doc.setFillColor(...accent);
        doc.roundedRect(margin, y, contentWidth, 42, 4, 4, "F");

        // Left side - Investment
        doc.setTextColor(...dark);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("INVESTIMENTO", margin + 15, y + 14);
        doc.setFontSize(28);
        doc.text(budg, margin + 15, y + 35);

        // Vertical divider
        doc.setDrawColor(...dark);
        doc.setLineWidth(0.3);
        doc.line(margin + contentWidth / 2, y + 8, margin + contentWidth / 2, y + 34);

        // Right side - Deadline
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("PRAZO DE ENTREGA", margin + contentWidth / 2 + 15, y + 14);
        doc.setFontSize(22);
        doc.text(dead, margin + contentWidth / 2 + 15, y + 33);

        // PAYMENT CONDITIONS section
        y = y + 55;
        doc.setTextColor(...accent);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("CONDIÇÕES DE PAGAMENTO", margin, y);

        doc.setTextColor(...light);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const termLines = terms.split(",").map(t => "•  " + t.trim());
        termLines.forEach((line, i) => {
            doc.text(line, margin, y + 14 + i * 8);
        });
        doc.text("•  Proposta válida por 15 dias", margin, y + 14 + termLines.length * 8);

        // Footer
        doc.setFillColor(20, 20, 20);
        doc.rect(0, 280, 210, 17, "F");
        doc.setFillColor(...accent);
        doc.rect(0, 280, 210, 1, "F");
        doc.setTextColor(...accent);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(company.toUpperCase(), 105, 291, { align: "center" });

        doc.save(`Orcamento_${client.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
    };

    // Stats
    const totalValue = budgets.reduce((acc, b) => {
        const val = parseFloat(b.budget_value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
        return acc + val;
    }, 0);
    const delivered = budgets.filter(b => b.status === "entregue").length;
    const inProgress = budgets.filter(b => b.status === "em_andamento").length;
    const sent = budgets.filter(b => b.status === "enviado").length;
    const accepted = budgets.filter(b => b.accepted_at).length;
    const avgExecutionDays = budgets.filter(b => b.execution_days).reduce((acc, b) => acc + (b.execution_days || 0), 0) / (budgets.filter(b => b.execution_days).length || 1);

    if (isEnhancing) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <Loader2 className="w-12 h-12 text-[#E1FD3F] animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Adão está analisando...</h2>
                    <p className="text-white/40 text-sm">Aprimorando sua proposta com IA</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E1FD3F] to-[#007AFF] flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[#0a0a0a]" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">Orçamentos</h1>
                                <p className="text-xs text-white/40">Gerencie suas propostas</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {view === "dashboard" && (
                            <>
                                <Link href="/reports" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm">
                                    <PieChart className="w-4 h-4 text-[#E1FD3F]" /> Relatórios
                                </Link>
                                <button onClick={() => setView("form")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E1FD3F] text-[#0a0a0a] font-bold hover:scale-105 transition-all text-sm">
                                    <Plus className="w-4 h-4" /> Novo
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {view === "dashboard" && (
                        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-[#E1FD3F]" />
                                        <span className="text-xs text-white/40">Total</span>
                                    </div>
                                    <p className="text-2xl font-black">{budgets.length}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Truck className="w-4 h-4 text-purple-400" />
                                        <span className="text-xs text-white/40">Em Andamento</span>
                                    </div>
                                    <p className="text-2xl font-black text-purple-400">{inProgress}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-white/40">Entregues</span>
                                    </div>
                                    <p className="text-2xl font-black text-green-400">{delivered}</p>
                                </div>
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-[#E1FD3F]" />
                                        <span className="text-xs text-white/40">Valor Total</span>
                                    </div>
                                    <p className="text-xl font-black text-[#E1FD3F]">R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            {budgets.length > 0 && (
                                <div className="bg-[#171717] rounded-2xl border border-white/10 p-6 mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BarChart3 className="w-5 h-5 text-[#E1FD3F]" />
                                        <span className="font-bold">Resumo por Status</span>
                                    </div>
                                    <div className="flex items-end gap-3 h-24">
                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                                            const count = budgets.filter(b => b.status === key).length;
                                            const height = budgets.length > 0 ? (count / budgets.length) * 100 : 0;
                                            return (
                                                <div key={key} className="flex-1 flex flex-col items-center gap-2">
                                                    <div className={`w-full rounded-t-lg ${config.color.split(" ")[0]} transition-all`} style={{ height: `${Math.max(height, 5)}%` }} />
                                                    <span className="text-[10px] text-white/40">{config.label}</span>
                                                    <span className="text-xs font-bold">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#E1FD3F]" /></div>
                            ) : budgets.length === 0 ? (
                                <div className="text-center py-16 bg-[#171717] rounded-2xl border border-white/10">
                                    <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 mb-4">Nenhum orçamento criado</p>
                                    <button onClick={() => setView("form")} className="px-6 py-3 rounded-xl bg-[#E1FD3F] text-[#0a0a0a] font-bold hover:scale-105 transition-all">
                                        Criar Primeiro Orçamento
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <h2 className="font-bold text-lg mb-4">Seus Orçamentos</h2>
                                    {budgets.map((budget, i) => {
                                        const StatusIcon = STATUS_CONFIG[budget.status].icon;
                                        const statusIndex = ["criado", "enviado", "em_andamento", "entregue"].indexOf(budget.status);
                                        const progressPercent = budget.status === "cancelado" ? 0 : ((statusIndex + 1) / 4) * 100;

                                        return (
                                            <motion.div key={budget.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                onClick={() => openActionsModal(budget)}
                                                className={`bg-[#171717] rounded-xl border p-4 hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden ${budget.status === "em_andamento" ? "border-purple-500/50 shadow-lg shadow-purple-500/10" :
                                                    budget.status === "entregue" ? "border-green-500/50 shadow-lg shadow-green-500/10" :
                                                        budget.status === "enviado" ? "border-yellow-500/30" :
                                                            "border-white/10"
                                                    }`}>
                                                {/* Left color bar */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${budget.status === "em_andamento" ? "bg-purple-500" :
                                                    budget.status === "entregue" ? "bg-green-500" :
                                                        budget.status === "enviado" ? "bg-yellow-500" :
                                                            budget.status === "cancelado" ? "bg-red-500" :
                                                                "bg-blue-500"
                                                    }`} />

                                                <div className="flex items-start justify-between gap-4 pl-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${budget.status === "em_andamento" ? "bg-purple-500/20" :
                                                                budget.status === "entregue" ? "bg-green-500/20" :
                                                                    budget.status === "enviado" ? "bg-yellow-500/20" :
                                                                        budget.status === "cancelado" ? "bg-red-500/20" :
                                                                            "bg-blue-500/20"
                                                                }`}>
                                                                <StatusIcon className={`w-4 h-4 ${budget.status === "em_andamento" ? "text-purple-400" :
                                                                    budget.status === "entregue" ? "text-green-400" :
                                                                        budget.status === "enviado" ? "text-yellow-400" :
                                                                            budget.status === "cancelado" ? "text-red-400" :
                                                                                "text-blue-400"
                                                                    }`} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold">{budget.client_name}</h3>
                                                                <p className="text-xs text-white/40">{budget.project_type}</p>
                                                            </div>
                                                        </div>

                                                        {/* Status badge and info */}
                                                        <div className="flex items-center gap-2 flex-wrap mb-3">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[budget.status].color}`}>
                                                                {STATUS_CONFIG[budget.status].label}
                                                            </span>
                                                            {budget.execution_days && (
                                                                <span className="text-xs text-white/30 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                                                                    <Clock className="w-3 h-3" /> {budget.execution_days} dias
                                                                </span>
                                                            )}
                                                            {budget.status === "em_andamento" && budget.started_at && (
                                                                <span className="text-xs text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-full animate-pulse">
                                                                    <Truck className="w-3 h-3" /> Em execução
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Progress pipeline */}
                                                        <div className="flex items-center gap-1 mb-2">
                                                            {["Criado", "Enviado", "Andamento", "Entregue"].map((stage, idx) => (
                                                                <div key={stage} className="flex-1 flex items-center gap-1">
                                                                    <div className={`h-1.5 flex-1 rounded-full transition-all ${idx <= statusIndex ? (
                                                                        budget.status === "entregue" ? "bg-green-500" :
                                                                            budget.status === "em_andamento" ? "bg-purple-500" :
                                                                                budget.status === "enviado" ? "bg-yellow-500" :
                                                                                    "bg-blue-500"
                                                                    ) : "bg-white/10"
                                                                        }`} />
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center gap-4 text-xs text-white/30">
                                                            <span>{new Date(budget.created_at).toLocaleDateString("pt-BR")}</span>
                                                            <span className="text-[#E1FD3F] font-bold text-sm">{budget.final_value || budget.budget_value}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => generatePDF(budget)}
                                                            className="p-2 rounded-lg bg-[#E1FD3F]/20 hover:bg-[#E1FD3F]/30 text-[#E1FD3F] transition-all" title="Baixar PDF">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {view === "form" && (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                {STEPS.map((_, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${index < currentStep ? "bg-[#E1FD3F] text-[#0a0a0a]" : index === currentStep ? "bg-[#E1FD3F]/20 text-[#E1FD3F] border border-[#E1FD3F]" : "bg-white/10 text-white/40"}`}>
                                            {index < currentStep ? <CheckCircle2 className="w-3 h-3" /> : index + 1}
                                        </div>
                                        {index < STEPS.length - 1 && <div className={`w-4 h-0.5 mx-0.5 ${index < currentStep ? "bg-[#E1FD3F]" : "bg-white/10"}`} />}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#171717] border border-white/10 rounded-3xl p-8">
                                <div className="w-14 h-14 rounded-xl bg-[#E1FD3F]/20 flex items-center justify-center mb-6 mx-auto">
                                    <CurrentIcon className="w-7 h-7 text-[#E1FD3F]" />
                                </div>
                                <h2 className="text-xl font-bold text-center mb-1">{currentField.label}</h2>
                                <p className="text-white/40 text-center text-sm mb-6">{currentField.hint}</p>

                                {currentField.multiline ? (
                                    <textarea value={currentValue} onChange={(e) => handleInputChange(e.target.value)} placeholder={currentField.placeholder} rows={3}
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#E1FD3F]/50 focus:outline-none resize-none" />
                                ) : (
                                    <input type="text" value={currentValue} onChange={(e) => handleInputChange(e.target.value)} onKeyDown={handleKeyDown}
                                        placeholder={currentField.placeholder} autoFocus
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#E1FD3F]/50 focus:outline-none" />
                                )}

                                <div className="flex items-center justify-between mt-6 gap-4">
                                    <button onClick={() => currentStep === 0 ? setView("dashboard") : handlePrev()}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm">
                                        <ArrowLeft className="w-4 h-4" /> {currentStep === 0 ? "Cancelar" : "Voltar"}
                                    </button>
                                    <button onClick={handleNext} disabled={!currentValue.trim()}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E1FD3F] text-[#0a0a0a] font-bold hover:scale-105 transition-all disabled:opacity-50 text-sm">
                                        {currentStep === STEPS.length - 1 ? <><Sparkles className="w-4 h-4" /> Analisar</> : <>Próximo <ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === "review" && (
                        <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                            <div className="bg-[#171717] border border-[#E1FD3F]/30 rounded-3xl p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E1FD3F] to-[#007AFF] flex items-center justify-center">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Adão melhorou sua proposta!</h2>
                                        <p className="text-white/40 text-sm">Revise e aprove para salvar</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-[#0a0a0a] rounded-xl p-4">
                                        <label className="text-xs text-[#E1FD3F] font-bold mb-2 block">DESCRIÇÃO</label>
                                        <p className="text-white/80 text-sm leading-relaxed">{finalData.description}</p>
                                    </div>
                                    <div className="bg-[#0a0a0a] rounded-xl p-4">
                                        <label className="text-xs text-[#E1FD3F] font-bold mb-2 block">ENTREGAS</label>
                                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{finalData.features}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#0a0a0a] rounded-xl p-4">
                                            <label className="text-xs text-[#E1FD3F] font-bold mb-2 block">PRAZO</label>
                                            <p className="text-white font-bold">{finalData.deadline}</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] rounded-xl p-4">
                                            <label className="text-xs text-[#E1FD3F] font-bold mb-2 block">VALOR</label>
                                            <p className="text-[#E1FD3F] font-bold text-lg">{finalData.budget}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button onClick={handleReject}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                        <Edit3 className="w-4 h-4" /> Editar
                                    </button>
                                    <button onClick={handleApprove}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E1FD3F] text-[#0a0a0a] font-bold hover:scale-105 transition-all">
                                        <CheckCircle2 className="w-4 h-4" /> Aprovar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === "complete" && (
                        <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
                            <div className="bg-[#171717] border border-[#E1FD3F]/30 rounded-3xl p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-[#E1FD3F]/20 flex items-center justify-center mb-6 mx-auto">
                                    <CheckCircle2 className="w-8 h-8 text-[#E1FD3F]" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Orçamento Salvo!</h2>
                                <p className="text-white/40 mb-6 text-sm">Pronto para enviar ao cliente</p>

                                <button onClick={() => generatePDF(finalData)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E1FD3F] text-[#0a0a0a] font-bold hover:scale-105 transition-all mb-3">
                                    <Download className="w-5 h-5" /> Baixar PDF
                                </button>
                                <button onClick={resetForm}
                                    className="w-full px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm">
                                    Ver Todos
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ACTIONS MODAL - Main popup when clicking a budget */}
            <AnimatePresence>
                {modalType === "actions" && selectedBudget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => { setModalType(null); setSelectedBudget(null); }}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#171717] border border-white/10 rounded-2xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold">{selectedBudget.client_name}</h2>
                                    <p className="text-sm text-white/40">{selectedBudget.project_type}</p>
                                </div>
                                <button onClick={() => { setModalType(null); setSelectedBudget(null); }} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/40 text-sm">Status Atual</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_CONFIG[selectedBudget.status].color}`}>
                                        {STATUS_CONFIG[selectedBudget.status].label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/40 text-sm">Valor</span>
                                    <span className="text-[#E1FD3F] font-bold">{selectedBudget.final_value || selectedBudget.budget_value}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {(selectedBudget.status === "criado" || selectedBudget.status === "enviado") && (
                                    <button onClick={() => setModalType("accept")}
                                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all">
                                        <ThumbsUp className="w-6 h-6 text-green-400" />
                                        <span className="text-sm font-bold text-green-400">Aceito</span>
                                        <span className="text-[10px] text-white/40">Cliente aceitou</span>
                                    </button>
                                )}
                                {selectedBudget.status === "em_andamento" && (
                                    <button onClick={() => setModalType("complete")}
                                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                                        <Flag className="w-6 h-6 text-blue-400" />
                                        <span className="text-sm font-bold text-blue-400">Feito</span>
                                        <span className="text-[10px] text-white/40">Projeto entregue</span>
                                    </button>
                                )}
                                <button onClick={() => { setSelectedBudget(selectedBudget); setModalType(null); generatePDF(selectedBudget); }}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 hover:bg-[#E1FD3F]/20 transition-all">
                                    <Download className="w-6 h-6 text-[#E1FD3F]" />
                                    <span className="text-sm font-bold text-[#E1FD3F]">PDF</span>
                                    <span className="text-[10px] text-white/40">Baixar proposta</span>
                                </button>
                                <button onClick={() => { updateStatus(selectedBudget.id, "enviado"); setModalType(null); setSelectedBudget(null); }}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all">
                                    <Send className="w-6 h-6 text-yellow-400" />
                                    <span className="text-sm font-bold text-yellow-400">Enviar</span>
                                    <span className="text-[10px] text-white/40">Marcar enviado</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ACCEPT MODAL */}
            <AnimatePresence>
                {modalType === "accept" && selectedBudget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setModalType("actions")}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#171717] border border-green-500/30 rounded-2xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <ThumbsUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Cliente Aceitou!</h2>
                                    <p className="text-sm text-white/40">Preencha os detalhes</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs text-white/40 mb-2 block">Mudou algo no contrato?</label>
                                    <textarea value={acceptNotes} onChange={(e) => setAcceptNotes(e.target.value)}
                                        placeholder="Descreva alterações no escopo, prazos..."
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-green-500/50 focus:outline-none resize-none" rows={3} />
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={valueChanged} onChange={(e) => setValueChanged(e.target.checked)}
                                            className="w-5 h-5 rounded border-white/20 bg-[#0a0a0a] accent-green-500" />
                                        <span className="text-sm">O valor mudou?</span>
                                    </label>
                                </div>

                                {valueChanged && (
                                    <div>
                                        <label className="text-xs text-white/40 mb-2 block">Novo valor</label>
                                        <input type="text" value={finalValue} onChange={(e) => setFinalValue(e.target.value)}
                                            placeholder="R$ 0,00"
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-green-500/50 focus:outline-none" />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setModalType("actions")}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                                    Voltar
                                </button>
                                <button onClick={handleAccept}
                                    className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all">
                                    Iniciar Projeto
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* COMPLETE MODAL */}
            <AnimatePresence>
                {modalType === "complete" && selectedBudget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setModalType("actions")}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#171717] border border-blue-500/30 rounded-2xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <Flag className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Projeto Entregue!</h2>
                                    <p className="text-sm text-white/40">Finalize o orçamento</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs text-white/40 mb-2 block">Data de Entrega</label>
                                    <input type="date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none" />
                                </div>

                                <div>
                                    <label className="text-xs text-white/40 mb-2 block">Observações finais (opcional)</label>
                                    <textarea value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)}
                                        placeholder="Notas sobre a entrega..."
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none resize-none" rows={3} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setModalType("actions")}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                                    Voltar
                                </button>
                                <button onClick={handleComplete}
                                    className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all">
                                    Finalizar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ANALYTICS MODAL */}
            <AnimatePresence>
                {modalType === "analytics" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setModalType(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#171717] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-[#E1FD3F]/20 flex items-center justify-center">
                                        <PieChart className="w-6 h-6 text-[#E1FD3F]" />
                                    </div>
                                    <h2 className="text-xl font-bold">Relatórios e Métricas</h2>
                                </div>
                                <button onClick={() => setModalType(null)} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                                    <FileText className="w-6 h-6 text-[#E1FD3F] mx-auto mb-2" />
                                    <p className="text-2xl font-black">{budgets.length}</p>
                                    <p className="text-xs text-white/40">Orçamentos Criados</p>
                                </div>
                                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                                    <Send className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                    <p className="text-2xl font-black text-yellow-400">{sent}</p>
                                    <p className="text-xs text-white/40">Enviados</p>
                                </div>
                                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                                    <ThumbsUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <p className="text-2xl font-black text-green-400">{accepted}</p>
                                    <p className="text-xs text-white/40">Aceitos</p>
                                </div>
                                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                                    <Truck className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                    <p className="text-2xl font-black text-purple-400">{inProgress}</p>
                                    <p className="text-xs text-white/40">Em Andamento</p>
                                </div>
                                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                                    <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                    <p className="text-2xl font-black text-green-400">{delivered}</p>
                                    <p className="text-xs text-white/40">Entregues</p>
                                </div>
                                <div className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                    <p className="text-2xl font-black text-blue-400">{avgExecutionDays.toFixed(0)}</p>
                                    <p className="text-xs text-white/40">Dias Médios</p>
                                </div>
                            </div>

                            <div className="bg-[#0a0a0a] rounded-xl p-4 mb-6">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-[#E1FD3F]" /> Valor Total
                                </h3>
                                <p className="text-3xl font-black text-[#E1FD3F]">
                                    R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="bg-[#0a0a0a] rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-[#E1FD3F]" /> Taxa de Conversão
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white/40">Enviados → Aceitos</span>
                                            <span className="font-bold">{sent > 0 ? ((accepted / sent) * 100).toFixed(0) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${sent > 0 ? (accepted / sent) * 100 : 0}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white/40">Aceitos → Entregues</span>
                                            <span className="font-bold">{accepted > 0 ? ((delivered / accepted) * 100).toFixed(0) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${accepted > 0 ? (delivered / accepted) * 100 : 0}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
