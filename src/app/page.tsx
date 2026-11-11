import { SiteFrame } from "@/components/layout/site-frame";
import { HomePage } from "@/components/home/home-page";
import dictionary from "@/i18n/dictionaries/fr";
import { defaultLocale } from "@/i18n/config";
import { getBlogArchive } from "@/lib/blog-content";

export default async function HomeRoute() {
  const blog = await getBlogArchive();
  return <SiteFrame dictionary={dictionary} locale={defaultLocale}><HomePage dictionary={dictionary} locale={defaultLocale} blog={blog} /></SiteFrame>;
}
