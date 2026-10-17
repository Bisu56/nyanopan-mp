import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  /** Optional extra classes for the wrapper. */
  className?: string;
  /** Render as a different element (e.g. "section") when semantics require it. */
  as?: ElementType;
}

/**
 * Centered page gutter used by every route: `max-w-7xl` with responsive
 * horizontal padding, matching the Stitch design's 7xl content column.
 */
export function Container({ children, className = "", as }: ContainerProps) {
  const Component = as ?? "div";
  return (
    <Component className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </Component>
  );
}
