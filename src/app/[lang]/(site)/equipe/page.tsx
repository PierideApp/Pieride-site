import type { Metadata } from "next";
import { TeamPage } from "@/components/team/team-page";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata> {
  const {lang} = await params;
  return lang === "en" ? { title: "Team", description: "Meet the people contributing to Piéride." } : { title: "L’équipe", description: "Découvre les personnes qui contribuent au projet Piéride." };
}
export default async function TeamRoute({params}:{params:Promise<{lang:string}>}) {
  const {lang} = await params; const locale = getLocale(lang); const dictionary = getDictionary(locale);
  return <TeamPage t={dictionary.team} locale={locale} />;
}
