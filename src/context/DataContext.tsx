/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Expense, Labor, Owner } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { demoLabors, demoOwners, demoExpenses } from "@/lib/demoData";
import { useLanguage } from "@/context/LanguageContext";
import type { Dict } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/apiFetch";

interface DataContextValue {
  ready: boolean;
  isDemo: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  labors: Labor[];
  owners: Owner[];
  expenses: Expense[];
  sites: string[];

  addLabor: (data: {
    name: string;
    rate: number;
    mobile: string;
    site: string;
  }) => Promise<void>;
  editLabor: (id: string, patch: Partial<Labor>) => Promise<void>;
  deleteLabor: (id: string) => Promise<void>;
  markAttendance: (id: string, date: string) => Promise<void>;
  addLaborExpense: (
    id: string,
    date: string,
    amount: number,
    note: string,
  ) => Promise<void>;

  addOwner: (data: {
    name: string;
    site: string;
    amount: number;
    date: string;
    mobile: string;
    desc: string;
  }) => Promise<void>;
  editOwner: (id: string, patch: Partial<Owner>) => Promise<void>;
  deleteOwner: (id: string) => Promise<void>;
  addDeal: (
    id: string,
    date: string,
    amount: number,
    desc: string,
  ) => Promise<void>;
  receiveMoney: (
    id: string,
    date: string,
    amount: number,
    from: string,
  ) => Promise<void>;

  addExpense: (data: {
    name: string;
    amount: number;
    date: string;
    site: string;
  }) => Promise<void>;
  editExpense: (id: string, patch: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

function mapId<T extends { _id: string }>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id };
}

