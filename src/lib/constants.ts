import type { CaseStatus, ApplicationStatus, BudgetRange, TargetAudience } from "@prisma/client";

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  DRAFT: "下書き",
  UNDER_REVIEW: "審査中",
  OPEN: "募集中",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
};

export const CASE_STATUS_COLORS: Record<CaseStatus, string> = {
  DRAFT: "bg-status-draft/10 text-status-draft",
  UNDER_REVIEW: "bg-status-review/10 text-status-review",
  OPEN: "bg-status-open/10 text-status-open",
  IN_PROGRESS: "bg-status-progress/10 text-status-progress",
  COMPLETED: "bg-status-complete/10 text-status-complete",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: "新着",
  UNDER_REVIEW: "検討中",
  APPROVED: "承認",
  REJECTED: "不採用",
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  NEW: "bg-status-open/10 text-status-open",
  UNDER_REVIEW: "bg-status-review/10 text-status-review",
  APPROVED: "bg-status-progress/10 text-status-progress",
  REJECTED: "bg-status-complete/10 text-status-complete",
};

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  UNDER_1M: "〜100万円",
  UNDER_3M: "〜300万円",
  UNDER_5M: "〜500万円",
  UNDER_10M: "〜1,000万円",
  OVER_10M: "1,000万円以上",
  UNDECIDED: "未定",
};

export const TARGET_AUDIENCE_LABELS: Record<TargetAudience, string> = {
  UNIVERSITY: "大学",
  COMPANY: "企業",
  BOTH: "大学・企業",
};

export const INDUSTRY_OPTIONS = [
  "製造",
  "物流",
  "小売",
  "金融",
  "医療・ヘルスケア",
  "建設・不動産",
  "エネルギー",
  "IT・通信",
  "農業・食品",
  "その他",
];

export const TECHNOLOGY_OPTIONS = [
  "AI/ML",
  "画像認識",
  "自然言語処理",
  "IoT",
  "ロボティクス",
  "データ分析",
  "ブロックチェーン",
  "AR/VR",
  "クラウド",
  "セキュリティ",
  "その他",
];

export const COVER_IMAGES: Record<string, string> = {
  "製造": "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=300&fit=crop",
  "物流": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=300&fit=crop",
  "小売": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop",
  "金融": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop",
  "医療・ヘルスケア": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=300&fit=crop",
  "IT・通信": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
  "建設・不動産": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=300&fit=crop",
  "エネルギー": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=300&fit=crop",
  "農業・食品": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=300&fit=crop",
  "default": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop",
};

export const COMPANY_CARD_IMAGE = "/company_card.png";

export const WORKFLOW_STEPS: { status: CaseStatus; label: string }[] = [
  { status: "DRAFT", label: "投稿" },
  { status: "UNDER_REVIEW", label: "審査" },
  { status: "OPEN", label: "公開・募集中" },
  { status: "IN_PROGRESS", label: "マッチング・進行" },
  { status: "COMPLETED", label: "完了" },
];
