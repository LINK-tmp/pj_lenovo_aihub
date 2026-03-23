"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createApplication } from "@/actions/applications";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const useCaseId = params.id as string;
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await createApplication(useCaseId, data);
      toast.success("応募が完了しました");
      router.push("/member");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "応募に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/member/${useCaseId}`}
        className="text-sm text-brand-gray hover:text-brand-dark inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        案件詳細に戻る
      </Link>

      <h1 className="text-xl font-semibold font-heading tracking-wide border-l-4 border-brand-red pl-3 mb-6">
        応募・提案の送信
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border-default p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="organizationName">組織名 *</Label>
          <Input id="organizationName" name="organizationName" required className="h-11" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName">担当者名 *</Label>
          <Input id="contactName" name="contactName" required className="h-11" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">連絡先メールアドレス *</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposalSummary">提案概要 *</Label>
          <Textarea
            id="proposalSummary"
            name="proposalSummary"
            required
            rows={5}
            placeholder="どのような技術・アプローチで対応可能か、実績等をご記入ください"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">補足メッセージ</Label>
          <Textarea id="message" name="message" rows={3} />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-cta-blue hover:bg-cta-blue-hover text-white"
          >
            {loading ? "送信中..." : "応募を送信"}
          </Button>
        </div>
      </form>
    </div>
  );
}
