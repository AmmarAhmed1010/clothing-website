import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/shop";
export const metadata: Metadata = {
  title: { default: "FORME — A wardrobe, considered", template: "%s | FORME" },
  description:
    "Discover considered Eastern and Western pieces for men and women. A fictional fashion retail demo with a working shopping experience.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
