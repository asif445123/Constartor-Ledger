"use client";

import React, { useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader, StatCard } from "@/components/ui/StatCard";

export default function SitePage() {
  const { labors, owners, expenses, sites, ready } = useData();
  const { t, locale } = useLanguage();
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return sites
      .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
      .map((site) => {
        const siteAya = owners
          .filter((o) => o.site === site)
          .reduce((sum, o) => sum + (o.received || 0), 0);
        const siteLaborKharcha = labors
          .filter((l) => l.site === site)
          .reduce((sum, l) => sum + (l.kharcha || 0), 0);
        const siteExpenses = expenses
          .filter((e) => e.site === site)
          .reduce((sum, e) => sum + (e.amount || 0), 0);
        const siteBalance = siteAya - siteLaborKharcha - siteExpenses;
        const laborCount = labors.filter((l) => l.site === site).length;
        return { site, siteAya, siteLaborKharcha, siteExpenses, siteBalance, laborCount };
      });
  }, [sites, owners, labors, expenses, search]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          aya: acc.aya + r.siteAya,
          kharcha: acc.kharcha + r.siteLaborKharcha + r.siteExpenses,
          balance: acc.balance + r.siteBalance,
        }),
        { aya: 0, kharcha: 0, balance: 0 }
      ),
    [rows]
  );

  if (!ready) return null;

  return (
    <div>
      <PageHeader eyebrow={t.site.eyebrow} title={t.site.title} subtitle={t.site.subtitle} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label={t.site.totalSites} value={rows.length} />
        <StatCard label={t.site.totalReceived} value={totals.aya.toLocaleString()} tone="positive" />
        <StatCard label={t.site.totalKharcha} value={totals.kharcha.toLocaleString()} tone="negative" />
        <StatCard label={t.site.totalBalance} value={totals.balance.toLocaleString()} tone={totals.balance >= 0 ? "positive" : "negative"} />
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.site.searchBySite}
        className="w-full max-w-xs mb-4 rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      />

      <div className="bg-white rounded-lg border border-[var(--color-line)] overflow-x-auto">
        <table dir={locale === "en" ? "ltr" : "rtl"} className="ledger-table" style={{ textAlign: locale === "en" ? "left" : "right" }}>
          <thead>
            <tr>
              <th>{t.site.colSite}</th>
              <th>{t.site.colReceived}</th>
              <th>{t.site.colLabor}</th>
              <th>{t.site.colLaborKharcha}</th>
              <th>{t.site.colOtherKharcha}</th>
              <th>{t.site.colBalance}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[var(--color-ink-soft)]">
                  {t.site.noSites}
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.site}>
                <td className="font-semibold">{r.site}</td>
                <td className="font-ledger">{r.siteAya.toLocaleString()}</td>
                <td className="font-ledger">{r.laborCount}</td>
                <td className="font-ledger">{r.siteLaborKharcha.toLocaleString()}</td>
                <td className="font-ledger">{r.siteExpenses.toLocaleString()}</td>
                <td className={`font-ledger font-bold ${r.siteBalance >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-rust)]"}`}>
                  {r.siteBalance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
