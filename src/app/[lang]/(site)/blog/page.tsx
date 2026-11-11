import type { Metadata } from "next";
import { PostList } from "@/components/blog/post-list";
import { getDictionary, getLocale } from "@/i18n/server";
import { getBlogArchive } from "@/lib/blog-content";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata> {
  const {lang} = await params;
  return lang === "en" ? { title: "Articles", description: "Tips, guides and Piéride project updates." } : { title: "Blog", description: "Articles, guides et coulisses du projet Piéride." };
}
export default async function BlogRoute({params}:{params:Promise<{lang:string}>}) {
  const {lang} = await params; const locale = getLocale(lang);
  const blog = await getBlogArchive();
  return <PostList t={getDictionary(locale).blog} blog={blog} locale={locale} />;
}
