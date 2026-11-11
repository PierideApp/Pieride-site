import type { ReactNode } from "react";
import { getDictionary, getLocale } from "@/i18n/server";
import { SiteFrame } from "@/components/layout/site-frame";

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = getLocale(lang);
  return <SiteFrame dictionary={getDictionary(locale)} locale={locale}>{children}</SiteFrame>;
}
