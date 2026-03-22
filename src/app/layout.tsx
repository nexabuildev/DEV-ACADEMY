import Navbar from "@/components/Navbar";
import "./globals.css";

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
    <html lang="es">
      <body className="bg-black text-white font-mono antialiased">
        {/* El Navbar fijo arriba */}
        <Navbar />
        
        {/* Aquí está la magia: pt-24 (padding-top) empuja todo el contenido 
            hacia abajo para que el Navbar no lo aplaste */}
        <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}