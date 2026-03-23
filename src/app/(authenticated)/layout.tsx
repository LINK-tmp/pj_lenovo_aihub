import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "next-auth/react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <Header
        userName={session.user.name}
        organizationName={session.user.organizationName}
        role={session.user.role}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
