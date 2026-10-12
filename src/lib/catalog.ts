import data from "./products.json";
export type Product = {
  id: string;
  slug: string;
  name: string;
  gender: string;
  category: string;
  price: number;
  description: string;
  colors: string[];
  collections: string[];
  sizes: string[];
  images: string[];
  material: string;
  stock: number;
  new: boolean;
};
export const products: Product[] = data;
export const colorHex: Record<string, string> = {
  Chalk: "#e9e5d9",
  Ink: "#303337",
  Oat: "#b9a994",
  Olive: "#66715c",
  Stone: "#9d9b93",
  Indigo: "#475d77",
  Rose: "#b88380",
  Burgundy: "#6a303c",
};
export const categories = [
  ["t-shirts", "T-shirts"],
  ["shirts", "Shirts"],
  ["jeans", "Jeans"],
  ["trousers", "Trousers"],
  ["pants", "Pants"],
  ["shalwar-kameez", "Shalwar kameez"],
  ["eastern-wear", "Eastern wear"],
  ["western-wear", "Western wear"],
  ["casual-wear", "Casual wear"],
  ["formal-wear", "Formal wear"],
  ["seasonal", "Seasonal collection"],
  ["traditional", "Traditional wear"],
  ["eastern", "Eastern edit"],
  ["western", "Western edit"],
  ["casual", "Everyday edit"],
  ["formal", "Occasion edit"],
];
export const money = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount / 100);
export function variantStock(p: Product, size: string, color: string) {
  return p.sizes.includes(size) && p.colors.includes(color)
    ? size === "XL" && color === p.colors[1]
      ? 0
      : p.stock
    : 0;
}
export function productImage(p: Product, color = p.colors[0], back = false) {
  return p.images[Math.max(0, p.colors.indexOf(color)) * 2 + (back ? 1 : 0)];
}
