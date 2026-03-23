import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export const useCaseSchema = z.object({
  title: z.string().min(1, "案件名を入力してください"),
  summary: z.string().min(1, "ユースケース概要を入力してください"),
  challenge: z.string().min(1, "課題内容を入力してください"),
  expectedDev: z.string().optional(),
  industry: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  budgetRange: z.enum(["UNDER_1M", "UNDER_3M", "UNDER_5M", "UNDER_10M", "OVER_10M", "UNDECIDED"]).optional(),
  targetAudience: z.enum(["UNIVERSITY", "COMPANY", "BOTH"]).optional(),
  notes: z.string().optional(),
});

export const proxyUseCaseSchema = useCaseSchema.extend({
  companyName: z.string().min(1, "企業名を入力してください"),
  adminNotes: z.string().optional(),
  publishImmediately: z.boolean().default(false),
});

export const applicationSchema = z.object({
  organizationName: z.string().min(1, "組織名を入力してください"),
  contactName: z.string().min(1, "担当者名を入力してください"),
  contactEmail: z.string().email("有効なメールアドレスを入力してください"),
  proposalSummary: z.string().min(1, "提案概要を入力してください"),
  message: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UseCaseInput = z.infer<typeof useCaseSchema>;
export type ProxyUseCaseInput = z.infer<typeof proxyUseCaseSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
