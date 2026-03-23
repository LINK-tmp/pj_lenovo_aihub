"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateApplicationStatus } from "@/actions/applications";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";
import type { ApplicationStatus } from "@prisma/client";
import { toast } from "sonner";

const STATUSES: ApplicationStatus[] = [
  "NEW",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];

export function ApplicationStatusChanger({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  async function handleChange(value: string | null) {
    if (!value) return;
    try {
      await updateApplicationStatus(applicationId, value as ApplicationStatus);
      toast.success("ステータスを変更しました");
    } catch {
      toast.error("変更に失敗しました");
    }
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange}>
      <SelectTrigger
        className="w-[120px] h-8 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {APPLICATION_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
