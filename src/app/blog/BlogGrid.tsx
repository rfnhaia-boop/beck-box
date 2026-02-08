"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";
import { ArrowRight, Calendar, User } from "lucide-react";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-[#E1FD3F]/50 transition-colors flex flex-col h-full"
                >
                    {/* Image */}
                    <Link href={`/blog/${post.slug}`} className="block h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[#E1FD3F]/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-white/40 mb-4 font-mono uppercase tracking-widest">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.date).toLocaleDateString("pt-BR")}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="flex items-center gap-1.5">
                                <User className="w-3 h-3" />
                                {post.author.name}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#E1FD3F] transition-colors line-clamp-2">
                            <Link href={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h2>

                        <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3">
                            {post.excerpt}
                        </p>

                        <div className="mt-auto">
                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-flex items-center gap-2 text-[#E1FD3F] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all"
                            >
                                Ler Artigo <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.article>
            ))}
        </div>
    );
}
