import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Dev Academy | Terminal",
  description: "Plataforma de cursos para programadores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-mono antialiased transition-colors duration-300" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
            {children}
          </main>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}