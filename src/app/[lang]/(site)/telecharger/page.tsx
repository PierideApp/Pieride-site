import type { Metadata } from "next";
import { DownloadPage } from "@/components/download/download-page";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata> {
  const {lang} = await params;
  return lang === "en" ? { title: "Download Piéride", description: "Piéride releases and installation guidance." } : { title: "Télécharger Piéride", description: "Versions et guide d’installation de Piéride." };
}
export default async function DownloadRoute({params}:{params:Promise<{lang:string}>}) {
  const {lang} = await params; const locale = getLocale(lang);
  return <DownloadPage t={getDictionary(locale).download} locale={locale} />;
}
