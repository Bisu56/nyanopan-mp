import type { ReactNode } from "react";

export type BadgeTone = "primary" | "sage" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  primary: "bg-primary-fixed text-on-primary-fixed",
  sage: "bg-secondary-container text-on-secondary-container",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Small pill used for tags like "Handmade in Nepal" or stock notices. */
export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
