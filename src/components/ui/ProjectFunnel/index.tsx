"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Target, Zap, FileText, ChevronRight } from "lucide-react";

interface FunnelProps {
    milestones: any[];
    contracts: any[];
}

export const ProjectFunnel = ({ milestones, contracts }: FunnelProps) => {
    // Derived stats
    const completedMilestones = milestones.filter(m => m.completed_at).length;
    const totalMilestones = milestones.length;
    const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const stages = [
        {
            id: 1,
            title: "Início do Projeto",
            icon: Target,
            color: "text-[#E1FD3F]",
            items: [
                { label: "Escopo Aprovado", status: contracts.length > 0 ? "DONE" : "PENDING" },
                { label: "Contrato Vinculado", status: contracts.length > 0 ? "DONE" : "PENDING" },
                { label: "Briefing Recebido", status: milestones.length > 0 ? "DONE" : "PENDING" }
            ]
        },
        {
            id: 2,
            title: "Andamento",
            icon: Zap,
            color: "text-[#A855F7]",
            items: [
                { label: "Entregas do Período", value: `${completedMilestones} concluídas` },
                { label: "Fase Atual", value: progressPercent < 100 ? "Desenvolvimento" : "Finalizado" },
                { label: "Próximo Marco", value: milestones.find(m => !m.completed_at)?.title || "Nenhum" }
            ]
        },
        {
            id: 3,
            title: "Expectativas & Métricas",
            icon: Target,
            color: "text-[#E1FD3F]",
            items: [
                { label: "Progresso Total", value: `${progressPercent}%` },
                { label: "Indicador de Saúde", value: "Excelente", status: "DONE" },
                { label: "Tempo Estimado", value: "Em cronograma" }
            ]
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stages.map((stage, i) => (
                <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all"
                >
                    {/* Background Glow */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-10 rounded-full transition-all group-hover:opacity-20 ${stage.id === 2 ? 'bg-[#A855F7]' : 'bg-[#E1FD3F]'}`} />

                    <div className="flex items-center gap-4 mb-8">
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stage.color}`}>
                            <stage.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Etapa {stage.id}</span>
                            <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        {stage.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group/item">
                                <div className="flex items-center gap-3">
                                    {item.status === "DONE" ? (
                                        <CheckCircle2 className="w-4 h-4 text-[#E1FD3F]" />
                                    ) : item.status === "PENDING" ? (
                                        <Circle className="w-4 h-4 text-white/10" />
                                    ) : (
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                    )}
                                    <span className="text-sm text-white/60 group-hover/item:text-white transition-colors">{item.label}</span>
                                </div>
                                {item.value && (
                                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 ${stage.color}`}>
                                        {item.value}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Stage Connector (desktop only) */}
                    {i < 2 && (
                        <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                            <ChevronRight className="w-6 h-6 text-white/10" />
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};
