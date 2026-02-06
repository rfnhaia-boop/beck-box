import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLACK BOX - Sua Biblioteca Digital",
  description: "Acesso exclusivo a contratos, apresentações, vídeo aulas e mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
