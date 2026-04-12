import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Award, ShieldCheck, Calendar } from "lucide-react";
import PrintButton from "@/components/PrintButton";


export default async function CertificatePage(props: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await props.params;
  const session = await auth();
  if (!session) redirect("/login");

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: { lessons: true }
  });

  const completedCount = await db.userProgress.count({
    where: {
      userId: session.user.id,
      isCompleted: true,
      lesson: { courseId: courseId }
    }
  });

  if (!course || completedCount < course.lessons.length) {
    return notFound();
  }

  const completionDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-20 print:bg-white print:p-0">
      
      {/* Botón de Impresión */}
      <PrintButton />

      <div className="relative w-full max-w-5xl aspect-[1.414/1] bg-zinc-950 border-[20px] border-zinc-900 p-16 sm:p-24 flex flex-col items-center justify-between text-center overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] print:border-zinc-200 print:shadow-none print:text-black print:bg-white">
        
        {/* Adornos de fondo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-[120px] -translate-y-1/2 translate-x-1/2 print:hidden" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 blur-[120px] translate-y-1/2 -translate-x-1/2 print:hidden" />

        {/* PARTE SUPERIOR: Logo y Título */}
        <div className="w-full">
          <div className="mb-10">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.2)] print:border print:shadow-none">
              <Award className="w-12 h-12 text-black" />
            </div>
          </div>
          <h1 className="text-zinc-500 font-black tracking-[0.8em] text-[10px] sm:text-xs uppercase mb-4 print:text-zinc-600">
            Certificado de Excelencia Técnica
          </h1>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full print:via-zinc-200" />
        </div>

        {/* PARTE CENTRAL: Nombre y Curso */}
        <div className="flex flex-col gap-6 py-10">
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest print:text-zinc-600">
            Otorgado con distinción a
          </p>
          <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter print:text-black">
            {session.user.name}
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-zinc-400 text-lg leading-relaxed print:text-zinc-700">
              Por demostrar maestría técnica y completar con éxito el programa de alto rendimiento:
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 print:text-black">
              {course.title}
            </h3>
          </div>
        </div>

        {/* PARTE INFERIOR: Validaciones y Firma (Con mucho más espacio) */}
        <div className="w-full pt-12 border-t border-white/5 print:border-zinc-100">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            
            <div className="flex gap-16 text-left">
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-zinc-600 text-[10px] uppercase font-black tracking-widest">
                  <Calendar className="w-3 h-3" /> Emisión
                </span>
                <p className="text-white text-sm font-bold print:text-black">{completionDate}</p>
              </div>
              <div className="space-y-2">
                <span className="flex items-center gap-2 text-zinc-600 text-[10px] uppercase font-black tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> ID Verificación
                </span>
                <p className="text-white font-mono text-[10px] print:text-black">{courseId.substring(0, 8)} - {session.user.id?.substring(0, 8)}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-serif italic text-white text-3xl mb-1 print:text-black">DevAcademy Team</p>
              <div className="h-px bg-white/20 w-48 ml-auto mb-2 print:bg-black" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Elite Education Board</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

