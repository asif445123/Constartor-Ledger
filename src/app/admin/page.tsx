"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/apiFetch";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import AdminLoginGate from "@/components/admin/AdminLoginGate";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function AdminPage() {
  const { user, loggedIn, checking } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const STATUS_LABEL: Record<AdminUser["status"], string> = {
    pending: t.admin.pending,
    approved: t.admin.approved,
    rejected: t.admin.rejected,
  };

  const STATUS_TONE: Record<AdminUser["status"], string> = {
    pending: "text-[var(--color-accent-dark)]",
    approved: "text-[var(--color-green)]",
    rejected: "text-[var(--color-rust)]",
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        showToast(data.message || t.admin.loadFailed, "error");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    if (user?.role === "admin") loadUsers();
  }, [user, loadUsers]);

  async function updateStatus(id: string, status: AdminUser["status"]) {
    setBusyId(id);
    try {
      const res = await apiFetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || t.admin.updateFailed, "error");
        return;
      }
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
      showToast(status === "approved" ? t.admin.userApproved : t.admin.userRejected, "success");
    } finally {
      setBusyId(null);
    }
  }

  if (checking) return null;

  if (!loggedIn) {
    return <AdminLoginGate />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-display text-2xl text-[var(--color-ink)] mb-1">{t.admin.noAccess}</p>
        <p className="text-[var(--color-ink-soft)] text-sm">{t.admin.noAccessDesc}</p>
      </div>
    );
  }

  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <div>
      <PageHeader eyebrow={t.admin.eyebrow} title={t.admin.title} subtitle={t.admin.subtitle} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label={t.admin.totalUsers} value={users.length} />
        <StatCard label={t.admin.pending} value={pendingCount} tone={pendingCount > 0 ? "accent" : "default"} />
        <StatCard label={t.admin.approved} value={users.filter((u) => u.status === "approved").length} tone="positive" />
      </div>

      <div className="bg-white rounded-lg border border-[var(--color-line)] overflow-x-auto">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>{t.admin.colName}</th>
              <th>{t.admin.colEmail}</th>
              <th>{t.admin.colRole}</th>
              <th>{t.admin.colStatus}</th>
              <th>{t.admin.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[var(--color-ink-soft)]">
                  {t.admin.loading}
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[var(--color-ink-soft)]">
                  {t.admin.noUsers}
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u._id}>
                <td className="font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role === "admin" ? t.admin.roleAdmin : t.admin.roleUser}</td>
                <td className={`font-semibold ${STATUS_TONE[u.status]}`}>{STATUS_LABEL[u.status]}</td>
                <td>
                  <div className="flex gap-1.5">
                    <button
                      disabled={u.status === "approved" || busyId === u._id}
                      onClick={() => updateStatus(u._id, "approved")}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-green)]/10 text-[var(--color-green)] border border-[var(--color-green)]/30 hover:bg-[var(--color-green)]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {t.admin.approveBtn}
                    </button>
                    <button
                      disabled={u.status === "rejected" || busyId === u._id}
                      onClick={() => updateStatus(u._id, "rejected")}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-rust)]/10 text-[var(--color-rust)] border border-[var(--color-rust)]/30 hover:bg-[var(--color-rust)]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {t.admin.rejectBtn}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
