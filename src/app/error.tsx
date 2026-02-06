"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded border border-border bg-white p-6 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
        <p className="mb-6 text-sm text-secondary">Please try again.</p>
        <Button onClick={reset} aria-label="Try again">
          Try again
        </Button>
      </div>
    </div>
  );
}
