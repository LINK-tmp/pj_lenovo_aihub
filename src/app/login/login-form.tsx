"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoginForm({ error: initialError }: { error?: string }) {
  const [error, setError] = useState(initialError ? "メールアドレスまたはパスワードが正しくありません" : "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
      <CardHeader className="text-center pb-2 pt-8">
        <div className="mx-auto mb-2">
          <h1 className="text-2xl font-light font-heading text-brand-dark tracking-wider">
            関西AI Hub
          </h1>
          <p className="text-xs text-brand-gray mt-1 tracking-widest uppercase">
            Kansai AI Hub
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              メールアドレス
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              パスワード
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="パスワード"
              className="h-11"
            />
          </div>
          {error && (
            <p className="text-sm text-brand-red bg-brand-red/5 px-3 py-2 rounded-md">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 gradient-brand-2 gradient-brand-2-hover text-white font-medium tracking-wide shadow-lg"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
        <p className="text-center text-xs text-brand-gray mt-6">
          関西AI Hub 事務局
        </p>
      </CardContent>
    </Card>
  );
}
