import { Metadata } from 'next';
import { Header } from '@/components/ui/Header';
import { FuturisticBackground } from '@/components/ui/Background';
import BlogGrid from './BlogGrid';
import { BLOG_POSTS } from '@/lib/blog-data';

export const metadata: Metadata = { // This is the SEO part requested
    title: "Black Box Blog | Estratégia, Growth e Inteligência Artificial",
    description: "Insights de elite sobre gestão de agências, blindagem jurídica, inteligência artificial e estratégias de crescimento exponencial.",
    openGraph: {
        title: "Black Box Blog | Estratégia, Growth e Inteligência Artificial",
        description: "Acesso exclusivo a estratégias validadas para agências de alta performance.",
        type: 'website',
        locale: 'pt_BR',
        url: 'https://blackbox.com.br/blog', // Placeholder URL
        siteName: 'Black Box System',
    },
    twitter: {
        card: "summary_large_image",
        title: "Black Box Blog | Estratégia, Growth e Inteligência Artificial",
        description: "Insights de elite sobre gestão de agências e estratégias de crescimento."
    }
};

export default function BlogPage() {
    return (
        <main className="min-h-screen relative overflow-x-hidden text-[#EFEFEF] bg-[#050505]">
            <FuturisticBackground />
            <Header />

            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                        INSIDER <span className="text-[#E1FD3F]">INTEL</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
                        Relatórios, análises e estratégias direto do campo de batalha.
                        O conhecimento que separa amadores da <span className="text-[#E1FD3F] font-bold">elite</span>.
                    </p>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

                <BlogGrid posts={BLOG_POSTS} />

                {/* Newsletter / CTA Section */}
                <div className="mt-32 p-12 rounded-[32px] border border-white/10 bg-[#0A0A0A] relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-[#E1FD3F]/5 opacity-50 pointer-events-none" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">Mantenha-se no Radar</h3>
                        <p className="text-white/50 mb-8">Receba atualizações estratégicas antes do mercado.</p>
                        <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-3 outline-none focus:border-[#E1FD3F]/50 transition-colors placeholder:text-white/20"
                            />
                            <button className="bg-[#E1FD3F] text-[#050505] font-bold uppercase tracking-widest px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(225,253,63,0.3)]">
                                Inscrever
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-white/20 text-xs font-mono uppercase tracking-widest z-10 relative">
                <p>Copyright © 2026 Black Box System • All Rights Reserved</p>
            </footer>
        </main>
    );
}
