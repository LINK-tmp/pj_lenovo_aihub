import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/before_login_image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 gradient-brand opacity-75" />

      <div className="relative z-10 w-full max-w-md">
        <LoginForm error={params.error} />
      </div>
    </div>
  );
}
