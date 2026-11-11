import {
  AlertCircle, Apple, ArrowDown, ArrowRight, Bookmark, Butterfly, Calendar, Check,
  ChevronRight, Code, ColorTheme, Cross, ExternalLink, Filter, Gears, Grades, Grid,
  Heart, Home, Info, Lock, Menu, Moon, Newspaper, Paper, Palette, Search, Sparkles,
  Star, Sun, Tasks, User,
} from "@getpapillon/papicons";

const icons = {
  alert: AlertCircle, apple: Apple, arrow: ArrowRight, arrowDown: ArrowDown,
  book: Paper, butterfly: Butterfly, calendar: Calendar, check: Check,
  chevron: ChevronRight, close: Cross, code: Code, colorTheme: ColorTheme,
  download: ArrowDown, external: ExternalLink, filter: Filter, gears: Gears,
  grades: Grades, grid: Grid, heart: Heart, help: Info, home: Home, info: Info, life: Heart,
  lock: Lock, menu: Menu, moon: Moon, news: Newspaper, paper: Paper,
  palette: Palette, search: Search, sliders: Filter, sparkles: Sparkles, star: Star, sun: Sun,
  tasks: Tasks, user: User,
} as const;

export type IconName = keyof typeof icons;

const legacySizes: Record<number, string> = {
  14: "size-3.5", 15: "size-4", 16: "size-4", 17: "size-4.5", 18: "size-5",
  20: "size-5", 21: "size-5", 22: "size-5.5", 25: "size-6", 27: "size-7",
};

export function Icon({ name, className, size }: { name: string; className?: string; size?: number }) {
  const normalized = name.length ? name[0].toLowerCase() + name.slice(1) : name;
  const Component = icons[normalized as IconName] ?? Paper;
  const classes = [className ?? legacySizes[size ?? 20] ?? "size-5"].filter(Boolean).join(" ");
  return <Component aria-hidden className={classes} />;
}
