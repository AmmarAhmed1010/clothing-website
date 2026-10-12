import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, categories } from "@/lib/catalog";
import {
  ProductList,
  ProductDetail,
  Cart,
  Checkout,
  Confirmation,
} from "@/components/shop";
const routes = [
  "shop",
  "men",
  "women",
  "search",
  "wishlist",
  "cart",
  "checkout",
  "order-confirmation",
  ...categories.map(([slug]) => `collections/${slug}`),
  ...products.map((p) => `products/${p.slug}`),
];
export function generateStaticParams() {
  return routes.map((r) => ({ slug: r.split("/") }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const p = products.find((p) => key === `products/${p.slug}`);
  return {
    title:
      p?.name ??
      (categories.find(([s]) => key === `collections/${s}`)?.[1] ||
        slug[0].replaceAll("-", " ")),
    description:
      p?.description ??
      "Browse the fictional FORME collection and considered shopping experience.",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");
  if (!routes.includes(key)) notFound();
  const p = products.find((p) => key === `products/${p.slug}`);
  let content;
  if (p) content = <ProductDetail product={p} />;
  else if (key === "cart") content = <Cart />;
  else if (key === "checkout") content = <Checkout />;
  else if (key === "order-confirmation") content = <Confirmation />;
  else
    content = (
      <ProductList
        gender={key === "men" || key === "women" ? key : ""}
        category={slug[0] === "collections" ? slug[1] : ""}
        wishlist={key === "wishlist"}
        search={key === "search"}
        title={
          key === "men"
            ? "For him."
            : key === "women"
              ? "For her."
              : key === "wishlist"
                ? "Your personal edit."
                : key === "search"
                  ? "Find your next favourite."
                  : categories.find(([s]) => key === `collections/${s}`)?.[1] ||
                    "The full collection."
        }
      />
    );
  return (
    <Suspense
      fallback={<div className="empty-state">Preparing the collection…</div>}
    >
      {content}
    </Suspense>
  );
}
