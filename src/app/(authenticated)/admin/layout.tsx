import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-6 max-w-[960px]">{children}</div>
    </div>
  );
}
