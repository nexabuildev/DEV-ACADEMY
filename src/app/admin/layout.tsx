import AdminSidebar from "@/components/AdminSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Verificamos si es ADMIN
  if (session?.user?.role !== "ADMIN") {
    redirect("/"); // Si no es admin, fuera
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50/10 dark:bg-black/40">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-8 lg:p-12">
           {children}
        </div>
      </div>
    </div>
  );
}
