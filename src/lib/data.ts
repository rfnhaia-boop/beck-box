export interface Lesson {
    id: string;
    title: string;
    duration?: string;
    videoUrl?: string;
    summary?: string;
    objectives?: string[];
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Product {
    id: string;
    title: string;
    description: string;
    icon: "file-text" | "presentation" | "video" | "download" | "grid" | "bot" | "zap";
    color: string;
    thumbnail?: string;
    link?: string;
    eliteOnly?: boolean;
    modules?: Module[];
}

export const PRODUCTS: Product[] = [
    {
        id: "adao",
        title: "Adão IA",
        description: "Sua inteligência artificial pessoal. Converse e tire suas dúvidas.",
        icon: "bot",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
        link: "/adao",
        eliteOnly: false
    },
    {
        id: "antigravity",
        title: "Anti-Gravity",
        description: "Dashboard avançado de performance e métricas em tempo real.",
        icon: "zap",
        color: "text-[#A855F7] bg-[#A855F7]/10",
        thumbnail: "https://images.unsplash.com/photo-1639322537231-2f206e06af84?q=80&w=1000&auto=format&fit=crop",
        eliteOnly: true
    },
    {
        id: "management",
        title: "Gestão 360",
        description: "Controle total de operações, equipes e automações.",
        icon: "grid",
        color: "text-[#A855F7] bg-[#A855F7]/10",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
        eliteOnly: true
    },
    {
        id: "companies",
        title: "Empresas",
        description: "Gestão de empresas contratadas e multi-tenancy.",
        icon: "zap",
        color: "text-[#A855F7] bg-[#A855F7]/10",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
        link: "/sede/companies",
        eliteOnly: false
    },
    {
        id: "automations",
        title: "Orçamento Digital",
        description: "Crie, gerencie e envie propostas comerciais profissionais.",
        icon: "file-text",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop",
        link: "/automations"
    },
    {
        id: "1",
        title: "Contratos",
        description: "Modelos jurídicos prontos para uso comercial e pessoal.",
        icon: "file-text",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "/contratos-preview.png"
    },
    {
        id: "2",
        title: "Apresentação 30K",
        description: "Slides profissionais e templates editáveis.",
        icon: "presentation",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "/apresentacao-30k-preview.png",
        modules: [
            {
                id: "m1",
                title: "Módulo 01 - Introdução",
                lessons: [
                    {
                        id: "l1",
                        title: "Introdução",
                        duration: "5:30",
                        summary: "Introdução ao curso de marketing com IA da Adapta; Três objetivos principais do curso; Definição simplificada de marketing; Importância de adaptar os princípios aprendidos para diferentes contextos.",
                        objectives: [
                            "O primeiro objetivo é incentivar o uso diário de IAs no marketing e em outras áreas da vida",
                            "O segundo objetivo é criar um \"Efeito Bola de Neve\" no uso do Adapta One",
                            "O terceiro objetivo é ajudar a obter resultados interessantes"
                        ]
                    },
                    { id: "l2", title: "As 6 \"leis\" para usar bem as IAs", duration: "12:15" },
                    { id: "l3", title: "A estrutura do marketing efetivo com IA", duration: "08:45" }
                ]
            },
            {
                id: "m2",
                title: "Módulo 02 - Ter ideias",
                lessons: [
                    { id: "l4", title: "Brainstorming com Adão", duration: "10:20" },
                    { id: "l5", title: "Validação de nichos", duration: "15:10" }
                ]
            },
            {
                id: "m3",
                title: "Módulo 03 - Criar",
                lessons: [
                    { id: "l6", title: "Copywriting de Elite", duration: "20:00" }
                ]
            }
        ]
    },
    {
        id: "3",
        title: "Vídeo Aula",
        description: "Tutoriais exclusivos e masterclasses.",
        icon: "video",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "https://images.unsplash.com/photo-1492619856354-7d9ca80b6665?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "4",
        title: "Downloads",
        description: "Arquivos diversos, scripts e assets.",
        icon: "download",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "all",
        title: "Ver todos",
        description: "Acesse o bunker completo",
        icon: "grid",
        color: "text-white/40 bg-white/5",
        link: "/library"
    }
];
