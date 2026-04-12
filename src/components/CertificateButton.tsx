"use client";

import { Award, Download } from "lucide-react";

interface CertificateButtonProps {
  courseTitle: string;
  userName: string;
  date: string;
}

export default function CertificateButton({ courseTitle, userName, date }: CertificateButtonProps) {
  const handleDownload = () => {
    // Para una versión premium, usaríamos una librería de PDF.
    // Para esta demo, usaremos el motor de impresión del navegador con un layout optimizado.
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificado - ${courseTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
            body { 
              margin: 0; 
              padding: 0; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              background: #000;
              font-family: 'Inter', sans-serif;
              color: white;
            }
            .certificate {
              width: 800px;
              height: 550px;
              padding: 60px;
              border: 10px solid #1d4ed8;
              background: linear-gradient(135deg, #09090b 0%, #18181b 100%);
              text-align: center;
              position: relative;
              box-shadow: 0 0 50px rgba(29, 78, 216, 0.3);
            }
            .logo { font-weight: 900; font-size: 24px; color: #3b82f6; letter-spacing: -1px; margin-bottom: 40px; }
            .title { font-size: 14px; text-transform: uppercase; letter-spacing: 5px; color: #71717a; margin-bottom: 20px; }
            .name { font-size: 48px; font-weight: 900; margin-bottom: 20px; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .text { font-size: 18px; color: #a1a1aa; line-height: 1.6; max-width: 500px; margin: 0 auto 40px; }
            .course { font-size: 24px; font-weight: 700; color: #fff; display: block; margin-top: 10px; }
            .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; }
            .signature { border-top: 1px solid #3f3f46; padding-top: 10px; width: 200px; font-size: 12px; color: #71717a; }
            .date { font-size: 12px; color: #71717a; }
            @media print {
              body { background: white; color: black; }
              .certificate { border-color: black; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="logo">DEVACADEMY.</div>
            <div class="title">CERTIFICADO DE COMPLETADO</div>
            <div class="text">Este documento certifica que</div>
            <div class="name">${userName}</div>
            <div class="text">ha superado con éxito todos los desafíos del curso: <span class="course">${courseTitle}</span></div>
            
            <div class="footer">
              <div class="date">Emitido el ${date}</div>
              <div class="signature">Sello de Autenticidad DevAcademy</div>
            </div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]"
    >
      <Award className="w-4 h-4" />
      Descargar Certificado
      <Download className="w-4 h-4 ml-1" />
    </button>
  );
}
