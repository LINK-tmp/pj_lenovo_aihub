"use client";

import { togglePublish } from "@/actions/cases";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export function TogglePublishButton({
  caseId,
  isPublished,
}: {
  caseId: string;
  isPublished: boolean;
}) {
  async function handleToggle() {
    try {
      await togglePublish(caseId);
      toast.success(isPublished ? "非公開にしました" : "公開しました");
    } catch {
      toast.error("操作に失敗しました");
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        isPublished
          ? "bg-status-progress/10 text-status-progress hover:bg-status-progress/20"
          : "bg-brand-gray/10 text-brand-gray hover:bg-brand-gray/20"
      }`}
      title={isPublished ? "クリックで非公開に" : "クリックで公開に"}
    >
      {isPublished ? (
        <>
          <Eye className="w-3.5 h-3.5" />
          公開中
        </>
      ) : (
        <>
          <EyeOff className="w-3.5 h-3.5" />
          非公開
        </>
      )}
    </button>
  );
}
