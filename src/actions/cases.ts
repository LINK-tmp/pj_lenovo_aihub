"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { useCaseSchema, proxyUseCaseSchema } from "@/lib/validations";
import type { CaseStatus } from "@prisma/client";

function parseTechnologies(data: Record<string, unknown>) {
  if (typeof data.technologies === "string") {
    data.technologies = data.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
}

export async function createUseCase(
  data: FormData | Record<string, unknown>,
  options?: { draft?: boolean }
) {
  const session = await requireAuth("ENTERPRISE");
  const draft = options?.draft ?? false;

  const raw = data instanceof FormData ? Object.fromEntries(data) : data;
  parseTechnologies(raw);
  const parsed = useCaseSchema.parse(raw);

  const useCase = await prisma.useCase.create({
    data: {
      ...parsed,
      companyName: session.user.organizationName,
      status: draft ? "DRAFT" : "UNDER_REVIEW",
      createdById: session.user.id,
    },
  });

  if (!draft) {
    await prisma.activityLog.create({
      data: {
        action: "案件投稿",
        detail: `「${useCase.title}」を投稿`,
        userId: session.user.id,
        useCaseId: useCase.id,
      },
    });
  }

  revalidatePath("/enterprise");
  return { success: true, id: useCase.id };
}

export async function saveDraft(data: Record<string, unknown>) {
  return createUseCase(data, { draft: true });
}

export async function createProxyUseCase(data: Record<string, unknown>) {
  const session = await requireAuth("ADMIN");

  parseTechnologies(data);
  const parsed = proxyUseCaseSchema.parse(data);
  const { companyName, adminNotes, publishImmediately, ...rest } = parsed;

  const status = publishImmediately ? "OPEN" : "DRAFT";

  const [useCase] = await prisma.$transaction([
    prisma.useCase.create({
      data: {
        ...rest,
        companyName,
        adminNotes,
        status,
        isPublished: publishImmediately,
        createdById: session.user.id,
        proxyCreatedById: session.user.id,
      },
    }),
  ]);

  await prisma.activityLog.create({
    data: {
      action: "案件代理登録",
      detail: `事務局が「${useCase.title}」を${companyName}の代理で登録`,
      userId: session.user.id,
      useCaseId: useCase.id,
    },
  });

  revalidatePath("/admin/cases");
  return { success: true, id: useCase.id };
}

export async function updateCaseStatus(caseId: string, newStatus: CaseStatus) {
  const session = await requireAuth("ADMIN");

  const [useCase] = await prisma.$transaction([
    prisma.useCase.update({
      where: { id: caseId },
      data: { status: newStatus },
    }),
    prisma.activityLog.create({
      data: {
        action: "ステータス変更",
        detail: `ステータスを「${newStatus}」に変更`,
        userId: session.user.id,
        useCaseId: caseId,
      },
    }),
  ]);

  revalidatePath("/admin/cases");
  revalidatePath(`/admin/cases/${caseId}`);
  return useCase;
}

export async function togglePublish(caseId: string) {
  const session = await requireAuth("ADMIN");

  const useCase = await prisma.$transaction(async (tx) => {
    const current = await tx.useCase.findUniqueOrThrow({ where: { id: caseId } });
    const newPublished = !current.isPublished;

    const updated = await tx.useCase.update({
      where: { id: caseId },
      data: { isPublished: newPublished },
    });

    await tx.activityLog.create({
      data: {
        action: "公開設定変更",
        detail: newPublished ? "案件を公開に設定" : "案件を非公開に設定",
        userId: session.user.id,
        useCaseId: caseId,
      },
    });

    return updated;
  });

  revalidatePath("/admin/cases");
  return useCase;
}

export async function deleteCase(caseId: string) {
  await requireAuth("ADMIN");

  await prisma.$transaction([
    prisma.activityLog.deleteMany({ where: { useCaseId: caseId } }),
    prisma.application.deleteMany({ where: { useCaseId: caseId } }),
    prisma.useCase.delete({ where: { id: caseId } }),
  ]);

  revalidatePath("/admin/cases");
  return { success: true };
}
