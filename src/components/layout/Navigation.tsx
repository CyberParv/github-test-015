"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/account/orders", label: "Orders" },
  { href: "/admin", label: "Admin" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold" aria-label="Go to home">
          BrewCraft Coffee
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary">Hi, {user.name}</span>
              <Button variant="outline" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" aria-label="Login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/login" aria-label="Sign up">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
        <button
          className="inline-flex items-center justify-center rounded border border-border p-2 text-foreground md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <Button variant="outline" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            ) : (
              <>
                <Link href="/auth/login" aria-label="Login">
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link href="/auth/login" aria-label="Sign up">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
