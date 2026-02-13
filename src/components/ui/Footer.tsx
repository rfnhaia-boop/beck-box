import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-[#050505] py-24 px-8 overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 relative z-10">
                <div className="flex flex-col gap-8 max-w-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E1FD3F] rounded-2xl flex items-center justify-center">
                            <span className="text-black font-black text-2xl">B</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter italic text-white">BLACK BOX</span>
                    </div>
                    <p className="text-white/30 text-base font-medium leading-relaxed">
                        A plataforma definitiva para estrategistas, agências e profissionais
                        que buscam a excelência técnica e comercial no ecossistema digital.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 flex-1">
                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Soluções</span>
                        <nav className="flex flex-col gap-4">
                            <Link href="/adao" className="text-sm font-medium text-white/40 hover:text-[#E1FD3F] transition-colors">Adão IA</Link>
                            <Link href="/acao" className="text-sm font-medium text-white/40 hover:text-[#E1FD3F] transition-colors">Ação 30k</Link>
                            <Link href="/combo" className="text-sm font-medium text-white/40 hover:text-[#E1FD3F] transition-colors">Combo Black Box</Link>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Plataforma</span>
                        <nav className="flex flex-col gap-4">
                            <Link href="/suporte" className="text-sm font-medium text-white/40 hover:text-[#E1FD3F] transition-colors">Suporte</Link>
                            <Link href="/termos" className="text-sm font-medium text-white/40 hover:text-[#E1FD3F] transition-colors">Termos</Link>
                            <Link href="/privacidade" className="text-sm font-medium text-white/40 hover:text-[#E1FD3F] transition-colors">Privacidade</Link>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Sede</span>
                        <p className="text-sm font-medium text-white/40 leading-relaxed">
                            São Paulo, Brasil<br />
                            2024 © Black Box Inc.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <span className="text-[8px] font-mono text-white/10 uppercase tracking-[0.3em]">
                    All rights reserved for strategists only
                </span>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">System status: operational</span>
                    </div>
                </div>
            </div>

            {/* Background Text Shadow */}
            <div className="absolute -bottom-20 -left-10 text-[250px] font-black text-white/[0.02] pointer-events-none select-none italic">
                BLACKBOX
            </div>
        </footer>
    );
};
