import type { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  /** Optional call-to-action, already styled (e.g. a <Link> with buttonClassName). */
  action?: ReactNode;
  /** Optional icon replacing the default one. */
  icon?: ReactNode;
  className?: string;
}

/**
 * Shared empty-state layout so every list, cart and future search result
 * degrades gracefully instead of showing a blank screen.
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-surface-container-highest bg-surface-container-low px-6 py-16 text-center ${className}`.trim()}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
        {icon ?? <PackageOpen aria-hidden className="h-7 w-7" />}
      </span>
      <div className="max-w-md space-y-2">
        <h2 className="font-serif text-xl font-bold text-on-surface">{title}</h2>
        <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
      </div>
      {action}
    </div>
  );
}
