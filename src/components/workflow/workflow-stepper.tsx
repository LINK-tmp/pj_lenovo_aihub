import type { CaseStatus } from "@prisma/client";
import { Check } from "lucide-react";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WorkflowStepperProps {
  currentStatus: CaseStatus;
  className?: string;
}

export function WorkflowStepper({ currentStatus, className }: WorkflowStepperProps) {
  const currentIndex = WORKFLOW_STEPS.findIndex(
    (s) => s.status === currentStatus
  );

  return (
    <div className={cn("flex items-center w-full bg-surface-off-white rounded-xl p-4 overflow-x-auto", className)}>
      {WORKFLOW_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isCompleted && "bg-brand-wine text-white",
                  isCurrent &&
                    "gradient-brand-2 text-white ring-4 ring-brand-wine/15 shadow-md",
                  !isCompleted && !isCurrent && "bg-border-default text-brand-gray"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs text-center",
                  isCurrent
                    ? "text-brand-wine font-bold"
                    : isCompleted
                    ? "text-brand-wine font-medium"
                    : "text-brand-gray"
                )}
              >
                {step.label}
              </span>
            </div>

            {index < WORKFLOW_STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 self-start mt-3 sm:mt-4 rounded-full",
                  index < currentIndex
                    ? "bg-brand-wine"
                    : "bg-border-default"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
