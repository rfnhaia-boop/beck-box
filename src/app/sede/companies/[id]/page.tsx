"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Users,
    User,
    Globe,
    FileText,
    Clock,
    Plus,
    CheckCircle2,
    Circle,
    Eye,
    EyeOff,
    Trash2,
    Loader2,
    Send,
    Calendar,
    Link as LinkIcon,
    MessageSquare,
    Shield,
    Copy,
    Check,
    Presentation,
    Receipt,
    FileSignature,
    Sparkles,
    PlayCircle,
    ChevronRight,
    ExternalLink,
    History,
    LayoutDashboard,
    Search,
    Filter
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// ─── Confetti Component ───
function Confetti({ active }: { active: boolean }) {
    if (!active) return null;
    const particles = Array.from({ length: 50 });
    return (
        <div className="fixed inset-0 pointer-events-none z-[200]">
            {particles.map((_, i) => {
                const x = Math.random() * 100;
                const delay = Math.random() * 0.5;
                const duration = 1.5 + Math.random() * 1;
                const size = 4 + Math.random() * 6;
                const colors = ['#E1FD3F', '#A855F7', '#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                return (
                    <motion.div
                        key={i}
                        initial={{ x: `${x}vw`, y: -20, rotate: 0, opacity: 1 }}
                        animate={{ y: '110vh', rotate: 360 + Math.random() * 360, opacity: 0 }}
                        transition={{ duration, delay, ease: 'linear' }}
                        style={{ position: 'absolute', width: size, height: size, backgroundColor: color, borderRadius: size > 7 ? '50%' : '2px' }}
                    />
                );
            })}
        </div>
    );
}

