"use client";

import { motion } from "framer-motion";
import {
    FileText, Clock, CheckCircle2, Circle,
    PlayCircle, Loader2, Calendar,
    Presentation, Receipt, FileSignature,
    MessageSquare, Link as LinkIcon, Building2,
    Sparkles, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Phase Indicator ───
function PhaseStep({ icon: Icon, title, complete, index }: {
    icon: any; title: string; complete: boolean; index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`relative group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${complete
                ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                : 'bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
                }`}
        >
            <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${complete ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30 group-hover:text-white/50'
                }`}>
                {complete ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
                        <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                ) : (
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                )}
            </div>
            <div className="relative z-10">
                <p className={`text-sm font-bold transition-colors duration-300 ${complete ? 'text-green-400' : 'text-white/60 group-hover:text-white'}`}>{title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${complete ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                    <p className="text-[10px] uppercase tracking-wider font-medium text-white/30">{complete ? 'Concluído' : 'Pendente'}</p>
                </div>
            </div>
            {/* Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${complete ? 'from-green-500/10 to-transparent' : 'from-white/5 to-transparent'
                }`} />
        </motion.div>
    );
}

// ─── Status Badge ───
function MilestoneBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: 'bg-white/5 border-white/10 text-white/40',
        in_progress: 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
        complete: 'bg-green-500/10 border-green-500/20 text-green-400',
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

