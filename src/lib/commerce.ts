export type CartLine = {
  id: string;
  size: string;
  color: string;
  quantity: number;
};
export type CatalogItem = {
  id: string;
  price: number;
  sizes: string[];
  colors: string[];
  stock: number;
};
export const lineKey = (line: Pick<CartLine, "id" | "size" | "color">) =>
  `${line.id}:${line.size}:${line.color}`;
export function available(p: CatalogItem, size: string, color: string) {
  return p.sizes.includes(size) && p.colors.includes(color)
    ? size === "XL" && color === p.colors[1]
      ? 0
      : p.stock
    : 0;
}
export function sanitizeCart(raw: unknown, catalog: CatalogItem[]): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const result: CartLine[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const p = catalog.find((p) => p.id === row.id);
    if (
      !p ||
      typeof row.size !== "string" ||
      typeof row.color !== "string" ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1
    )
      continue;
    const stock = available(p, row.size, row.color);
    if (!stock) continue;
    const existing = result.find((l) => lineKey(l) === lineKey(row));
    if (existing)
      existing.quantity = Math.min(stock, existing.quantity + row.quantity);
    else
      result.push({
        id: p.id,
        size: row.size,
        color: row.color,
        quantity: Math.min(stock, row.quantity),
      });
  }
  return result;
}
export function addLine(
  cart: CartLine[],
  line: CartLine,
  catalog: CatalogItem[],
) {
  return sanitizeCart([...cart, line], catalog);
}
export function totals(cart: CartLine[], catalog: CatalogItem[]) {
  const subtotal = sanitizeCart(cart, catalog).reduce(
    (sum, l) => sum + catalog.find((p) => p.id === l.id)!.price * l.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= 1000000 ? 0 : 25000;
  return { subtotal, shipping, total: subtotal + shipping };
}
