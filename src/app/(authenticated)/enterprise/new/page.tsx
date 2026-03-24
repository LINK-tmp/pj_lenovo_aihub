"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUseCase, saveDraft } from "@/actions/cases";
import { INDUSTRY_OPTIONS, BUDGET_RANGE_LABELS, TARGET_AUDIENCE_LABELS } from "@/lib/constants";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function NewUseCasePage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createUseCase(formData);
      toast.success("案件を投稿しました（審査待ち）");
      router.push("/enterprise");
    } catch {
      toast.error("投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleDraft() {
    if (!formRef.current) return;
    setLoading(true);
    const data = Object.fromEntries(new FormData(formRef.current));
    try {
      await saveDraft(data);
      toast.success("下書きを保存しました");
      router.push("/enterprise");
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/enterprise"
        className="text-sm text-brand-gray hover:text-brand-dark inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        ダッシュボードに戻る
      </Link>

      <h1 className="text-xl font-semibold font-heading tracking-wide mb-6">
        ユースケース新規登録
      </h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-border-default overflow-hidden"
      >
        <div className="p-6 space-y-5">
          <p className="text-xs text-brand-gray"><span className="text-brand-red">*</span> は必須項目です</p>

          <div className="space-y-2">
            <Label htmlFor="title">案件名 <span className="text-brand-red">*</span></Label>
            <Input id="title" name="title" required className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">ユースケース概要 <span className="text-brand-red">*</span></Label>
            <Textarea id="summary" name="summary" required rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge">課題内容 <span className="text-brand-red">*</span></Label>
            <Textarea id="challenge" name="challenge" required rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDev">期待する開発内容</Label>
            <Textarea id="expectedDev" name="expectedDev" rows={3} />
          </div>
        </div>

        <div className="border-t border-border-default p-6 space-y-5 bg-surface-off-white/50">
          <h3 className="text-sm font-bold text-brand-dark">分類情報</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>対象業界</Label>
            <Select name="industry">
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">対象技術</Label>
            <Input
              id="technologies"
              name="technologies"
              className="h-11"
              placeholder="AI/ML, 画像認識（カンマ区切り）"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>募集対象</Label>
            <Select name="targetAudience">
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TARGET_AUDIENCE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>PoC予算上限</Label>
            <Select name="budgetRange">
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BUDGET_RANGE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">備考</Label>
          <Textarea id="notes" name="notes" rows={2} />
        </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-border-default bg-surface-off-white/30">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => handleDraft()}
          >
            下書き保存
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-cta-blue hover:bg-cta-blue-hover text-white"
          >
            {loading ? "送信中..." : "投稿する →"}
          </Button>
        </div>
      </form>
    </div>
  );
}
