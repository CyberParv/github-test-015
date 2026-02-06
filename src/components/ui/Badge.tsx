import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-muted text-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-error/10 text-error"
  };

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
