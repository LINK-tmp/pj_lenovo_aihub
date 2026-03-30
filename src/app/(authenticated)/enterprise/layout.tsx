import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "ENTERPRISE") {
    redirect("/login");
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">{children}</div>
  );
}
