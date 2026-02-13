"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { LogoBanner } from "@/components/ui/LogoBanner";
import { Footer } from "@/components/ui/Footer";
import { Sparkles, CheckCircle2, Shield, Lock, ArrowRight, Star, Rocket, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// --- Components for Bento Grid ---
const BentoItem = ({ title, description, icon: Icon, className, delay = 0, purple = false }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md p-8 hover:border-${purple ? "[#A855F7]" : "[#E1FD3F]"}/30 transition-colors ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 flex flex-col h-full">
      <div className={`mb-4 w-12 h-12 rounded-xl ${purple ? "bg-[#A855F7]/10" : "bg-[#E1FD3F]/10"} flex items-center justify-center ${purple ? "text-[#A855F7]" : "text-[#E1FD3F]"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// --- Products Navigator Section ---
const ProductsNavigator = () => {
  const [activeTab, setActiveTab] = useState(0);

  const products = [
    {
      id: "adao",
      name: "Adão IA",
      tagline: "INTELIGÊNCIA COMERCIAL",
      description: "A IA que elimina a sua insegurança nas reuniões e negocia por você. Transforme objeções em contratos assinados.",
      link: "/adao",
      color: "#E1FD3F",
      icon: Zap
    },
    {
      id: "acao",
      name: "Ação 30k",
      tagline: "MÉTODO DE ESCALA",
      description: "O plano de execução brutal. Aulas práticas, contratos jurídicos blindados e a infraestrutura para os seus primeiros 30k.",
      link: "/acao",
      color: "#3B82F6",
      icon: Rocket
    },
    {
      id: "combo",
      name: "Combo Elite",
      tagline: "O ARSENAL COMPLETO",
      description: "Acesso total e vitalício ao Ecossistema Black Box. Leve o Adão IA e o Ação 30k com a maior vantagem comercial.",
      link: "/combo",
      color: "#A855F7",
      icon: Crown
    }
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Tab Selectors */}
      <div className="flex flex-wrap justify-center gap-4">
        {products.map((product, idx) => (
          <button
            key={product.id}
            onClick={() => setActiveTab(idx)}
            className={`relative px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 overflow-hidden border ${activeTab === idx
              ? "bg-white/5 border-white/20 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              : "bg-transparent border-white/5 text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
              }`}
          >
            {activeTab === idx && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
              />
            )}
            <span className="relative z-10">{product.name}</span>
            {activeTab === idx && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: product.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Card */}
      <div className="relative min-h-[500px] flex items-center justify-center">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl rounded-[2.5rem] bg-white/[0.02] border border-white/10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 backdrop-blur-3xl overflow-hidden group"
        >
          {/* Background Accent - Stronger Neon Glow */}
          <div
            className="absolute -top-24 -right-24 p-[300px] blur-[150px] rounded-full opacity-20 pointer-events-none transition-colors duration-700 animate-pulse"
            style={{ backgroundColor: products[activeTab].color }}
          />

          {/* Left Side: Product Info */}
          <div className="flex-1 text-left relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-[10px] font-black tracking-[0.3em] uppercase"
              style={{
                borderColor: `${products[activeTab].color}40`,
                color: products[activeTab].color,
                backgroundColor: `${products[activeTab].color}10`
              }}
            >
              {products[activeTab].tagline}
            </div>
            <h4 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none">
              {products[activeTab].name}
            </h4>
            <p className="text-xl text-white/50 font-medium leading-relaxed mb-10 max-w-xl">
              {products[activeTab].description}
            </p>
            <Link
              href={products[activeTab].link}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl hover:scale-105 active:scale-95"
              style={{
                backgroundColor: products[activeTab].color,
                color: activeTab === 0 ? "#050505" : "#FFFFFF",
                boxShadow: `0 0 40px ${products[activeTab].color}30`
              }}
            >
              Ver Detalhes <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Side: Visual Element */}
          <div className="flex-1 w-full flex justify-center items-center relative z-10">
            <div className="relative w-full aspect-square max-w-[400px]">
              {/* Animated Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed rounded-full opacity-20"
                style={{ borderColor: products[activeTab].color }}
              />
              <div className="absolute inset-8 border border-white/10 rounded-full" />

              {/* Main Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {(() => {
                  const ProductIcon = products[activeTab].icon;
                  return (
                    <>
                      <ProductIcon
                        className="w-32 h-32 opacity-20"
                        style={{ color: products[activeTab].color }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center filter blur-3xl opacity-20">
                        <ProductIcon
                          className="w-48 h-48"
                          style={{ color: products[activeTab].color }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Tech accents - cleaner approach */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Page Component ---
export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (plan: 'standard' | 'elite') => {
    setLoading(plan);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      // Simulate purchase logic by updating user metadata
      const { error } = await supabase.auth.updateUser({
        data: { plan: plan }
      });

      if (error) throw error;

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      console.error("Error updating plan:", err);
      alert("Erro ao processar ativação do plano. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden text-[#EFEFEF]">
      <FuturisticBackground />
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-32 px-6 max-w-7xl mx-auto text-center z-10 min-h-[90vh] flex flex-col items-center justify-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[#E1FD3F] text-xs font-bold uppercase tracking-[0.2em] mb-8"
        >
          <Sparkles className="w-3 h-3" />
          Acesso Vitalício Liberado
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]"
        >
          O SEU BUNKER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">DIGITAL DE ELITE</span>
        </motion.h1>

        {/* Subtitle ROI */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light"
        >
          O custo de um contrato mal feito é R$ 5.000.
          <br className="hidden md:block" />
          O custo da nossa blindagem jurídica e assets premium é <span className="text-[#E1FD3F] font-bold">R$ 97</span>.
        </motion.p>

        {/* CTA Button with Inner Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="#pricing" className="inline-block relative group px-12 py-5 rounded-full bg-[#E1FD3F] text-[#050505] font-black uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(225,253,63,0.3)] overflow-hidden">
            <div className="absolute inset-0 bg-white/40 group-hover:opacity-0 transition-opacity duration-300" />
            <span className="relative flex items-center gap-3">
              Garantir Acesso Agora <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        </motion.div>

        {/* Video Sneak Peek Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 w-full max-w-5xl aspect-video rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden relative shadow-2xl group"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/20 font-mono uppercase tracking-widest text-sm">[ SYSTEM INTERFACE PREVIEW ]</p>
          </div>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        </motion.div>
      </section>

      {/* --- LOGO BANNER --- */}
      <LogoBanner />

      {/* --- PRODUCTS SECTION --- */}
      <section id="products" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[#E1FD3F] tracking-[0.2em] uppercase mb-4">Portfólio</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Escolha sua Arma</h3>
        </div>

        <ProductsNavigator />
      </section>

      {/* --- THE ARSENAL (BENTO GRID) --- */}
      <section id="arsenal" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[#E1FD3F] tracking-[0.2em] uppercase mb-4">The Arsenal</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Tudo que você precisa em um só lugar</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Big Feature - Left */}
          <BentoItem
            title="Contratos Blindados"
            description="Modelos jurídicos prontos para uso. Proteja seu negócio com cláusulas validadas por grandes bancas."
            icon={Shield}
            className="md:col-span-2 bg-gradient-to-br from-[#E1FD3F]/5 to-transparent"
          />

          {/* Feature - Right Top */}
          <BentoItem
            title="Gem AI"
            description="Acesso exclusivo à nossa IA treinada para gerar copys e estratégias."
            icon={Sparkles}
            delay={0.1}
            purple={true}
          />

          {/* Feature - Left Bottom */}
          <BentoItem
            title="Propostas Magnéticas"
            description="Templates de deck comercial com alta taxa de conversão."
            icon={Star}
            delay={0.2}
          />

          {/* Big Feature - Right */}
          <BentoItem
            title="Masterclass & Aulas"
            description="Aprenda a vender, negociar e escalar com quem joga o jogo de verdade."
            icon={CheckCircle2}
            className="md:col-span-2 bg-gradient-to-br from-[#A855F7]/5 to-transparent"
            delay={0.3}
            purple={true}
          />
        </div>
      </section>

      {/* --- SOCIAL PROOF (TERMINAL STYLE) --- */}
      <section className="py-20 bg-black/50 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="font-mono text-xs text-white/30 mb-8 border-b border-white/10 pb-2 flex justify-between">
            <span>&gt; READING_LOGS_FROM_MEMBERS...</span>
            <span>STATUS: VERIFIED</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="flex text-[#E1FD3F] gap-1 text-xs font-mono">
                  <span>★★★★★</span>
                  <span className="text-white/30">USER_ID_{1024 + i}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  "Simplesmente mudou o jogo da minha agência. Os contratos sozinhos já valem 10x o preço da assinatura."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto relative z-10 text-center">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[#E1FD3F] tracking-[0.2em] uppercase mb-4">Escolha seu Acesso</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Planos Vitalícios Black Box</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AÇÃO 30K */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-[2rem] bg-[#0A0A0A] border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors duration-500"
          >
            <div className="p-8 flex flex-col h-full bg-gradient-to-b from-blue-500/5 to-transparent">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Rocket className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-wider">
                  Método
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 text-left">AÇÃO 30K</h3>
              <p className="text-white/40 text-sm text-left mb-8 min-h-[40px]">
                Vídeo aulas, contratos e estruturas validadas.
              </p>

              <div className="flex flex-col items-start mb-8">
                <span className="text-white/20 text-xs font-bold line-through">De R$ 197</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-white">R$ 33</span>
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest">/ Único</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {["Vídeo Aulas Exclusivas", "Método Comprovado", "Contrato Profissional"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase('standard')}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-500 hover:border-blue-500 hover:text-white text-white/60 font-black uppercase tracking-widest transition-all text-xs"
              >
                Acessar Agora
              </button>
            </div>
          </motion.div>

          {/* COMBO BLACK BOX (Highlight) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-[2rem] bg-[#0A0A0A] border border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] scale-105 z-10"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-[#E1FD3F] to-purple-500" />

            <div className="p-8 flex flex-col h-full bg-gradient-to-b from-purple-500/10 to-transparent">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Crown className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E1FD3F] text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                  Recomendado
                </span>
              </div>

              <h3 className="text-3xl font-black text-white mb-2 text-left">COMBO ELITE</h3>
              <p className="text-white/40 text-sm text-left mb-8 min-h-[40px]">
                O arsenal completo. Ação 30k + Adão IA com desconto máximo.
              </p>

              <div className="flex flex-col items-start mb-8">
                <span className="text-white/20 text-xs font-bold line-through">De R$ 497</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter text-white">R$ 66</span>
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest">/ Único</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {["Tudo do Ação 30k", "Tudo do Adão IA", "Grupo de Networking", "Mentoria Mensal"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" /> {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase('elite')}
                className="w-full py-5 rounded-xl bg-purple-500 text-white font-black uppercase tracking-widest hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] text-xs flex items-center justify-center gap-2"
              >
                Quero o Combo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ADÃO IA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative rounded-[2rem] bg-[#0A0A0A] border border-white/10 overflow-hidden hover:border-[#E1FD3F]/50 transition-colors duration-500"
          >
            <div className="p-8 flex flex-col h-full bg-gradient-to-b from-[#E1FD3F]/5 to-transparent">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center text-[#E1FD3F]">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20 text-[10px] font-black text-[#E1FD3F] uppercase tracking-wider">
                  Inteligência
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 text-left">ADÃO IA</h3>
              <p className="text-white/40 text-sm text-left mb-8 min-h-[40px]">
                Sua IA pessoal treinada para vendas e copy.
              </p>

              <div className="flex flex-col items-start mb-8">
                <span className="text-white/20 text-xs font-bold line-through">De R$ 297</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-white">R$ 47</span>
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest">/ Único</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {["IA Treinada em Vendas", "Scripts Prontos", "Suporte Dedicado"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-medium text-white/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E1FD3F]" /> {feat}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase('standard')}
                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#E1FD3F] hover:border-[#E1FD3F] hover:text-black text-white/60 font-black uppercase tracking-widest transition-all text-xs"
              >
                Acessar Agora
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
