import "./globals.css";
import type { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "github-test-015",
  description: "A scalable, eye-catching Coffee Shop website with a customer-facing storefront, shopping cart & checkout, and an admin dashboard for CRUD management of products, orders, inventory and analytics. Built with a modern TypeScript stack, responsive design, and performance/accessibility best practices."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navigation />
            <main className="min-h-screen bg-background text-foreground">
              {children}
            </main>
            <Toaster />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
