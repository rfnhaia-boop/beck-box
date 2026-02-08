"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import {
    Check, Loader2, User, Building2,
    Camera, Trash2, Save, ArrowLeft, Shield, FileText, CreditCard, LifeBuoy
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
    id: string;
    logo_url: string | null;
    company_name: string | null;
    updated_at: string;
}

type Tab = "profile" | "subscription" | "terms" | "privacy" | "support";

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [companyName, setCompanyName] = useState("");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }
        setUser(user);

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profile) {
            setProfile(profile);
            setCompanyName(profile.company_name || user.user_metadata?.company_name || "");
            setLogoUrl(profile.logo_url);
            setLogoPreview(profile.logo_url);
        } else {
            setCompanyName(user.user_metadata?.company_name || "");
        }
        setLoading(false);
    };

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Por favor, selecione uma imagem" });
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: "error", text: "A imagem deve ter no máximo 2MB" });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}/logo.${fileExt}`;

            if (logoUrl) {
                const oldPath = logoUrl.split("/logos/")[1];
                if (oldPath) await supabase.storage.from("logos").remove([oldPath]);
            }

            const { error: uploadError } = await supabase.storage
                .from("logos")
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("logos")
                .getPublicUrl(fileName);

            setLogoUrl(publicUrl);
            setMessage({ type: "success", text: "Logo carregado com sucesso!" });
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Erro ao fazer upload do logo" });
            setLogoPreview(logoUrl);
        }
        setUploading(false);
    };

    const handleRemoveLogo = async () => {
        if (!logoUrl || !user) return;

        setUploading(true);
        try {
            const path = logoUrl.split("/logos/")[1];
            if (path) await supabase.storage.from("logos").remove([path]);
            setLogoUrl(null);
            setLogoPreview(null);
            setMessage({ type: "success", text: "Logo removido" });
        } catch (error) {
            setMessage({ type: "error", text: "Erro ao remover logo" });
        }
        setUploading(false);
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);

        try {
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    logo_url: logoUrl,
                    company_name: companyName,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            await supabase.auth.updateUser({
                data: { company_name: companyName }
            });

            setMessage({ type: "success", text: "Perfil salvo com sucesso!" });
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Erro ao salvar perfil" });
        }
        setSaving(false);
    };

    const tabs = [
        { id: "profile", label: "Perfil & Marca", icon: User },
        { id: "subscription", label: "Assinatura", icon: CreditCard },
        { id: "terms", label: "Termos de Uso", icon: FileText },
        { id: "privacy", label: "Privacidade e Dados", icon: Shield },
        { id: "support", label: "Falar com Suporte", icon: LifeBuoy },
    ];

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#050505]">
                <Loader2 className="w-8 h-8 text-[#E1FD3F] animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen relative text-[#EFEFEF] overflow-x-hidden bg-[#050505]">
            <FuturisticBackground />
            <Header />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                <div className="inline-block mb-8">
                    <Link href="/sede" className="flex items-center gap-2 text-white/40 hover:text-[#E1FD3F] transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4" /> Voltar para Sede
                    </Link>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Legal Center</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
                    {/* Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-wide
                                          ${activeTab === tab.id
                                        ? "bg-[#E1FD3F] text-[#050505] shadow-[0_0_20px_rgba(225,253,63,0.3)] scale-105"
                                        : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}

                        <div className="mt-auto pt-8">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-xs text-white/40 mb-2">Dúvidas sobre seus dados?</p>
                                <button className="w-full py-2 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors">
                                    Falar com DPO
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 rounded-[32px] bg-[#0A0A0A] border border-white/10 p-8 md:p-12 relative overflow-hidden min-h-[600px]">
                        {/* Content Background Glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1FD3F]/5 rounded-full blur-[100px] pointer-events-none" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                {activeTab === "profile" && (
                                    <div className="max-w-xl">
                                        <h2 className="text-3xl font-black text-white mb-2">Perfil & Marca</h2>
                                        <p className="text-white/50 mb-8 leading-relaxed">Gerencie a identidade visual da sua empresa dentro do ecossistema Black Box.</p>

                                        {/* Logo Upload Section */}
                                        <div className="mb-10">
                                            <label className="block text-sm font-bold text-white/70 mb-4">Sua Logo</label>
                                            <div className="flex items-center gap-6">
                                                <div
                                                    className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#E1FD3F] flex items-center justify-center overflow-hidden cursor-pointer group shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    {loading || uploading ? (
                                                        <Loader2 className="w-8 h-8 text-[#050505] animate-spin" />
                                                    ) : logoPreview ? (
                                                        <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                                                    ) : (
                                                        <User className="w-10 h-10 text-[#050505]" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Camera className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-5 py-2.5 rounded-xl bg-[#A855F7] text-white font-bold text-sm hover:bg-[#9333EA] transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                                            {logoPreview ? "Trocar Logo" : "Fazer Upload"}
                                                        </button>
                                                        {logoPreview && (
                                                            <button onClick={handleRemoveLogo} disabled={uploading} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-white/30 mt-2">Recomendado: 500x500px (PNG/SVG)</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Company Name */}
                                        <div className="mb-10">
                                            <label className="block text-sm font-bold text-white/70 mb-2">Nome da Empresa</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                                <input
                                                    type="text"
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    placeholder="Digite o nome da sua empresa"
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-[#E1FD3F]/50 focus:bg-white/10 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Feedback Message */}
                                        <AnimatePresence>
                                            {message && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 overflow-hidden ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                                                >
                                                    {message.type === "success" ? <Check className="w-5 h-5 flex-shrink-0" /> : <Shield className="w-5 h-5 flex-shrink-0" />}
                                                    <span className="text-sm font-bold">{message.text}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#E1FD3F] text-[#050505] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(225,253,63,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            {saving ? "Salvando Alterações..." : "Salvar Alterações"}
                                        </button>
                                    </div>
                                )}

                                {activeTab === "subscription" && (
                                    <div>
                                        <h2 className="text-3xl font-black text-white mb-2">Sua Assinatura</h2>
                                        <p className="text-white/50 mb-8">Detalhes do seu plano atual.</p>

                                        <div className="p-8 rounded-2xl bg-[#E1FD3F]/5 border border-[#E1FD3F]/20 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                                <User className="w-24 h-24 text-[#E1FD3F]/20" />
                                            </div>
                                            <p className="text-[#E1FD3F] font-black uppercase tracking-widest mb-1">Plano Atual</p>
                                            <h3 className="text-4xl font-black text-white mb-4">
                                                {user?.user_metadata?.plan === 'elite' ? 'ELITE MEMBER' : 'STANDARD ACCESS'}
                                            </h3>
                                            <p className="text-white/60 text-sm max-w-sm mb-6">
                                                {user?.user_metadata?.plan === 'elite'
                                                    ? "Você tem acesso irrestrito a todas as ferramentas, conteúdos e suporte prioritário."
                                                    : "Acesso básico ao sistema. Faça o upgrade para desbloquear todo o potencial."}
                                            </p>
                                            <button className="px-6 py-2 rounded-lg bg-[#E1FD3F] text-[#050505] font-bold text-sm hover:bg-[#d4ee3b] transition-colors">
                                                Gerenciar Pagamento
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "terms" && (
                                    <div className="prose prose-invert prose-p:text-white/60 prose-headings:text-white max-w-none">
                                        <h2 className="text-3xl font-black mb-8">Termos de Uso</h2>
                                        <h3>1. Aceitação dos Termos</h3>
                                        <p>Ao acessar nosso site e utilizar nossos serviços, você concorda integralmente com estes Termos de Uso. Se não concordar, por favor, não utilize nossos serviços.</p>
                                        <h3>2. Licença de Uso</h3>
                                        <p>Concedemos a você uma licença limitada, não exclusiva e intransferível para utilizar nosso software conforme o plano contratado.</p>
                                        <h3>3. Responsabilidades</h3>
                                        <p>Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.</p>
                                    </div>
                                )}

                                {activeTab === "privacy" && (
                                    <div className="prose prose-invert prose-p:text-white/60 prose-headings:text-white max-w-none">
                                        <h2 className="text-3xl font-black mb-8">Privacidade e Dados</h2>
                                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-8">
                                            <div className="flex items-center gap-4 mb-4">
                                                <Shield className="w-8 h-8 text-green-400" />
                                                <div>
                                                    <h4 className="text-lg font-bold text-white m-0">Seus dados estão protegidos</h4>
                                                    <p className="text-sm text-white/40 m-0">Utilizamos criptografia de ponta a ponta.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <h3>Coleta de Dados</h3>
                                        <p>Coletamos apenas as informações necessárias para fornecer nossos serviços e melhorar sua experiência.</p>
                                        <h3>Uso de Informações</h3>
                                        <p>Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins de marketing sem seu consentimento explícito.</p>
                                    </div>
                                )}

                                {activeTab === "support" && (
                                    <div>
                                        <h2 className="text-3xl font-black text-white mb-2">Central de Suporte</h2>
                                        <p className="text-white/50 mb-8">Precisando de ajuda? Nossa equipe está pronta.</p>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <a href="#" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E1FD3F]/50 hover:bg-white/10 transition-all group">
                                                <LifeBuoy className="w-8 h-8 text-[#E1FD3F] mb-4 group-hover:scale-110 transition-transform" />
                                                <h3 className="text-lg font-bold text-white mb-2">Chat Online</h3>
                                                <p className="text-sm text-white/40">Fale com um especialista em tempo real.</p>
                                            </a>
                                            <a href="#" className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E1FD3F]/50 hover:bg-white/10 transition-all group">
                                                <FileText className="w-8 h-8 text-[#A855F7] mb-4 group-hover:scale-110 transition-transform" />
                                                <h3 className="text-lg font-bold text-white mb-2">Documentação</h3>
                                                <p className="text-sm text-white/40">Guias passo-a-passo e tutoriais.</p>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
