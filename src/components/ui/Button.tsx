"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", loading = false, disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-primary text-white hover:bg-primary-hover",
      secondary: "bg-secondary text-white hover:opacity-90",
      outline: "border border-border bg-white text-foreground hover:bg-muted",
      ghost: "bg-transparent text-foreground hover:bg-muted"
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner size="sm" label="Loading" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
