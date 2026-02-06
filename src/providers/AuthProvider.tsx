"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("auth_user") : null;
    if (stored) {
      setUser(JSON.parse(stored) as User);
    }
  }, []);

  const login = (nextUser: User) => {
    setUser(nextUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("auth_user", JSON.stringify(nextUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("auth_user");
    }
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
