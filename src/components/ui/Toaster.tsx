"use client";

import { useToast } from "@/providers/ToastProvider";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start justify-between rounded border border-border bg-white p-3 shadow"
          role="status"
        >
          <div className="pr-3">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-secondary">{toast.description}</p>
            )}
          </div>
          <button
            className="rounded p-1 text-secondary hover:bg-muted"
            aria-label="Dismiss notification"
            onClick={() => dismiss(toast.id)}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
