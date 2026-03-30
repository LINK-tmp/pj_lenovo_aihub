"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "メールアドレスまたはパスワードが正しくありません" };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
}
