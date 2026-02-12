"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, Plus, Users, LayoutDashboard,
    FileText, Search, Filter, MoreVertical,
    Mail, ExternalLink, Shield, AlertCircle,
    Loader2, CheckCircle2, XCircle, ArrowRight,
    Zap, Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompaniesPage() {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState<any[]>([]);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        cnpj: "",
        email: "",
        password: "",
        budgetIds: [] as string[]
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [companiesRes, { data: budgetsData }] = await Promise.all([
                fetch("/api/owner/companies"),
                supabase.from("budgets").select("*").in("status", ["criado", "em_andamento"])
            ]);

            setBudgets(budgetsData || []);

            if (companiesRes.ok) {
                const data = await companiesRes.json();
                setCompanies(data.companies || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateCompany(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/owner/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsCreateModalOpen(false);
                setFormData({ name: "", cnpj: "", email: "", password: "", budgetIds: [] });
                fetchData();
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Erro ao criar empresa");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    const toggleBudgetSelected = (id: string) => {
        setFormData(prev => ({
            ...prev,
            budgetIds: prev.budgetIds.includes(id)
                ? prev.budgetIds.filter(bid => bid !== id)
                : [...prev.budgetIds, id]
        }));
    };

    return (
        <main className="min-h-screen relative text-[#EFEFEF] overflow-x-hidden bg-[#050505]">
            <FuturisticBackground />
            <Header />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black tracking-tight text-white mb-2"
                        >
                            Empresas <span className="text-[#E1FD3F]">Contratadas</span>
                        </motion.h1>
                        <p className="text-white/40 text-sm max-w-xl">
                            Gerencie seus tenants, crie acessos para clientes e vincule orçamentos aprovados.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-[#E1FD3F] text-[#050505] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(225,253,63,0.2)]"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Empresa
                    </motion.button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#E1FD3F] animate-spin" />
                    </div>
                ) : companies.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center flex flex-col items-center gap-6"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-white/20" />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-xl font-bold text-white mb-2">Nenhuma empresa encontrada</h3>
                            <p className="text-white/40 text-sm">
                                Comece criando sua primeira empresa contratada para gerenciar projetos e acessos de clientes de forma isolada.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-[#E1FD3F] font-bold uppercase tracking-widest text-xs hover:underline"
                        >
                            Criar primeira empresa
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company, i) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 hover:border-[#E1FD3F]/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 bg-[#E1FD3F]/10 rounded-2xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-[#E1FD3F]" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${company.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {company.status}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{company.name}</h3>
                                {company.cnpj && <p className="text-white/30 text-xs mb-4">CNPJ: {company.cnpj}</p>}

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <Users className="w-4 h-4 text-white/20" />
                                        <span>{company.company_users?.length || 0} Usuários</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <FileText className="w-4 h-4 text-white/20" />
                                        <span>{company.company_contracts?.length || 0} Contratos Ativos</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <Link
                                        href={`/sede/companies/${company.id}`}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center"
                                    >
                                        Detalhes
                                    </Link>
                                    <button className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white/30 hover:text-white transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Company Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                                <h2 className="text-2xl font-bold text-white">Nova Empresa Contratada</h2>
                                <p className="text-white/40 text-sm">Preencha os dados e configure o acesso inicial do cliente.</p>
                            </div>

                            <form onSubmit={handleCreateCompany} className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Nome da Empresa</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm"
                                            placeholder="Ex: ACME Corporation"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">CNPJ (Opcional)</label>
                                        <input
                                            value={formData.cnpj}
                                            onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm"
                                            placeholder="00.000.000/0000-00"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-[#E1FD3F]" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest">Acesso do Cliente (Admin)</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Email</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm"
                                                placeholder="cliente@email.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Senha Inicial</label>
                                            <input
                                                required
                                                type="password"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#E1FD3F]/50 transition-all text-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-[#E1FD3F]" />
                                            <h3 className="text-sm font-bold uppercase tracking-widest">Vincular Orçamentos</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{budgets.length} Disponíveis</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {budgets.map(budget => (
                                            <div
                                                key={budget.id}
                                                onClick={() => toggleBudgetSelected(budget.id)}
                                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.budgetIds.includes(budget.id)
                                                    ? 'bg-[#E1FD3F]/10 border-[#E1FD3F]/50'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white">{budget.company_name}</span>
                                                    <span className="text-[10px] text-white/40 uppercase font-mono">{budget.project_type}</span>
                                                </div>
                                                {formData.budgetIds.includes(budget.id) && <CheckCircle2 className="w-4 h-4 text-[#E1FD3F]" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-xl border border-white/10 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] bg-[#E1FD3F] text-[#050505] px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(225,253,63,0.3)] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            <>
                                                Finalizar e Criar <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
