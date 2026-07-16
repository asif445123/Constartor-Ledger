import type { Metadata } from "next";
import { cookies } from "next/headers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://constartor-ledger.onrender.com";

const seo = {
  ur: {
    title: "لاگ ان کریں / ڈیمو دیکھیں",
    description:
      "ٹھیکیدار رجسٹر میں لاگ ان کریں یا بغیر اکاؤنٹ کے ڈیمو دیکھیں — مزدور، مالک اور خرچہ کا مکمل حساب کتاب ایک جگہ۔",
  },
  en: {
    title: "Log In / View Demo",
    description:
      "Log in to Thekedar Register or explore the demo without an account — complete accounting for labor, owners, and expenses in one place.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value === "en" ? "en" : "ur";
  const s = seo[locale];

  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: "/login" },
    openGraph: {
      title: s.title,
      description: s.description,
      url: `${siteUrl}/login`,
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
