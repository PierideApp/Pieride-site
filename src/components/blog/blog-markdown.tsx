import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/lib/routes";
import { withBasePath } from "@/lib/site-path";

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] || []), "className", "id"],
    a: [...(defaultSchema.attributes?.a || []), "target", "rel"],
    img: [...(defaultSchema.attributes?.img || []), "width", "height", "loading"],
  },
};

function componentsFor(locale: Locale): Components {
  return {
    a({ href, children, node: _node, ...props }) {
      const url = typeof href === "string" ? href : "#";
      const localized = url.startsWith("/blog") ? localizedPath(locale, url) : url;
      const finalUrl = url.startsWith("/") ? withBasePath(localized) || localized : url;
      const external = /^(?:https?:)?\/\//i.test(url);
      return <a href={finalUrl} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...props}>{children}</a>;
    },
    img({ src, alt, node: _node, ...props }) {
      const url = typeof src === "string" ? src : "";
      return <img src={withBasePath(url) || url} alt={alt || ""} loading="lazy" {...props} />;
    },
  };
}

export function BlogMarkdown({ content, locale }: { content: string; locale: Locale }) {
  return <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeSlug] as any} components={componentsFor(locale)}>{content}</ReactMarkdown></div>;
}
