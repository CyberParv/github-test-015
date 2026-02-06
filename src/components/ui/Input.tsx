"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  id: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded border border-border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            error && "border-error",
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={helperText || error ? `${id}-help` : undefined}
          {...props}
        />
        {(helperText || error) && (
          <p id={`${id}-help`} className={cn("text-xs", error ? "text-error" : "text-secondary")}>
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
