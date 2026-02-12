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
    Filter,
    Building2
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
    const styles: Record<string, string> = {
        pending: 'bg-white/5 border-white/10 text-white/40',
        in_progress: 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
        complete: 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
    };
    const labels: Record<string, string> = { pending: 'Pendente', in_progress: 'Em andamento', complete: 'Concluído' };

    return (
        <div className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${styles[status] || styles.pending}`}>
            {status === 'in_progress' && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
            )}
            {status === 'complete' && <CheckCircle2 className="w-3 h-3" />}
            {labels[status] || 'Pendente'}
        </div>
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
            className={`relative cursor-pointer group p-6 rounded-[24px] border transition-all duration-500 overflow-hidden ${isComplete
                ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                : 'bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
                }`}
        >
            {/* Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${isComplete ? 'from-green-500/10 to-transparent' : 'from-white/5 to-transparent'}`} />

            {/* Step Number */}
            <div className="absolute top-4 right-4 translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                    }`}>
                    {isComplete ? 'Concluído' : `0${index + 1}`}
                </span>
            </div>

            <div className="flex items-start gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isComplete
                    ? 'bg-green-500/20'
                    : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                    {isComplete ? (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </motion.div>
                    ) : (
                        <Icon className="w-6 h-6 text-white/30 group-hover:text-white transition-colors" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold mb-1 transition-colors ${isComplete ? 'text-green-400' : 'text-white group-hover:text-[#E1FD3F]'}`}>
                        {title}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{subtitle}</p>
                    {url && (
                        <div className="mt-3 flex items-center gap-2">
                            <a href={url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-[10px] text-[#E1FD3F] font-mono group/link">
                                <LinkIcon className="w-3 h-3" />
                                <span className="group-hover/link:underline">Abrir Documento</span>
                            </a>
                        </div>
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
        <main className="min-h-screen bg-[#050505] text-[#EFEFEF] selection:bg-[#E1FD3F]/30 overflow-x-hidden">
            <FuturisticBackground />
            <Header />
            <Confetti active={showConfetti} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-8">
                {/* Back Navigation */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <Link href="/sede/companies" className="group inline-flex items-center gap-2 text-white/40 hover:text-[#E1FD3F] text-xs font-bold uppercase tracking-[0.2em] transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar para Empresas
                    </Link>
                </motion.div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
                    {/* ═══ Left Column: Profile & Stats ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8 space-y-6"
                    >
                        {/* Company Detail Card */}
                        <div className="relative overflow-hidden bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative group/logo">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-[#E1FD3F] to-[#A855F7] rounded-3xl opacity-50 blur group-hover/logo:opacity-100 transition duration-500" />
                                        <div className="relative w-20 h-20 rounded-2xl bg-[#0F0F0F] flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl">
                                            {t.logo_url ? (
                                                <img src={t.logo_url} alt={t.name} className="w-14 h-14 object-contain" />
                                            ) : (
                                                <span className="text-3xl font-black italic bg-gradient-to-br from-[#E1FD3F] to-white bg-clip-text text-transparent">
                                                    {t.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">{t.name}</h1>
                                            <StatusBadge status={t.status?.toLowerCase() === 'active' ? 'complete' : 'pending'} />
                                        </div>
                                        <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                                            <Building2 className="w-3.5 h-3.5" />
                                            <span>CNPJ: {t.cnpj || "Não informado"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                                {[
                                    { icon: Users, value: data.users.length, label: "Usuários", color: "text-[#E1FD3F]", bg: "bg-[#E1FD3F]/5" },
                                    { icon: FileSignature, value: data.contracts.length, label: "Contratos", color: "text-[#A855F7]", bg: "bg-[#A855F7]/5" },
                                    { icon: CheckCircle2, value: `${phasesComplete}/3`, label: "Etapas Base", color: "text-green-400", bg: "bg-green-400/5" },
                                    { icon: Sparkles, value: `${progressPercent}%`, label: "Progresso", color: "text-blue-400", bg: "bg-blue-400/5" },
                                ].map((s, i) => (
                                    <div key={i} className="relative group/stat p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                                        <div className={`absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 rounded-2xl ${s.bg}`} />
                                        <div className="relative z-10 text-center">
                                            <s.icon className={`w-4 h-4 mx-auto mb-2 ${s.color} opacity-40 group-hover/stat:opacity-100 transition-all`} />
                                            <p className={`text-2xl font-black tracking-tight ${s.color}`}>{s.value}</p>
                                            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black mt-1">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══ Right Column: Access Control ═══ */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4"
                    >
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
                                {(data.users || []).map((u: any, idx: number) => (
                                    <motion.div
                                        key={u.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        className="relative group overflow-hidden rounded-[24px] bg-[#0A0A0A] border border-white/5 p-6 hover:border-white/10 transition-all"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#E1FD3F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-[#E1FD3F]" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-[#E1FD3F] font-black uppercase tracking-[0.2em] opacity-60">Acesso Master</span>
                                                        <p className="text-white font-bold text-sm truncate max-w-[150px]">{u.email?.split('@')[0]}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status="complete" />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest block ml-1">Credenciais</label>

                                                    {/* Email Field */}
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                                                        <p className="text-[11px] text-white/50 font-medium flex-1 truncate">{u.email}</p>
                                                        <button onClick={() => copyToClipboard(u.email, `email-${u.id}`)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-[#E1FD3F]">
                                                            {copiedField === `email-${u.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>

                                                    {/* Password Field */}
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                                                        <p className="text-[11px] text-white/50 font-mono flex-1 truncate">{u.password_plain || "••••••••"}</p>
                                                        {u.password_plain && (
                                                            <button onClick={() => copyToClipboard(u.password_plain, `pwd-${u.id}`)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-[#E1FD3F]">
                                                                {copiedField === `pwd-${u.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
                                    transition={{ delay: 0.5 }}
                                    className="bg-gradient-to-br from-[#E1FD3F]/20 via-[#E1FD3F]/5 to-transparent border border-[#E1FD3F]/20 rounded-[24px] p-6 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Globe className="w-12 h-12 text-[#E1FD3F]" />
                                    </div>
                                    <label className="text-[9px] font-black text-[#E1FD3F] uppercase tracking-widest mb-3 block">URL Privada</label>
                                    <div className="flex items-center gap-3 mb-4">
                                        <p className="text-xs font-bold text-white/80 tracking-tight flex-1 truncate font-mono">
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/login
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/login`, 'login-url')}
                                            className="w-8 h-8 rounded-lg bg-[#E1FD3F] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#E1FD3F]/20"
                                        >
                                            {copiedField === 'login-url' ? <Check className="w-4 h-4" strokeWidth={3} /> : <Copy className="w-4 h-4" strokeWidth={3} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-white/30 leading-relaxed italic">
                                        Compartilhe este link com o cliente para que ele acesse o bunker.
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
                    transition={{ delay: 0.4 }}
                    className="relative"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl border ${allPhasesComplete ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-[#E1FD3F]/10 border-[#E1FD3F]/20 text-[#E1FD3F]'}`}>
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white">Central de Documentação</h2>
                                <p className="text-xs text-white/30">Gerencie as fases iniciais do projeto</p>
                            </div>
                        </div>

                        {allPhasesComplete && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Etapas Blindadas</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PhaseCard
                            icon={Presentation}
                            title="Apresentação"
                            subtitle="Upload do deck ou link do documento"
                            status={t.phase_presentation}
                            onClick={() => handlePhaseToggle("presentation")}
                            index={0}
                            url={t.presentation_url}
                        />
                        <PhaseCard
                            icon={Receipt}
                            title="Orçamento"
                            subtitle="Validar valores e aprovação"
                            status={t.phase_budget}
                            onClick={() => handlePhaseToggle("budget")}
                            index={1}
                        />
                        <PhaseCard
                            icon={FileSignature}
                            title="Contrato"
                            subtitle="Assinatura digital ou upload"
                            status={t.phase_contract}
                            onClick={() => handlePhaseToggle("contract")}
                            index={2}
                            url={t.contract_url}
                        />
                    </div>
                </motion.div>

                {/* ═══ TABS ═══ */}
                <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit mb-8 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.key
                                ? 'bg-[#E1FD3F] text-[#050505] shadow-[0_0_20px_rgba(225,253,63,0.3)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.key ? 'bg-black/20 text-[#050505]' : 'bg-white/5 text-white/20'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ═══ TAB CONTENT ═══ */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[32px] bg-[#0A0A0A] border border-white/5 p-8"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

                    {/* ── MILESTONES ── */}
                    {activeTab === "milestones" && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-white mb-1">Andamento do Projeto</h3>
                                    <p className="text-sm text-white/30">Liste e gerencie as etapas de entrega</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Conatagem</p>
                                        <p className="text-lg font-black text-[#E1FD3F]">{completedMilestones}/{totalMilestones}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="relative w-12 h-12">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="24" cy="24" r="20" className="stroke-white/5 fill-none" strokeWidth="4" />
                                            <motion.circle
                                                cx="24" cy="24" r="20"
                                                className="stroke-[#E1FD3F] fill-none"
                                                strokeWidth="4"
                                                strokeDasharray="125.66"
                                                initial={{ strokeDashoffset: 125.66 }}
                                                animate={{ strokeDashoffset: 125.66 - (125.66 * progressPercent) / 100 }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#E1FD3F]">
                                            {progressPercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Add Form */}
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (!milestoneForm.title) return;
                                performAction("add_milestone", milestoneForm);
                                setMilestoneForm({ title: "", due_date: "" });
                            }} className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <input value={milestoneForm.title}
                                    onChange={e => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                                    placeholder="Nova etapa (ex: Entrega da identidade visual)"
                                    className="flex-1 bg-transparent border-none px-4 py-2 outline-none text-sm placeholder:text-white/10 text-white" />
                                <div className="flex items-center gap-3">
                                    <input type="date" value={milestoneForm.due_date}
                                        onChange={e => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#E1FD3F]/50 transition-all text-[11px] w-full md:w-40 text-white/40 font-mono" />
                                    <button type="submit" disabled={submitting || !milestoneForm.title}
                                        className="bg-[#E1FD3F] text-[#050505] px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] transition-all">
                                        <Plus className="w-3.5 h-3.5" /> Criar
                                    </button>
                                </div>
                            </form>

                            {/* List */}
                            <div className="space-y-3">
                                {data.milestones.length === 0 ? (
                                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <Clock className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-white/20 text-sm italic">Nenhuma etapa iniciada para este cliente.</p>
                                    </div>
                                ) : (
                                    data.milestones.map((m: any, i: number) => (
                                        <motion.div
                                            key={m.id}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 group ${m.status === 'complete'
                                                ? 'bg-green-500/5 border-green-500/10'
                                                : m.status === 'in_progress'
                                                    ? 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]'
                                                    : 'bg-white/[0.01] border-white/5 hover:border-white/10 shadow-sm'
                                                }`}
                                        >
                                            <button
                                                onClick={() => performAction("update_milestone_status", { id: m.id, status: cycleMilestoneStatus(m.status || 'pending') })}
                                                className="relative group/toggle"
                                            >
                                                {m.status === 'complete' ? (
                                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40">
                                                        <Check className="w-3.5 h-3.5 text-green-400" />
                                                    </div>
                                                ) : m.status === 'in_progress' ? (
                                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover/toggle:border-white/30 transition-colors" />
                                                )}
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${m.status === 'complete' ? 'text-white/20 line-through' : 'text-white'}`}>
                                                    {m.title}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1 opacity-60">
                                                    {m.due_date && (
                                                        <p className="text-[10px] font-mono flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(m.due_date).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <StatusBadge status={m.status || 'pending'} />
                                                <button onClick={() => performAction("delete_milestone", { id: m.id })}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-red-400 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── DOCUMENTS ── */}
                    {activeTab === "documents" && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-white mb-1">Arquivos & Ativos</h3>
                                    <p className="text-sm text-white/30">Repositório de documentos do projeto</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center px-6">
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Total</p>
                                        <p className="text-xl font-black text-[#A855F7]">{data.documents.length}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={e => {
                                e.preventDefault();
                                if (!documentForm.title || !documentForm.url) return;
                                performAction("add_document", documentForm);
                                setDocumentForm({ title: "", url: "", visible_to_client: true, doc_type: "other" });
                            }} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="md:col-span-5 space-y-1.5">
                                    <label className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black ml-1">Título</label>
                                    <input value={documentForm.title}
                                        onChange={e => setDocumentForm({ ...documentForm, title: e.target.value })}
                                        placeholder="Manual da Marca, Logo PNG..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm text-white" />
                                </div>
                                <div className="md:col-span-5 space-y-1.5">
                                    <label className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black ml-1">URL / Link</label>
                                    <input value={documentForm.url}
                                        onChange={e => setDocumentForm({ ...documentForm, url: e.target.value })}
                                        placeholder="Cloud, Drive, Figma..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm text-white" />
                                </div>
                                <div className="md:col-span-2 flex items-end gap-2">
                                    <button type="button"
                                        onClick={() => setDocumentForm({ ...documentForm, visible_to_client: !documentForm.visible_to_client })}
                                        className={`flex-1 flex items-center justify-center p-2.5 rounded-xl border transition-all ${documentForm.visible_to_client ? 'bg-[#E1FD3F]/10 border-[#E1FD3F]/20 text-[#E1FD3F]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                        {documentForm.visible_to_client ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button type="submit" disabled={submitting || !documentForm.title || !documentForm.url}
                                        className="flex-[2] bg-white text-black px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest disabled:opacity-50 hover:bg-[#E1FD3F] transition-colors">
                                        Subir
                                    </button>
                                </div>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.documents.length === 0 ? (
                                    <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <FileText className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-white/20 text-sm italic">Nenhum documento anexado.</p>
                                    </div>
                                ) : (
                                    data.documents.map((d: any) => (
                                        <div key={d.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-5 h-5 text-white/20" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{d.title}</p>
                                                <a href={d.url} target="_blank" rel="noopener"
                                                    className="inline-flex items-center gap-1.5 text-[10px] text-[#E1FD3F]/60 hover:text-[#E1FD3F] font-mono mt-1 transition-colors">
                                                    <LinkIcon className="w-3 h-3" /> Ver arquivo
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => performAction("toggle_document_visibility", { id: d.id })}
                                                    className={`p-2 rounded-lg transition-all ${d.visible_to_client ? 'text-[#E1FD3F] bg-[#E1FD3F]/10' : 'text-white/20 bg-white/5'}`}>
                                                    {d.visible_to_client ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                </button>
                                                <button onClick={() => performAction("delete_document", { id: d.id })}
                                                    className="p-2 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── UPDATES ── */}
                    {activeTab === "updates" && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-white mb-1">Mural de Novidades</h3>
                                    <p className="text-sm text-white/30">Comunicações e logs de progresso</p>
                                </div>
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E1FD3F]/10 text-[#E1FD3F] border border-[#E1FD3F]/20 text-[10px] font-black uppercase tracking-widest">
                                    <History className="w-3.5 h-3.5" /> Ver Histórico Completo
                                </button>
                            </div>

                            <form onSubmit={e => {
                                e.preventDefault();
                                if (!updateForm.title || !updateForm.body) return;
                                performAction("add_update", updateForm);
                                setUpdateForm({ title: "", body: "", visible_to_client: true });
                            }} className="space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-2xl">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input value={updateForm.title}
                                        onChange={e => setUpdateForm({ ...updateForm, title: e.target.value })}
                                        placeholder="Título da atualização (ex: Campanha aprovada!)"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm text-white" />
                                    <button type="button"
                                        onClick={() => setUpdateForm({ ...updateForm, visible_to_client: !updateForm.visible_to_client })}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${updateForm.visible_to_client ? 'bg-[#E1FD3F]/10 border-[#E1FD3F]/20 text-[#E1FD3F]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                        {updateForm.visible_to_client ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Visibilidade Cli.</span>
                                    </button>
                                </div>
                                <textarea value={updateForm.body}
                                    onChange={e => setUpdateForm({ ...updateForm, body: e.target.value })}
                                    placeholder="Mensagem para o cliente..."
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm resize-none text-white/80" />
                                <div className="flex justify-end">
                                    <button type="submit" disabled={submitting || !updateForm.title || !updateForm.body}
                                        className="bg-[#E1FD3F] text-[#050505] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(225,253,63,0.3)] transition-all">
                                        <Send className="w-4 h-4" /> Enviar para o Mural
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-4">
                                {data.updates.length === 0 ? (
                                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <MessageSquare className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-white/20 text-sm italic">Nenhuma comunicação enviada ainda.</p>
                                    </div>
                                ) : (
                                    data.updates.map((u: any) => (
                                        <div key={u.id} className="relative group p-6 rounded-[24px] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => performAction("toggle_update_visibility", { id: u.id })}
                                                    className={`p-2 rounded-lg transition-all ${u.visible_to_client ? 'text-[#E1FD3F] bg-[#E1FD3F]/10' : 'text-white/10 hover:text-white hover:bg-white/5'}`}>
                                                    {u.visible_to_client ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => performAction("delete_update", { id: u.id })}
                                                    className="p-2 text-white/5 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#E1FD3F] mt-2 shadow-[0_0_10px_#E1FD3F]" />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="text-base font-bold text-white">{u.title}</h4>
                                                        <p className="text-[10px] text-white/20 font-mono">
                                                            {new Date(u.created_at).toLocaleDateString()} · {new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{u.body}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ═══ PHASE COMPLETION MODAL ═══ */}
            <AnimatePresence>
                {phaseModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E1FD3F]/5 to-transparent pointer-events-none" />

                            <div className="p-10 relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight">Finalizar Etapa</h2>
                                        <p className="text-sm text-white/40">{phaseModal === 'presentation' ? 'Certifique-se que o deck foi apresentado' : phaseModal === 'budget' ? 'Confirme se o orçamento foi aprovado' : 'Valide a assinatura do contrato'}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {(phaseModal === 'presentation' || phaseModal === 'contract') && (
                                        <div className="space-y-2.5">
                                            <label className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black ml-1">Link do Documento (Opcional)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    value={phaseUrl}
                                                    onChange={e => setPhaseUrl(e.target.value)}
                                                    placeholder="https://drive.google.com/..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm font-mono text-white/60"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <button onClick={() => setPhaseModal(null)}
                                            className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                            Cancelar
                                        </button>
                                        <button onClick={handlePhaseComplete} disabled={submitting}
                                            className="flex-[2] bg-white text-black hover:bg-[#E1FD3F] px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/10 disabled:opacity-50 flex items-center gap-3 justify-center transition-all">
                                            <CheckCircle2 className="w-5 h-5" /> Blindar Etapa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
