import type { Metadata } from "next";
import { ContributePage } from "@/components/contribute/contribute-page";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata> {
  const {lang} = await params;
  return lang === "en" ? { title: "Contribute", description: "Suggest an idea or contribute to Piéride." } : { title: "Contribuer", description: "Propose une idée ou contribue au projet Piéride." };
}
export default async function ContributeRoute({params}:{params:Promise<{lang:string}>}) {
  const {lang} = await params; const locale = getLocale(lang);
  return <ContributePage t={getDictionary(locale).contribute} locale={locale} />;
}
