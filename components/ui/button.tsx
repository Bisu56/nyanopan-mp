import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variantClasses: Record<ButtonVariant, string> = {
  // Terracotta primary action (design: bg-[#96432b], hover #833822)
  primary: "bg-primary text-on-primary hover:bg-primary-deep shadow-md",
  // Soft cream secondary (design: bg-[#f9ebe3], border #eee0d8)
  secondary:
    "bg-surface-container text-on-surface border border-surface-container-highest hover:bg-surface-container-high",
  ghost: "text-primary hover:bg-surface-container",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-xs",
};

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Build the class string for a styled action — usable on both <button> and <Link>. */
export function buttonClassName({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonClassOptions = {}): string {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Required<Pick<ButtonClassOptions, "variant" | "size">> {
  className?: string;
}

/** Native button with the shared Nyanopan action styling. */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
