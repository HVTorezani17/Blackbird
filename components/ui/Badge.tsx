import { HTMLAttributes } from "react";
import clsx from "clsx";

type Tone = "brand" | "navy" | "amber" | "neutral" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  brand: "bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]",
  navy: "bg-[var(--color-navy-soft)] text-[var(--color-navy)]",
  amber: "bg-[var(--color-amber-soft)] text-[var(--color-amber)]",
  neutral: "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]",
  danger: "bg-red-50 text-[var(--color-danger)]",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
