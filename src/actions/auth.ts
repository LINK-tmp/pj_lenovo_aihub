"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }
    // NEXT_REDIRECT はここを通る — 再 throw して Next.js にリダイレクトさせる
    throw error;
  }
  return null;
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
