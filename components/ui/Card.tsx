import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]",
        className,
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
      {...props}
    />
  );
}
