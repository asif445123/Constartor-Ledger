"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/apiFetch";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface LoginResult {
  ok: boolean;
  reason?: "pending" | "rejected";
  message?: string;
}

export interface RegisterResult {
  ok: boolean;
  pending?: boolean;
  message?: string;
}

export interface UpdateProfileResult {
  ok: boolean;
  message?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loggedIn: boolean;
  checking: boolean;
  register: (name: string, email: string, password: string) => Promise<RegisterResult>;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (
    name: string,
    email: string,
    currentPassword?: string,
    newPassword?: string
  ) => Promise<UpdateProfileResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshUser();
      setChecking(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<RegisterResult> => {
      try {
        const res = await apiFetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, message: data.message || t.login.registerFailed };
        }
        if (data.pending) {
          return { ok: true, pending: true, message: data.message };
        }
        setUser(data.user);
        return { ok: true, pending: false, message: data.message };
      } catch {
        return { ok: false, message: t.authContext.serverUnreachable };
      }
    },
    [t]
  );

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, reason: data.reason, message: data.message || t.authContext.loginFailed };
      }
      setUser(data.user);
      return { ok: true };
    } catch {
      return { ok: false, message: t.authContext.serverUnreachable };
    }
  }, [t]);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (
      name: string,
      email: string,
      currentPassword?: string,
      newPassword?: string
    ): Promise<UpdateProfileResult> => {
      try {
        const res = await apiFetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, currentPassword, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, message: data.message || t.authContext.loginFailed };
        }
        setUser(data.user);
        return { ok: true, message: data.message };
      } catch {
        return { ok: false, message: t.authContext.serverUnreachable };
      }
    },
    [t]
  );

  return (
    <AuthContext.Provider
      value={{ user, loggedIn: !!user, checking, register, login, logout, refreshUser, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
