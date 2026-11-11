import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { locales, hasLocale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return children;
}
