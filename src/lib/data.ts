export interface Product {
    id: string;
    title: string;
    description: string;
    icon: "file-text" | "presentation" | "video" | "download" | "grid" | "bot" | "zap";
    color: string;
    thumbnail?: string;
    link?: string;
}

export const PRODUCTS: Product[] = [
    {
        id: "adao",
        title: "Adão IA",
        description: "Sua inteligência artificial pessoal. Converse e tire suas dúvidas.",
        icon: "bot",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
        link: "/adao"
    },
    {
        id: "automations",
        title: "Automações n8n",
        description: "Gerencie e execute seus workflows de automação.",
        icon: "zap",
        color: "text-[#E1FD3F] bg-[#E1FD3F]/10",
        thumbnail: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1000&auto=format&fit=crop",
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
        thumbnail: "/apresentacao-30k-preview.png"
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
        description: "Acesse a biblioteca completa",
        icon: "grid",
        color: "text-white/40 bg-white/5",
        link: "/library"
    }
];
