import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { FuturisticBackground } from '@/components/ui/Background';
import { BLOG_POSTS } from '@/lib/blog-data';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import Link from 'next/link';

// Helper to get post
function getPost(slug: string) {
    return BLOG_POSTS.find((p) => p.slug === slug);
}

// SEO Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = getPost(params.slug);

    if (!post) {
        return {
            title: 'Post não encontrado | Black Box Blog',
        };
    }

    return {
        title: post.seo.title,
        description: post.seo.description,
        keywords: post.seo.keywords,
        openGraph: {
            title: post.seo.title,
            description: post.seo.description,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author.name],
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
        },
    };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen relative overflow-x-hidden text-[#EFEFEF] bg-[#050505]">
            <FuturisticBackground />
            <Header />

            {/* Back Button */}
            <div className="fixed top-24 left-6 z-20 hidden lg:block">
                <Link
                    href="/blog"
                    className="flex items-center gap-2 text-white/40 hover:text-[#E1FD3F] transition-colors py-2 px-4 rounded-full border border-white/5 hover:border-[#E1FD3F]/20 bg-[#0A0A0A]/50 backdrop-blur-md"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>
            </div>

            <article className="relative pt-40 pb-20 px-6 max-w-4xl mx-auto z-10">
                {/* Header */}
                <header className="text-center mb-16">
                    <div className="flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-widest text-[#E1FD3F] mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-[#E1FD3F]/10 border border-[#E1FD3F]/20">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-8 text-sm text-white/50 border-y border-white/10 py-6 max-w-2xl mx-auto">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                <User className="w-4 h-4" />
                            </span>
                            <div className="text-left leading-tight">
                                <p className="text-white font-bold">{post.author.name}</p>
                                <p className="text-[10px] uppercase tracking-wider">{post.author.role}</p>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString("pt-BR", {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#E1FD3F] prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-blockquote:border-l-[#E1FD3F] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Share / Tags Footer */}
                <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
                    <div className="text-sm text-white/40">
                        Publicado em <span className="text-white">{new Date(post.date).getFullYear()}</span>
                    </div>
                    <button className="flex items-center gap-2 text-[#E1FD3F] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                        <Share2 className="w-4 h-4" /> Compartilhar
                    </button>
                </div>
            </article>

            {/* Read More Section logic could be added here */}

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-white/20 text-xs font-mono uppercase tracking-widest z-10 relative">
                <p>Copyright © 2026 Black Box System • All Rights Reserved</p>
            </footer>
        </main>
    );
}
