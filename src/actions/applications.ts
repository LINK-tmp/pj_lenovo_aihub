"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";
import type { ApplicationStatus } from "@prisma/client";

export async function createApplication(
  useCaseId: string,
  data: Record<string, unknown>
) {
  const session = await requireAuth("MEMBER");
  const parsed = applicationSchema.parse(data);

  const useCase = await prisma.useCase.findUnique({
    where: { id: useCaseId, isPublished: true },
  });
  if (!useCase) throw new Error("この案件は現在公開されていません");

  const existing = await prisma.application.findUnique({
    where: {
      useCaseId_applicantId: {
        useCaseId,
        applicantId: session.user.id,
      },
    },
  });

  if (existing) throw new Error("この案件にはすでに応募済みです");

  await prisma.$transaction([
    prisma.application.create({
      data: {
        ...parsed,
        useCaseId,
        applicantId: session.user.id,
      },
    }),
    prisma.activityLog.create({
      data: {
        action: "応募",
        detail: `${parsed.organizationName}が応募`,
        userId: session.user.id,
        useCaseId,
      },
    }),
  ]);

  revalidatePath(`/member/${useCaseId}`);
  revalidatePath("/member/my-applications");
  revalidatePath("/admin/applications");
  return { success: true };
}

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus
) {
  const session = await requireAuth("ADMIN");

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { status: newStatus },
    include: { useCase: true },
  });

  await prisma.activityLog.create({
    data: {
      action: "応募ステータス変更",
      detail: `${application.organizationName}の応募を「${newStatus}」に変更`,
      userId: session.user.id,
      useCaseId: application.useCaseId,
    },
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/cases/${application.useCaseId}`);
  return application;
}
