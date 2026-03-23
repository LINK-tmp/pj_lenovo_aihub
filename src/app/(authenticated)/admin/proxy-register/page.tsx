"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProxyUseCase } from "@/actions/cases";
import { INDUSTRY_OPTIONS, BUDGET_RANGE_LABELS, TARGET_AUDIENCE_LABELS } from "@/lib/constants";
import { toast } from "sonner";

export default function ProxyRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [publishImmediately, setPublishImmediately] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(formData);
    data.publishImmediately = publishImmediately;

    try {
      await createProxyUseCase(data);
      toast.success(
        publishImmediately
          ? "案件を登録・公開しました"
          : "案件を下書きとして登録しました"
      );
      router.push("/admin/cases");
    } catch {
      toast.error("登録に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold font-heading tracking-wide border-l-4 border-brand-red pl-3 mb-6">
        案件代理登録
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-border-default p-6 space-y-5 max-w-2xl"
      >
        {/* Proxy-specific field */}
        <div className="space-y-2 bg-status-review/5 border border-status-review/20 rounded-lg p-4">
          <Label htmlFor="companyName" className="font-bold">
            登録先企業 *（代理登録専用）
          </Label>
          <Input
            id="companyName"
            name="companyName"
            required
            placeholder="企業名を入力"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">案件名 *</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">ユースケース概要 *</Label>
          <Textarea id="summary" name="summary" required rows={4} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="challenge">課題内容 *</Label>
          <Textarea id="challenge" name="challenge" required rows={4} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedDev">期待する開発内容</Label>
          <Textarea id="expectedDev" name="expectedDev" rows={3} />
        </div>

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

        {/* Admin-only fields */}
        <div className="space-y-2">
          <Label htmlFor="adminNotes">事務局メモ（内部用・非公開）</Label>
          <Textarea
            id="adminNotes"
            name="adminNotes"
            rows={2}
            placeholder="企業担当者との会話メモなど"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="publishImmediately"
            checked={publishImmediately}
            onCheckedChange={(checked) =>
              setPublishImmediately(checked === true)
            }
          />
          <Label htmlFor="publishImmediately" className="text-sm">
            審査済みとして即公開する
          </Label>
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
            {loading ? "登録中..." : "登録する →"}
          </Button>
        </div>
      </form>
    </div>
  );
}
