"use client";

import { FuturisticBackground } from "@/components/ui/Background";
import { Header } from "@/components/ui/Header";
import { LogoBanner } from "@/components/ui/LogoBanner";
import { Sparkles, CheckCircle2, Shield, Lock, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// --- Components for Bento Grid ---
const BentoItem = ({ title, description, icon: Icon, className, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md p-8 hover:border-[#E1FD3F]/30 transition-colors ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-4 w-12 h-12 rounded-xl bg-[#E1FD3F]/10 flex items-center justify-center text-[#E1FD3F]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// --- Page Component ---
export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#050505] text-[#EFEFEF]">
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
          O SEU BUKER <br />
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
            className="md:col-span-2"
            delay={0.3}
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto relative group"
        >
          {/* Border Beam Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#E1FD3F] via-[#007AFF] to-[#E1FD3F] rounded-[32px] opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />

          <div className="relative bg-[#0A0A0A] rounded-[30px] p-12 border border-white/10 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-8">
              LOTE DE LANÇAMENTO
            </div>

            <div className="flex items-baseline justify-center gap-2 mb-6 text-white">
              <span className="text-2xl text-white/40 line-through">R$ 597</span>
              <span className="text-7xl font-black tracking-tighter">R$ 97</span>
            </div>

            <p className="text-white/50 mb-10">Pagamento único. Acesso vitalício ao Black Box.</p>

            <ul className="space-y-4 text-left mb-10">
              {["Acesso Vitalício a todos os produtos", "Atualizações Mensais Gratuitas", "Comunidade VIP", "Suporte Prioritário"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-[#E1FD3F]" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="w-full py-5 rounded-xl bg-[#E1FD3F] text-[#050505] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(225,253,63,0.3)]">
              Desbloquear Agora
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
              <Lock className="w-3 h-3" /> Pagamento Seguro & Criptografado
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-white/20 text-xs font-mono uppercase tracking-widest">
        <p>Copyright © 2026 Black Box System • All Rights Reserved</p>
      </footer>
    </main>
  );
}
