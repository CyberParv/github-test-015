import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded border border-border bg-white p-6 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Page not found</h1>
        <p className="mb-6 text-sm text-secondary">
          The page you are looking for doesn&apos;t exist.
        </p>
        <Link href="/" aria-label="Go to home">
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
