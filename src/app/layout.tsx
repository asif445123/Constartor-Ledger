import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppShell from "@/components/layout/AppShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://constartor-ledger.onrender.com";

const seo = {
  ur: {
    title: {
      default: "Contractor Ledger-ٹھیکیدار رجسٹر",
      template: "%s | ٹھیکیدار رجسٹر",
    },
    description: "مزدور، مالک اور خرچہ کا مکمل حساب کتاب — تعمیراتی سائٹس کے لیے آسان ڈیجیٹل لیجر۔",
    keywords: [
      "ٹھیکیدار رجسٹر",
      "تعمیراتی سائٹ لیجر",
      "مزدور حساب کتاب",
      "خرچہ رجسٹر",
      "مالک ٹھیکہ حساب",
      "سائٹ اکاؤنٹنگ ایپ",
      "contractor ledger",
      "construction site ledger",
    ],
    siteName: "ٹھیکیدار رجسٹر",
    ogLocale: "ur_PK",
  },
  en: {
    title: {
      default: "Contractor Ledger — Construction Site Ledger",
      template: "%s | Contractor Ledger",
    },
    description:
      "Complete accounting for labor, owners, and expenses — a simple digital ledger built for construction sites.",
    keywords: [
      "contractor ledger",
      "construction site ledger",
      "labor wage tracker",
      "contractor expense app",
      "site accounting software",
      "owner contract tracking",
      "ٹھیکیدار رجسٹر",
      "تعمیراتی سائٹ لیجر",
    ],
    siteName: "Contractor Ledger",
    ogLocale: "en_US",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value === "en" ? "en" : "ur";
  const s = seo[locale];

  return {
    metadataBase: new URL(siteUrl),
    title: s.title,
    description: s.description,
    keywords: [...s.keywords],
    authors: [{ name: "Contractor Ledger" }],
    alternates: {
      canonical: "/",
      languages: {
        "ur-PK": "/",
        "en-US": "/",
      },
    },
    openGraph: {
      title: s.title.default,
      description: s.description,
      url: siteUrl,
      siteName: s.siteName,
      locale: s.ogLocale,
      alternateLocale: locale === "ur" ? "en_US" : "ur_PK",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: s.title.default,
      description: s.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: { icon: "/favicon.png" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value === "en" ? "en" : "ur";
  const dir = locale === "en" ? "ltr" : "rtl";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased">
       <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <ConfirmProvider>
                <AuthProvider>
                  <DataProvider>
                    <AppShell>{children}</AppShell>
                  </DataProvider>
                </AuthProvider>
              </ConfirmProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
