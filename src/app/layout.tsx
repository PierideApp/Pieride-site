import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const snPro = localFont({
  src: "../../public/fonts/SNPro-VariableRegular.woff2",
  variable: "--font-sn-pro",
  display: "swap",
  weight: "200 900",
});

const unbounded = localFont({
  src: [
    { path: "../../public/fonts/Unbounded-800-latin.woff2", weight: "800" },
    { path: "../../public/fonts/Unbounded-900-latin.woff2", weight: "900" },
  ],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Piéride — Ta vie scolaire sur grand écran", template: "%s · Piéride" },
  description: "Découvre Piéride, l’application scolaire open source pour ordinateur.",
  icons: { icon: "/brand/pieride-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-theme="dark" className={`${snPro.variable} ${unbounded.variable} antialiased motion-safe:scroll-smooth`}>
      <body className="min-h-dvh bg-pieride-night font-sans text-white selection:bg-pieride-cyan/30">
        {children}
      </body>
    </html>
  );
}