export default function ClientDashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const res = await fetch("/api/client/dashboard");
            if (res.ok) {
                setData(await res.json());
            } else {
                const err = await res.json();
                setError(err.error || "Erro ao carregar");
            }
            setLoading(false);
        }
        load();
    }, [router, supabase]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#050505]">
                <Loader2 className="w-8 h-8 text-[#E1FD3F] animate-spin" />
            </main>
        );
    }

    if (error || !data) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#050505] text-white/40 text-sm">
                {error || "Sem dados disponíveis"}
            </main>
        );
    }

    const t = data.tenant;
    const completedMilestones = data.milestones.filter((m: any) => m.status === 'complete').length;
    const totalMilestones = data.milestones.length;
    const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const phasesComplete = [t.phase_presentation, t.phase_budget, t.phase_contract].filter((p: string) => p === 'complete').length;
    const allPhasesComplete = phasesComplete === 3;
    const activeMilestone = data.milestones.find((m: any) => m.status === 'in_progress');

    return (
        <main className="min-h-screen bg-[#050505] text-[#EFEFEF] selection:bg-[#E1FD3F]/30 overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 sticky top-0">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-[#E1FD3F] to-[#A855F7] rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-500" />
                                <div className="relative w-14 h-14 rounded-[14px] bg-[#0A0A0A] flex items-center justify-center border border-white/10 overflow-hidden">
                                    {t.logo_url ? (
                                        <img src={t.logo_url} alt={t.name} className="w-10 h-10 object-contain" />
                                    ) : (
                                        <span className="text-xl font-black italic bg-gradient-to-br from-[#E1FD3F] to-white bg-clip-text text-transparent">
                                            {t.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-white mb-0.5">{t.name}</h1>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E1FD3F] animate-pulse" />
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Painel do Projeto</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    router.push("/login");
                                    router.refresh();
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                <PlayCircle className="w-3.5 h-3.5 rotate-180" />
                                Sair do Bunker
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">

                {/* ═══ ACTIVE MILESTONE BANNER ═══ */}
                {activeMilestone && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative overflow-hidden p-6 rounded-[24px] bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="relative ml-2">
                                    <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                                    <PlayCircle className="relative w-10 h-10 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Status Atual</p>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{activeMilestone.title}</h3>
                                    <p className="text-sm text-blue-200/60 mt-1">O time está focado nesta etapa agora.</p>
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                                    Em Andamento
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══ PROGRESS + DOCS ROW ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Progress Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 relative overflow-hidden bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center group hover:border-white/10 transition-colors duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                        {/* Circular Progress */}
                        <div className="relative w-48 h-48 mb-6 group-hover:scale-105 transition-transform duration-500 ease-out">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#E1FD3F]/10 to-green-500/10 blur-2xl rounded-full" />

                            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                                <motion.circle
                                    cx="60" cy="60" r="52" fill="none"
                                    stroke="url(#progressGrad)" strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 52}`}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - progressPercent / 100) }}
                                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <defs>
                                    <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#E1FD3F" />
                                        <stop offset="100%" stopColor="#22C55E" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black tracking-tighter text-white">{progressPercent}%</span>
                                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Concluído</span>
                            </div>
                        </div>
                        <div className="text-center relative z-10">
                            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                                <p className="text-xs font-bold text-white/60">
                                    {completedMilestones} de {totalMilestones} etapas finalizadas
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Documentation Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-white/10 transition-colors duration-500"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#E1FD3F]">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Documentação</h2>
                                    <p className="text-xs text-white/40">Arquivos essenciais do projeto</p>
                                </div>
                            </div>

                            {allPhasesComplete && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Tudo Pronto</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                            <PhaseStep icon={Presentation} title="Apresentação" complete={t.phase_presentation === 'complete'} index={0} />
                            <PhaseStep icon={Receipt} title="Orçamento" complete={t.phase_budget === 'complete'} index={1} />
                            <PhaseStep icon={FileSignature} title="Contrato" complete={t.phase_contract === 'complete'} index={2} />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ═══ MILESTONES ═══ */}
                    {data.milestones.length > 0 && (
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 text-[#E1FD3F]">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Cronograma</h2>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 lg:p-8"
                            >
                                <div className="relative space-y-8 before:absolute before:inset-y-4 before:left-[27px] before:w-[2px] before:bg-gradient-to-b before:from-white/5 before:via-white/10 before:to-transparent">
                                    {data.milestones.map((m: any, i: number) => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                            className="relative flex gap-6 group"
                                        >
                                            {/* Timestamp / Visual Node */}
                                            <div className="relative z-10 flex-shrink-0 mt-1">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${m.status === 'complete'
                                                    ? 'bg-[#0A0A0A] border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                                                    : m.status === 'in_progress'
                                                        ? 'bg-[#0A0A0A] border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                                        : 'bg-[#0A0A0A] border-white/10 group-hover:border-white/20'
                                                    }`}>
                                                    {m.status === 'complete' ? (
                                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                                    ) : m.status === 'in_progress' ? (
                                                        <PlayCircle className="w-6 h-6 text-blue-400" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-white/20">{i + 1}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pt-2 pb-6 border-b border-white/5 last:border-0 group-hover:border-white/10 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className={`text-base font-bold transition-colors ${m.status === 'complete' ? 'text-white/40 line-through'
                                                            : m.status === 'in_progress' ? 'text-blue-200'
                                                                : 'text-white group-hover:text-[#E1FD3F]'
                                                            }`}>
                                                            {m.title}
                                                        </h4>
                                                        {m.description && (
                                                            <p className="text-sm text-white/40 mt-1 line-clamp-2">{m.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-3 mt-3">
                                                            {m.due_date && (
                                                                <div className="flex items-center gap-1.5 text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-md">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(m.due_date).toLocaleDateString()}
                                                                </div>
                                                            )}
                                                            <MilestoneBadge status={m.status || 'pending'} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* ═══ SIDEBAR: DOCUMENTS & UPDATES ═══ */}
                    <div className="space-y-6">

                        {/* Documents List */}
                        {data.documents.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 lg:p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-white/5 text-[#E1FD3F]">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Arquivos</h2>
                                </div>
                                <div className="space-y-3">
                                    {data.documents.map((d: any) => (
                                        <a key={d.id} href={d.url} target="_blank" rel="noopener"
                                            className="relative group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                                            <div className="mt-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 group-hover:text-[#E1FD3F] group-hover:scale-110 transition-all duration-300">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors truncate">{d.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/20 bg-white/5 px-1.5 py-0.5 rounded">PDF</span>
                                                    <p className="text-[10px] text-white/30 font-mono truncate">Clique para visualizar</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-[#E1FD3F] group-hover:translate-x-1 transition-all duration-300" />
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Updates List */}
                        {data.updates.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 lg:p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-white/5 text-[#E1FD3F]">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Atualizações</h2>
                                </div>

                                <div className="space-y-4">
                                    {data.updates.map((u: any, i: number) => (
                                        <motion.div
                                            key={u.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.05 }}
                                            className="relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20 bg-black/40 px-2 py-1 rounded-full border border-white/5">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </div>
                                            <h4 className="text-sm font-bold text-white pr-20 mb-2">{u.title}</h4>
                                            <p className="text-xs text-white/50 leading-relaxed">{u.body}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center py-12">
                    <div className="inline-flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-default">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-[#E1FD3F] to-green-500" />
                        <p className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">
                            Powered by BLECK BOX
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
