"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCaseStatus } from "@/actions/cases";
import { CASE_STATUS_LABELS } from "@/lib/constants";
import type { CaseStatus } from "@prisma/client";
import { toast } from "sonner";

const STATUSES: CaseStatus[] = [
  "DRAFT",
  "UNDER_REVIEW",
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
];

export function StatusChanger({
  caseId,
  currentStatus,
}: {
  caseId: string;
  currentStatus: CaseStatus;
}) {
  async function handleChange(value: string | null) {
    if (!value) return;
    try {
      await updateCaseStatus(caseId, value as CaseStatus);
      toast.success(`ステータスを「${CASE_STATUS_LABELS[value as CaseStatus]}」に変更しました`);
    } catch {
      toast.error("変更に失敗しました");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-brand-gray">ステータス:</span>
      <Select defaultValue={currentStatus} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {CASE_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
