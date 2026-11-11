import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { Locale } from "@/i18n/config";
import type { BlogArchive } from "@/lib/blog-content";
import { BlogTeaser } from "./blog-teaser";
import { DownloadCta } from "./download-cta";
import { Features } from "./features";
import { HomeHero } from "./hero";
import { Product } from "./product";
import { Stories } from "./stories";
import { TeamSpotlight } from "./team-spotlight";

export function HomePage({ dictionary, locale, blog }: { dictionary: Dictionary; locale: Locale; blog: BlogArchive }) {
  return (
    <main id="contenu" className="overflow-x-clip">
      <HomeHero t={dictionary.home.hero} locale={locale} />
      <Features t={dictionary.home.features} />
      <Product t={dictionary.home.product} />
      <Stories t={dictionary.home.stories} locale={locale} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8"><TeamSpotlight t={dictionary.home.team} locale={locale} /></div>
      <BlogTeaser t={dictionary.home.blog} locale={locale} pages={blog.pages} categories={blog.categories} />
      <DownloadCta t={dictionary.home.download} locale={locale} />
    </main>
  );
}