// ─── Status Badge ───
function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; label: string; glow?: string }> = {
        pending: { bg: 'bg-white/5 border-white/10', text: 'text-white/30', label: 'Pendente' },
        in_progress: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', label: 'Fazendo', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]' },
        complete: { bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-400', label: 'Concluído' },
    };
    const c = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${c.bg} ${c.text} ${c.glow || ''} transition-all`}>
            {status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
            {c.label}
        </span>
    );
}

// ─── Phase Card ───
function PhaseCard({ icon: Icon, title, subtitle, status, onClick, index, url }: {
    icon: any; title: string; subtitle: string; status: string;
    onClick: () => void; index: number; url?: string;
}) {
    const isComplete = status === 'complete';
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className={`relative cursor-pointer group p-6 rounded-[28px] border-2 transition-all duration-500 ${isComplete
                ? 'bg-green-500/5 border-green-500/30 hover:border-green-500/50'
                : 'bg-white/[0.02] border-white/10 hover:border-[#E1FD3F]/30 hover:bg-white/[0.04]'
                }`}
        >
            {/* Step Number */}
            <div className="absolute -top-3 -left-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isComplete ? 'bg-green-500 text-black' : 'bg-white/10 text-white/40'
                    }`}>
                    {isComplete ? '✓' : `0${index + 1}`}
                </span>
            </div>

            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isComplete
                    ? 'bg-green-500/20'
                    : 'bg-white/5 group-hover:bg-[#E1FD3F]/10'
                    }`}>
                    {isComplete ? (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <CheckCircle2 className="w-7 h-7 text-green-400" />
                        </motion.div>
                    ) : (
                        <Icon className="w-7 h-7 text-white/30 group-hover:text-[#E1FD3F] transition-colors" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-bold mb-1 ${isComplete ? 'text-green-400' : 'text-white'}`}>
                        {title}
                    </h3>
                    <p className="text-xs text-white/30 leading-relaxed">{subtitle}</p>
                    {url && (
                        <a href={url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 mt-2 text-[10px] text-[#E1FD3F]/60 hover:text-[#E1FD3F] font-mono">
                            <LinkIcon className="w-3 h-3" /> Abrir link
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Page ───
export default function CompanyDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"milestones" | "documents" | "updates">("milestones");
    const [showConfetti, setShowConfetti] = useState(false);

    // Forms
    const [milestoneForm, setMilestoneForm] = useState({ title: "", due_date: "" });
    const [documentForm, setDocumentForm] = useState({ title: "", url: "", visible_to_client: true, doc_type: "other" });
    const [updateForm, setUpdateForm] = useState({ title: "", body: "", visible_to_client: true });
    const [submitting, setSubmitting] = useState(false);
    const [copiedField, setCopiedField] = useState("");

    // Phase modal
    const [phaseModal, setPhaseModal] = useState<null | "presentation" | "budget" | "contract">(null);
    const [phaseUrl, setPhaseUrl] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/owner/companies/${id}`, { cache: 'no-store' });
            if (res.ok) setData(await res.json());
            else router.push("/sede/companies");
        } catch { router.push("/sede/companies"); }
        finally { setLoading(false); }
    }, [id, router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    async function performAction(action: string, payload: any) {
        setSubmitting(true);
        try {
            const res = await fetch(`/api/owner/companies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, payload })
            });
            if (res.ok) {
                await fetchData();
            } else {
                const err = await res.json();
                alert(err.error || "Erro na operação");
            }
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    }

    function handlePhaseToggle(phase: "presentation" | "budget" | "contract") {
        const key = `phase_${phase}` as const;
        const current = data.tenant[key];
        if (current === 'complete') {
            // Toggle back to pending
            performAction("update_phase", { [key]: 'pending' });
        } else {
            // Open modal for URL input
            setPhaseModal(phase);
            setPhaseUrl("");
        }
    }

    async function handlePhaseComplete() {
        const key = `phase_${phaseModal}` as const;
        const urlKey = phaseModal === 'presentation' ? 'presentation_url' : phaseModal === 'contract' ? 'contract_url' : undefined;
        const payload: any = { [key]: 'complete' };
        if (urlKey && phaseUrl) payload[urlKey] = phaseUrl;

        await performAction("update_phase", payload);
        setPhaseModal(null);

        // Check if all 3 phases are now complete
        const t = data.tenant;
        const otherPhases = ['presentation', 'budget', 'contract'].filter(p => p !== phaseModal);
        const allComplete = otherPhases.every(p => t[`phase_${p}`] === 'complete');
        if (allComplete) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    }

    function cycleMilestoneStatus(current: string): string {
        if (current === 'pending') return 'in_progress';
        if (current === 'in_progress') return 'complete';
        return 'pending';
    }

    function copyToClipboard(text: string, field: string) {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#050505]">
                <Loader2 className="w-8 h-8 text-[#E1FD3F] animate-spin" />
            </main>
        );
    }
    if (!data) return null;

    const t = data.tenant;
    const completedMilestones = data.milestones.filter((m: any) => m.status === 'complete').length;
    const totalMilestones = data.milestones.length;
    const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const phasesComplete = [t.phase_presentation, t.phase_budget, t.phase_contract].filter((p: string) => p === 'complete').length;
    const allPhasesComplete = phasesComplete === 3;

    const activeMilestone = data.milestones.find((m: any) => m.status === 'in_progress');

    const tabs = [
        { key: "milestones" as const, label: "Andamento", icon: Clock, count: data.milestones.length },
        { key: "documents" as const, label: "Documentos", icon: FileText, count: data.documents.length },
        { key: "updates" as const, label: "Novidades", icon: MessageSquare, count: data.updates.length }
    ];

    return (
        <main className="min-h-screen relative text-[#EFEFEF] overflow-x-hidden bg-[#050505]">
            <FuturisticBackground />
            <Header />
            <Confetti active={showConfetti} />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                {/* Back */}
                <Link href="/sede/companies" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Empresas
                </Link>

                {/* Header Row */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    {/* Company Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-[32px] p-8">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E1FD3F] to-[#A855F7] p-0.5">
                                    <div className="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center">
                                        <span className="text-2xl font-black italic text-[#E1FD3F]">
                                            {t.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">{t.name}</h1>
                                    {t.cnpj && <p className="text-white/30 text-xs mt-1">CNPJ: {t.cnpj}</p>}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${t.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {t.status}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { value: data.users.length, label: "Usuários", color: "text-[#E1FD3F]" },
                                { value: data.contracts.length, label: "Contratos", color: "text-[#A855F7]" },
                                { value: `${phasesComplete}/3`, label: "Docs", color: allPhasesComplete ? "text-green-400" : "text-white/60" },
                                { value: `${progressPercent}%`, label: "Progresso", color: "text-white" },
                            ].map((s, i) => (
                                <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                                    <p className="text-[9px] text-white/25 uppercase tracking-widest font-bold mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Active milestone indicator */}
                        {activeMilestone && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                                    <div>
                                        <p className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold">Trabalhando em</p>
                                        <p className="text-sm font-bold text-blue-300">{activeMilestone.title}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Client Access */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:w-[360px] flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-[#E1FD3F]" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Acesso do Cliente</h3>
                        </div>

                        {data.users.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                                <p className="text-white/30 text-sm text-center py-8">Nenhum usuário cliente vinculado.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {(data.users || []).map((u: any) => (
                                    <motion.div
                                        key={u.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative group overflow-hidden rounded-[32px] bg-white/[0.03] border border-white/10 p-6 backdrop-blur-md"
                                    >
                                        {/* Glass reflection effect */}
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E1FD3F]/5 blur-[60px] rounded-full pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E1FD3F] to-[#80ff00] flex items-center justify-center shadow-lg shadow-[#E1FD3F]/20">
                                                        <User className="w-5 h-5 text-black" strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-[#E1FD3F] font-black uppercase tracking-[0.2em]">Acesso Master</span>
                                                        <p className="text-white font-bold text-sm truncate max-w-[180px]">{u.email || "Email Indisponível"}</p>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">
                                                    {u.role?.replace('_', ' ')}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Email Field */}
                                                <div className="relative group/field">
                                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 block ml-1">Email de Login</label>
                                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 transition-colors group-hover/field:border-white/10">
                                                        <p className="text-xs text-white/80 font-medium flex-1 truncate">{u.email}</p>
                                                        <button onClick={() => copyToClipboard(u.email, `email-${u.id}`)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-[#E1FD3F]">
                                                            {copiedField === `email-${u.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Password Field */}
                                                <div className="relative group/field">
                                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1.5 block ml-1">Senha de Acesso</label>
                                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 transition-colors group-hover/field:border-white/10">
                                                        <p className="text-xs text-white/80 font-mono flex-1 truncate">{u.password_plain || "••••••••"}</p>
                                                        {u.password_plain && (
                                                            <button onClick={() => copyToClipboard(u.password_plain, `pwd-${u.id}`)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-[#E1FD3F]">
                                                                {copiedField === `pwd-${u.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Login URL Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-[#E1FD3F]/10 to-[#80ff00]/5 border border-[#E1FD3F]/20 rounded-[32px] p-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Globe className="w-12 h-12 text-[#E1FD3F]" />
                                    </div>
                                    <label className="text-[9px] font-black text-[#E1FD3F] uppercase tracking-widest mb-3 block">URL Privada do Cliente</label>
                                    <div className="flex items-center gap-3 mb-4">
                                        <p className="text-sm font-black text-white tracking-tight flex-1 truncate">
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/login
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/login`, 'login-url')}
                                            className="w-10 h-10 rounded-xl bg-[#E1FD3F] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#E1FD3F]/20"
                                        >
                                            {copiedField === 'login-url' ? <Check className="w-4 h-4" strokeWidth={3} /> : <Copy className="w-4 h-4" strokeWidth={3} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-white/40 leading-relaxed max-w-[220px]">
                                        O cliente acessa o dashboard via <strong className="text-white/60">/login</strong> usando as credenciais acima.
                                    </p>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ═══ DOCUMENTATION STEPPER ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className={`w-5 h-5 ${allPhasesComplete ? 'text-green-400' : 'text-[#E1FD3F]'}`} />
                        <h2 className="text-lg font-bold uppercase tracking-widest">Central de Documentação</h2>
                        {allPhasesComplete && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest border border-green-500/20"
                            >
                                ✓ Completo
                            </motion.span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <PhaseCard
                            icon={Presentation}
                            title="Apresentação"
                            subtitle="Upload da apresentação do projeto ou link do documento"
                            status={t.phase_presentation}
                            onClick={() => handlePhaseToggle("presentation")}
                            index={0}
                            url={t.presentation_url}
                        />
                        <PhaseCard
                            icon={Receipt}
                            title="Orçamento"
                            subtitle="Validar valores, download do orçamento aprovado"
                            status={t.phase_budget}
                            onClick={() => handlePhaseToggle("budget")}
                            index={1}
                        />
                        <PhaseCard
                            icon={FileSignature}
                            title="Contrato"
                            subtitle="Assinatura digital ou upload do contrato"
                            status={t.phase_contract}
                            onClick={() => handlePhaseToggle("contract")}
                            index={2}
                            url={t.contract_url}
                        />
                    </div>

                    {/* Connector line */}
                    <div className="hidden md:flex justify-center mt-4">
                        <div className="flex items-center gap-1">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${[t.phase_presentation, t.phase_budget, t.phase_contract][i] === 'complete'
                                        ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'
                                        : 'bg-white/10'
                                        }`} />
                                    {i < 2 && (
                                        <div className={`w-24 h-0.5 transition-all duration-500 ${[t.phase_presentation, t.phase_budget, t.phase_contract][i] === 'complete'
                                            ? 'bg-green-400/40'
                                            : 'bg-white/5'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ═══ TABS ═══ */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.key
                                ? 'bg-[#E1FD3F] text-[#050505] shadow-[0_0_20px_rgba(225,253,63,0.2)]'
                                : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/10'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? 'bg-black/20 text-[#050505]' : 'bg-white/5 text-white/20'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ═══ TAB CONTENT ═══ */}
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-[32px] p-8">

                    {/* ── MILESTONES ── */}
                    {activeTab === "milestones" && (
                        <div className="space-y-6">
                            {/* Progress Bar */}
                            {totalMilestones > 0 && (
                                <div className="mb-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Progresso Geral</span>
                                        <span className="text-sm font-black text-[#E1FD3F]">{progressPercent}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="h-full rounded-full bg-gradient-to-r from-[#E1FD3F] to-green-400"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Add Form */}
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (!milestoneForm.title) return;
                                performAction("add_milestone", milestoneForm);
                                setMilestoneForm({ title: "", due_date: "" });
                            }} className="flex flex-col md:flex-row gap-4">
                                <input value={milestoneForm.title}
                                    onChange={e => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                                    placeholder="Nova etapa (ex: Entrega da identidade visual)"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm" />
                                <input type="date" value={milestoneForm.due_date}
                                    onChange={e => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm w-full md:w-48" />
                                <button type="submit" disabled={submitting || !milestoneForm.title}
                                    className="bg-[#E1FD3F] text-[#050505] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 justify-center whitespace-nowrap">
                                    <Plus className="w-4 h-4" /> Criar Etapa
                                </button>
                            </form>

                            {/* List */}
                            {data.milestones.length === 0 ? (
                                <p className="text-center text-white/20 py-12 text-sm">Nenhuma etapa criada. Adicione acima para começar.</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.milestones.map((m: any, i: number) => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-500 ${m.status === 'complete'
                                                ? 'bg-green-500/5 border-green-500/20'
                                                : m.status === 'in_progress'
                                                    ? 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                                    : 'bg-white/[0.02] border-white/5'
                                                }`}
                                        >
                                            {/* Status Toggle */}
                                            <button
                                                onClick={() => performAction("update_milestone_status", { id: m.id, status: cycleMilestoneStatus(m.status || 'pending') })}
                                                className="flex-shrink-0 transition-transform hover:scale-110"
                                            >
                                                {m.status === 'complete' ? (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                                                        <CheckCircle2 className="w-7 h-7 text-green-400" />
                                                    </motion.div>
                                                ) : m.status === 'in_progress' ? (
                                                    <div className="relative">
                                                        <PlayCircle className="w-7 h-7 text-blue-400" />
                                                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                                                    </div>
                                                ) : (
                                                    <Circle className="w-7 h-7 text-white/15 hover:text-white/30 transition-colors" />
                                                )}
                                            </button>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <p className={`text-sm font-bold transition-all ${m.status === 'complete' ? 'text-white/50 line-through' : m.status === 'in_progress' ? 'text-blue-300' : 'text-white'}`}>
                                                    {m.title}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    {m.due_date && (
                                                        <p className="text-[10px] text-white/20 font-mono">
                                                            <Calendar className="w-3 h-3 inline mr-1" />
                                                            {new Date(m.due_date).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                    <StatusBadge status={m.status || 'pending'} />
                                                </div>
                                            </div>

                                            {/* Delete */}
                                            <button onClick={() => performAction("delete_milestone", { id: m.id })}
                                                className="text-white/10 hover:text-red-400 transition-colors flex-shrink-0">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── DOCUMENTS ── */}
                    {activeTab === "documents" && (
                        <div className="space-y-6">
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (!documentForm.title || !documentForm.url) return;
                                performAction("add_document", documentForm);
                                setDocumentForm({ title: "", url: "", visible_to_client: true, doc_type: "other" });
                            }} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Nome</label>
                                    <input value={documentForm.title}
                                        onChange={e => setDocumentForm({ ...documentForm, title: e.target.value })}
                                        placeholder="Nome do documento"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold">URL</label>
                                    <input value={documentForm.url}
                                        onChange={e => setDocumentForm({ ...documentForm, url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm" />
                                </div>
                                <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer whitespace-nowrap px-2 py-3">
                                    <input type="checkbox" checked={documentForm.visible_to_client}
                                        onChange={e => setDocumentForm({ ...documentForm, visible_to_client: e.target.checked })}
                                        className="rounded accent-[#E1FD3F]" />
                                    <Eye className="w-3.5 h-3.5" />
                                </label>
                                <button type="submit" disabled={submitting || !documentForm.title || !documentForm.url}
                                    className="bg-[#E1FD3F] text-[#050505] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 justify-center whitespace-nowrap">
                                    <Plus className="w-4 h-4" /> Adicionar
                                </button>
                            </form>

                            {data.documents.length === 0 ? (
                                <p className="text-center text-white/20 py-12 text-sm">Nenhum documento. Adicione acima.</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.documents.map((d: any) => (
                                        <div key={d.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                            <FileText className="w-5 h-5 text-white/20 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{d.title}</p>
                                                <a href={d.url} target="_blank" rel="noopener"
                                                    className="text-[10px] text-[#E1FD3F]/60 hover:text-[#E1FD3F] font-mono truncate block mt-0.5">
                                                    <LinkIcon className="w-3 h-3 inline mr-1" />{d.url}
                                                </a>
                                            </div>
                                            <button onClick={() => performAction("toggle_document_visibility", { id: d.id })}
                                                className={`p-2 rounded-lg transition-all ${d.visible_to_client ? 'text-[#E1FD3F] bg-[#E1FD3F]/10' : 'text-white/20 bg-white/5'}`}
                                                title={d.visible_to_client ? "Visível" : "Oculto"}>
                                                {d.visible_to_client ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => performAction("delete_document", { id: d.id })}
                                                className="text-white/10 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── UPDATES ── */}
                    {activeTab === "updates" && (
                        <div className="space-y-6">
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (!updateForm.title || !updateForm.body) return;
                                performAction("add_update", updateForm);
                                setUpdateForm({ title: "", body: "", visible_to_client: true });
                            }} className="space-y-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input value={updateForm.title}
                                        onChange={e => setUpdateForm({ ...updateForm, title: e.target.value })}
                                        placeholder="Título da atualização"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm" />
                                    <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer whitespace-nowrap px-3">
                                        <input type="checkbox" checked={updateForm.visible_to_client}
                                            onChange={e => setUpdateForm({ ...updateForm, visible_to_client: e.target.checked })}
                                            className="rounded accent-[#E1FD3F]" />
                                        <Eye className="w-3.5 h-3.5" /> Visível
                                    </label>
                                </div>
                                <textarea value={updateForm.body}
                                    onChange={e => setUpdateForm({ ...updateForm, body: e.target.value })}
                                    placeholder="Descreva o progresso, entrega ou novidade..."
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm resize-none" />
                                <button type="submit" disabled={submitting || !updateForm.title || !updateForm.body}
                                    className="bg-[#E1FD3F] text-[#050505] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Publicar
                                </button>
                            </form>

                            {data.updates.length === 0 ? (
                                <p className="text-center text-white/20 py-12 text-sm">Nenhuma atualização publicada.</p>
                            ) : (
                                <div className="space-y-4">
                                    {data.updates.map((u: any) => (
                                        <div key={u.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">{u.title}</h4>
                                                    <p className="text-[10px] text-white/20 font-mono mt-0.5">
                                                        {new Date(u.created_at).toLocaleDateString()} · {new Date(u.created_at).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => performAction("toggle_update_visibility", { id: u.id })}
                                                        className={`p-2 rounded-lg transition-all ${u.visible_to_client ? 'text-[#E1FD3F] bg-[#E1FD3F]/10' : 'text-white/20 bg-white/5'}`}>
                                                        {u.visible_to_client ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => performAction("delete_update", { id: u.id })}
                                                        className="text-white/10 hover:text-red-400 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-white/60 leading-relaxed">{u.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ═══ PHASE COMPLETION MODAL ═══ */}
            <AnimatePresence>
                {phaseModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setPhaseModal(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[28px] overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-xl font-bold">
                                    Concluir {phaseModal === 'presentation' ? 'Apresentação' : phaseModal === 'budget' ? 'Orçamento' : 'Contrato'}
                                </h2>
                                <p className="text-xs text-white/40 mt-1">Opcional: adicione um link do documento</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {(phaseModal === 'presentation' || phaseModal === 'contract') && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Link do {phaseModal === 'presentation' ? 'arquivo' : 'contrato'} (opcional)</label>
                                        <input
                                            value={phaseUrl}
                                            onChange={e => setPhaseUrl(e.target.value)}
                                            placeholder="https://drive.google.com/..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setPhaseModal(null)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                                        Cancelar
                                    </button>
                                    <button onClick={handlePhaseComplete} disabled={submitting}
                                        className="flex-[2] bg-green-500 text-black px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 flex items-center gap-2 justify-center">
                                        <CheckCircle2 className="w-4 h-4" /> Marcar como Concluído
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
