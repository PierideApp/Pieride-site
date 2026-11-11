import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { getDictionary, getLocale } from "@/i18n/server";
import { getBlogArchive } from "@/lib/blog-content";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata> {
  const {lang} = await params;
  return getDictionary(getLocale(lang)).metadata;
}

export default async function HomeRoute({params}:{params:Promise<{lang:string}>}) {
  const {lang:rawLocale} = await params;
  const locale = getLocale(rawLocale);
  const [dictionary, blog] = await Promise.all([Promise.resolve(getDictionary(locale)), getBlogArchive()]);
  return <HomePage dictionary={dictionary} locale={locale} blog={blog} />;
}