async function jsonOrThrow(res: Response, t: Dict) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || t.dataContext.requestFailed);
  return data;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const DEMO_BLOCKED_MSG = t.dataContext.demoBlocked;
  const [ready, setReady] = useState(false);
  const [labors, setLabors] = useState<Labor[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDemo, setIsDemo] = useState(false);

  const enterDemoMode = useCallback(() => {
    setLabors(demoLabors);
    setOwners(demoOwners);
    setExpenses(demoExpenses);
    setIsDemo(true);
    setReady(true);
  }, []);

  const exitDemoMode = useCallback(() => {
    setIsDemo(false);
    setReady(false); // triggers the useEffect below to refetch real data if loggedIn
  }, []);

  useEffect(() => {
    if (isDemo) return; // don't fetch real data while in demo mode
    if (!loggedIn) {
      setLabors([]);
      setOwners([]);
      setExpenses([]);
      setReady(false);
      return;
    }
    (async () => {
      try {
        const [lRes, oRes, eRes] = await Promise.all([
          apiFetch("/api/labors"),
          apiFetch("/api/owners"),
          apiFetch("/api/expenses"),
        ]);
        const [lData, oData, eData] = await Promise.all([
          lRes.json(),
          oRes.json(),
          eRes.json(),
        ]);
        setLabors((lData.labors ?? []).map(mapId));
        setOwners((oData.owners ?? []).map(mapId));
        setExpenses((eData.expenses ?? []).map(mapId));
      } catch {
        showToast(t.dataContext.loadError, "error");
      } finally {
        setReady(true);
      }
    })();
  }, [loggedIn, showToast, isDemo, t]);

  const sites = useMemo(() => {
    const all = [
      ...owners.map((o) => o.site || ""),
      ...labors.map((l) => l.site || ""),
      ...expenses.map((e) => e.site || ""),
    ];
    return Array.from(new Set(all.filter((s) => s && s.trim() !== "")));
  }, [owners, labors, expenses]);

  // ---------- Labor ----------
  const addLabor = useCallback(
    async (data: {
      name: string;
      rate: number;
      mobile: string;
      site: string;
    }) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch("/api/labors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await jsonOrThrow(res, t);
      setLabors((prev) => [...prev, mapId(json.labor)]);
    },
    [isDemo, showToast, t],
  );

  const editLabor = useCallback(
    async (id: string, patch: Partial<Labor>) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch(`/api/labors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await jsonOrThrow(res, t);
      setLabors((prev) => prev.map((l) => (l.id === id ? mapId(json.labor) : l)));
    },
    [isDemo, showToast, t],
  );

  const deleteLabor = useCallback(
    async (id: string) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      await apiFetch(`/api/labors/${id}`, { method: "DELETE" });
      setLabors((prev) => prev.filter((l) => l.id !== id));
    },
    [isDemo, showToast, t],
  );

  const markAttendance = useCallback(
    async (id: string, date: string) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch(`/api/labors/${id}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const json = await jsonOrThrow(res, t);
      setLabors((prev) => prev.map((l) => (l.id === id ? mapId(json.labor) : l)));
    },
    [isDemo, showToast, t],
  );

  const addLaborExpense = useCallback(
    async (id: string, date: string, amount: number, note: string) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch(`/api/labors/${id}/expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, amount, note }),
      });
      const json = await jsonOrThrow(res, t);
      setLabors((prev) =>
        prev.map((l) => (l.id === id ? mapId(json.labor) : l)),
      );
    },
    [isDemo, showToast, t],
  );

  // ---------- Owner ----------
  const addOwner = useCallback(
    async (data: {
      name: string;
      site: string;
      amount: number;
      mobile: string;
      date: string;
      desc: string;
    }) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await jsonOrThrow(res, t);
      setOwners((prev) => [...prev, mapId(json.owner)]);
    },
    [isDemo, showToast, t],
  );

  const editOwner = useCallback(
    async (id: string, patch: Partial<Owner>) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch(`/api/owners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await jsonOrThrow(res, t);
      setOwners((prev) => prev.map((o) => (o.id === id ? mapId(json.owner) : o)));
    },
    [isDemo, showToast, t],
  );

  const deleteOwner = useCallback(
    async (id: string) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      await apiFetch(`/api/owners/${id}`, { method: "DELETE" });
      setOwners((prev) => prev.filter((o) => o.id !== id));
    },
    [isDemo, showToast, t],
  );

  const addDeal = useCallback(
    async (id: string, date: string, amount: number, desc: string) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch(`/api/owners/${id}/deal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, amount, desc }),
      });
      const json = await jsonOrThrow(res, t);
      setOwners((prev) =>
        prev.map((o) => (o.id === id ? mapId(json.owner) : o)),
      );
    },
    [isDemo, showToast, t],
  );

  const receiveMoney = useCallback(
    async (id: string, date: string, amount: number, from: string) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch(`/api/owners/${id}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, amount, from }),
      });
      const json = await jsonOrThrow(res, t);
      setOwners((prev) =>
        prev.map((o) => (o.id === id ? mapId(json.owner) : o)),
      );
    },
    [isDemo, showToast, t],
  );

  // ---------- Expenses ----------
  const addExpense = useCallback(
    async (data: {
      name: string;
      amount: number;
      date: string;
      site: string;
    }) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await jsonOrThrow(res, t);
      setExpenses((prev) => [...prev, mapId(json.expense)]);
    },
    [isDemo, showToast, t],
  );

  const editExpense = useCallback(
    async (id: string, patch: Partial<Expense>) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      const res = await apiFetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await jsonOrThrow(res, t);
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? mapId(json.expense) : e)),
      );
    },
    [isDemo, showToast, t],
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (isDemo) {
        showToast(DEMO_BLOCKED_MSG, "error");
        return;
      }
      await apiFetch(`/api/expenses/${id}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [isDemo, showToast, t],
  );

  const value: DataContextValue = {
    ready,
    isDemo,
    enterDemoMode,
    exitDemoMode,
    labors,
    owners,
    expenses,
    sites,
    addLabor,
    editLabor,
    deleteLabor,
    markAttendance,
    addLaborExpense,
    addOwner,
    editOwner,
    deleteOwner,
    addDeal,
    receiveMoney,
    addExpense,
    editExpense,
    deleteExpense,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export function getOwnerDealInfo(owner: Owner) {
  const deals = (owner.history || []).filter((h) => h.type === "deal");
  const dealAmount = deals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  return { deals, dealAmount, dealCount: deals.length };
}
