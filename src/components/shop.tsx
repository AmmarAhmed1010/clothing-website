"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Plus,
  Minus,
  Check,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import {
  products,
  categories,
  money,
  colorHex,
  productImage,
  variantStock,
  type Product,
} from "@/lib/catalog";
import { totals, lineKey } from "@/lib/commerce";
import {
  useShop,
  addToCart,
  toggleWishlist,
  updateQuantity,
  clearCart,
} from "@/lib/store";

export function Header() {
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const shop = useShop();
  return (
    <>
      <div className="announcement">
        A wardrobe, considered.{" "}
        <span>Complimentary demo shipping over PKR 10,000</span>
      </div>
      <header className="masthead">
        <div className="masthead-left">
          <button
            ref={menuButton}
            className="icon-button mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <span className="location-label">PAKISTAN / PKR</span>
        </div>
        <Link className="wordmark" href="/" aria-label="FORME home">
          FORME<span>EVERYDAY, WITH INTENTION</span>
        </Link>
        <div className="header-tools">
          <Link className="icon-button" href="/search" aria-label="Search">
            <Search size={19} />
          </Link>
          <Link
            className="icon-button wishlist-tool"
            href="/wishlist"
            aria-label={`Wishlist, ${shop.wishlist.length} items`}
          >
            <Heart size={19} />
          </Link>
          <Link
            className="icon-button bag-tool"
            href="/cart"
            aria-label={`Shopping bag, ${shop.cart.reduce((a, l) => a + l.quantity, 0)} items`}
          >
            <ShoppingBag size={19} />
            <span>{shop.cart.reduce((a, l) => a + l.quantity, 0)}</span>
          </Link>
        </div>
      </header>
      <nav
        className={open ? "retail-nav is-open" : "retail-nav"}
        aria-label="Departments"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            e.currentTarget
              .querySelectorAll("details")
              .forEach((detail) => (detail.open = false));
            menuButton.current?.focus();
          }
        }}
      >
        <Link
          href="/shop"
          onClick={() => setOpen(false)}
          aria-current={path === "/shop" ? "page" : undefined}
        >
          New & considered
        </Link>
        <details className="department-menu">
          <summary>
            Women <ChevronDown size={13} />
          </summary>
          <div className="mega-menu">
            <Link href="/women" onClick={() => setOpen(false)}>
              All womenswear <ArrowUpRight size={16} />
            </Link>
            {categories.slice(5, 11).map(([slug, name]) => (
              <Link
                key={slug}
                href={`/collections/${slug}?gender=women`}
                onClick={() => setOpen(false)}
              >
                {name}
              </Link>
            ))}
            <p>
              Thoughtful pieces.
              <br />
              Your own way of wearing them.
            </p>
          </div>
        </details>
        <details className="department-menu">
          <summary>
            Men <ChevronDown size={13} />
          </summary>
          <div className="mega-menu">
            <Link href="/men" onClick={() => setOpen(false)}>
              All menswear <ArrowUpRight size={16} />
            </Link>
            {categories.slice(0, 7).map(([slug, name]) => (
              <Link
                key={slug}
                href={`/collections/${slug}?gender=men`}
                onClick={() => setOpen(false)}
              >
                {name}
              </Link>
            ))}
            <p>Built around the everyday.</p>
          </div>
        </details>
        <Link href="/collections/eastern" onClick={() => setOpen(false)}>
          The Eastern edit
        </Link>
        <Link href="/collections/seasonal" onClick={() => setOpen(false)}>
          Autumn / Winter ’26
        </Link>
      </nav>
      <div className="shop-status" role="status">
        {shop.notice}
        {shop.storageError &&
          " Browser storage is unavailable; your bag may not survive a reload."}
      </div>
    </>
  );
}

export function ProductCard({ product: p }: { product: Product }) {
  const shop = useShop();
  const saved = shop.wishlist.includes(p.id);
  return (
    <article className="product-card">
      <div className="product-picture">
        <Link href={`/products/${p.slug}`} aria-label={`View ${p.name}`}>
          <Image
            src={p.images[0]}
            alt={`${p.name} — original demo garment illustration`}
            fill
            sizes="(max-width:700px) 45vw, 25vw"
          />
          <Image
            className="alternate-image"
            src={p.images[1]}
            alt=""
            fill
            sizes="(max-width:700px) 45vw, 25vw"
          />
        </Link>
        {p.new && <span className="product-new">NEW SEASON</span>}
        <button
          className={saved ? "product-heart saved" : "product-heart"}
          aria-label={`${saved ? "Unsave" : "Save"} ${p.name}`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(p.id)}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <Link href={`/products/${p.slug}`} className="product-info">
        <h3>{p.name}</h3>
        <span>{money(p.price)}</span>
      </Link>
      <div className="product-meta">
        <span>{p.material}</span>
        <div>
          {p.colors.map((color) => (
            <span
              className="mini-swatch"
              key={color}
              style={{ background: colorHex[color] }}
              title={color}
            />
          ))}
          <span className="swatch-count">{p.colors.length} colours</span>
        </div>
      </div>
    </article>
  );
}

export function ProductList({
  gender = "",
  category = "",
  title = "The full collection",
  wishlist = false,
  search = false,
}: {
  gender?: string;
  category?: string;
  title?: string;
  wishlist?: boolean;
  search?: boolean;
}) {
  const params = useSearchParams();
  const shop = useShop();
  const [query, setQuery] = useState(params.get("q") || "");
  const [filter, setFilter] = useState("all");
  const [maximum, setMaximum] = useState(15000);
  const [sort, setSort] = useState("featured");
  const selectedGender = gender || params.get("gender") || "";
  let list = products.filter(
    (p) =>
      (!selectedGender || p.gender === selectedGender) &&
      (!category ||
        p.category === category ||
        p.collections.includes(category)) &&
      (filter === "all" || p.category === filter) &&
      p.price <= maximum * 100 &&
      (!wishlist || shop.wishlist.includes(p.id)) &&
      `${p.name} ${p.description} ${p.category} ${p.collections.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  list = [...list].sort((a, b) =>
    sort === "low"
      ? a.price - b.price
      : sort === "high"
        ? b.price - a.price
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : Number(b.new) - Number(a.new),
  );
  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <p className="eyebrow">
          FORME /{" "}
          {wishlist
            ? "YOUR PERSONAL EDIT"
            : selectedGender
              ? `${selectedGender.toUpperCase()}WEAR`
              : "THE COLLECTION"}
        </p>
        <h1>{title}</h1>
        <p>
          {wishlist
            ? "The pieces you want to come back to."
            : "Thoughtful shapes. Natural tones. Pieces to make your own."}
        </p>
      </div>
      <div className="collection-chips">
        <Link href="/shop">All pieces</Link>
        <Link href="/women">Women</Link>
        <Link href="/men">Men</Link>
        <Link href="/collections/eastern">Eastern edit</Link>
        <Link href="/collections/seasonal">Seasonal</Link>
      </div>
      <div className="catalog-controls">
        <label className="catalog-search">
          <span>{search ? "Search the collection" : "Find a piece"}</span>
          <div>
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try linen, kurta or denim"
            />
          </div>
        </label>
        <label>
          Category
          <select
            aria-label="Category"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories
              .filter(([slug]) =>
                products.some(
                  (p) =>
                    (!selectedGender || p.gender === selectedGender) &&
                    p.category === slug &&
                    (!category ||
                      p.category === category ||
                      p.collections.includes(category)),
                ),
              )
              .map(([slug, label]) => (
                <option value={slug} key={slug}>
                  {label}
                </option>
              ))}
          </select>
        </label>
        <label className="price-filter">
          Maximum price: {money(maximum * 100)}
          <input
            type="range"
            min="2000"
            max="15000"
            step="500"
            value={maximum}
            onChange={(e) => setMaximum(Number(e.target.value))}
          />
        </label>
        <label>
          Sort by
          <select
            aria-label="Sort by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <div className="catalog-count" role="status">
        {list.length} pieces <span>Original demo catalog illustrations</span>
      </div>
      {wishlist && !shop.ready ? (
        <p className="empty-state">Loading your edit…</p>
      ) : list.length ? (
        <div className="product-grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{wishlist ? "Your edit starts here." : "No pieces found."}</h2>
          <p>
            {wishlist
              ? "Save a piece with the heart icon to build your wishlist."
              : "Try another search or broaden your filters."}
          </p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setFilter("all");
              setMaximum(15000);
            }}
          >
            Reset filters <ArrowRight size={17} />
          </button>
          <Link href="/shop" className="retail-button">
            Explore the collection
          </Link>
        </div>
      )}
    </section>
  );
}

export function ProductDetail({ product: p }: { product: Product }) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState(p.colors[0]);
  const [back, setBack] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const shop = useShop();
  const stock = variantStock(p, size, color);
  const inBag =
    shop.cart.find((l) => l.id === p.id && l.size === size && l.color === color)
      ?.quantity || 0;
  const remaining = stock - inBag;
  function add() {
    if (!size) {
      setFeedback("Choose a size before adding this piece.");
      return;
    }
    if (remaining < quantity) {
      setFeedback("This variant has reached its demo stock limit.");
      return;
    }
    addToCart({ id: p.id, size, color, quantity });
    setFeedback("Added to your bag.");
  }
  return (
    <>
      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-main-image">
            <Image
              src={productImage(p, color, back)}
              alt={`${p.name} in ${color}, ${back ? "back" : "front"} — demo illustration`}
              fill
              loading="eager"
              sizes="(max-width:700px) 100vw, 55vw"
            />
          </div>
          <div className="gallery-switch">
            <button aria-pressed={!back} onClick={() => setBack(false)}>
              Front view
            </button>
            <button aria-pressed={back} onClick={() => setBack(true)}>
              Back view
            </button>
            <span>DEMO GARMENT ILLUSTRATION</span>
          </div>
        </div>
        <div className="product-description">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/shop">Collection</Link>
            <span>/</span>
            <Link href={`/${p.gender}`}>
              {p.gender === "men" ? "Men" : "Women"}
            </Link>
          </nav>
          <p className="eyebrow">THE CONSIDERED WARDROBE</p>
          <h1>{p.name}</h1>
          <p className="detail-price">{money(p.price)}</p>
          <p className="product-description-copy">{p.description}</p>
          <fieldset>
            <legend>Colour — {color}</legend>
            <div className="swatches">
              {p.colors.map((c) => (
                <button
                  key={c}
                  aria-label={`Colour ${c}`}
                  aria-pressed={color === c}
                  className={
                    color === c ? "color-swatch selected" : "color-swatch"
                  }
                  onClick={() => {
                    setColor(c);
                    setFeedback("");
                  }}
                >
                  <span style={{ background: colorHex[c] }} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Size {size && `— ${size}`}</legend>
            <div className="sizes">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  aria-label={`Size ${s}`}
                  aria-pressed={size === s}
                  disabled={!variantStock(p, s, color)}
                  className={size === s ? "selected" : ""}
                  onClick={() => {
                    setSize(s);
                    setFeedback("");
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <details className="size-guide">
              <summary>Size guide</summary>
              <p>
                Demo unisex measurements (chest): XS 84–89cm · S 90–95cm · M
                96–101cm · L 102–107cm · XL 108–113cm. Choose your usual size
                for the intended relaxed fit.
              </p>
            </details>
          </fieldset>
          <div className="add-row">
            <label className="quantity-input">
              Qty
              <select
                aria-label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </label>
            <button
              className="retail-button"
              onClick={add}
              disabled={!!size && remaining === 0}
            >
              {size && remaining === 0 ? "Unavailable" : "Add to bag"}{" "}
              <ShoppingBag size={18} />
            </button>
            <button
              className="icon-button outline-heart"
              aria-label={`Save ${p.name}`}
              aria-pressed={shop.wishlist.includes(p.id)}
              onClick={() => toggleWishlist(p.id)}
            >
              <Heart
                size={20}
                fill={shop.wishlist.includes(p.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <p className="inline-feedback" role="status">
            {feedback}
          </p>
          {feedback === "Added to your bag." && (
            <Link className="text-link" href="/cart">
              View your bag <ArrowRight size={17} />
            </Link>
          )}
          <p className="shipping-note">
            Complimentary demo shipping over PKR 10,000.
            <br />
            Prices are demo prices with no additional simulated tax.
          </p>
          <details className="product-accordion" open>
            <summary>
              Fabric & care <Plus size={16} />
            </summary>
            <p>
              {p.material}. Gentle cold wash with similar colours. Air dry and
              iron on a low setting. Illustrative care guidance for the demo
              catalog.
            </p>
          </details>
          <details className="product-accordion">
            <summary>
              Delivery & returns <Plus size={16} />
            </summary>
            <p>
              This is a storefront demonstration. No physical goods are shipped.
              Demo delivery is PKR 250 for bags below PKR 10,000.
            </p>
          </details>
        </div>
      </section>
      <section className="related-section">
        <div className="simple-heading">
          <h2>Wear it your way.</h2>
          <Link className="text-link" href={`/${p.gender}`}>
            More to discover <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((x) => x.gender === p.gender && x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard product={x} key={x.id} />
            ))}
        </div>
      </section>
    </>
  );
}

export function Cart() {
  const shop = useShop();
  const values = totals(shop.cart, products);
  return (
    <section className="bag-page">
      <p className="eyebrow">YOUR CONSIDERED WARDROBE</p>
      <h1>The shopping bag.</h1>
      {!shop.ready ? (
        <p className="empty-state">Loading your bag…</p>
      ) : !shop.cart.length ? (
        <div className="empty-state">
          <ShoppingBag size={32} />
          <h2>A little room for something good.</h2>
          <p>Your bag is currently empty.</p>
          <Link href="/shop" className="retail-button">
            Explore the collection <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className="bag-layout">
          <div className="bag-items">
            {shop.cart.map((l) => {
              const p = products.find((p) => p.id === l.id)!;
              return (
                <article className="bag-line" key={lineKey(l)}>
                  <Link className="bag-image" href={`/products/${p.slug}`}>
                    <Image
                      src={productImage(p, l.color)}
                      alt={p.name}
                      fill
                      sizes="130px"
                    />
                  </Link>
                  <div>
                    <Link href={`/products/${p.slug}`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p>
                      {l.color} / {l.size}
                    </p>
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease ${p.name}`}
                        onClick={() => updateQuantity(l, l.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-label="Item quantity">{l.quantity}</span>
                      <button
                        aria-label={`Increase ${p.name}`}
                        disabled={
                          l.quantity >= variantStock(p, l.size, l.color)
                        }
                        onClick={() => updateQuantity(l, l.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => updateQuantity(l, 0)}
                    >
                      Remove {p.name}
                    </button>
                  </div>
                  <strong>{money(p.price * l.quantity)}</strong>
                </article>
              );
            })}
            <Link className="text-link" href="/shop">
              Continue discovering <ArrowRight size={17} />
            </Link>
          </div>
          <OrderSummary values={values}>
            <Link href="/checkout" className="retail-button">
              Continue to checkout <ArrowRight size={17} />
            </Link>
          </OrderSummary>
        </div>
      )}
    </section>
  );
}
function OrderSummary({
  values,
  children,
}: {
  values: ReturnType<typeof totals>;
  children?: React.ReactNode;
}) {
  return (
    <aside className="order-summary">
      <h2>Order summary</h2>
      <div>
        <span>Subtotal</span>
        <span>{money(values.subtotal)}</span>
      </div>
      <div>
        <span>Demo delivery</span>
        <span>
          {values.shipping ? money(values.shipping) : "Complimentary"}
        </span>
      </div>
      <div className="order-total">
        <strong>Total</strong>
        <strong>{money(values.total)}</strong>
      </div>
      <p>PKR 250 delivery below PKR 10,000. No additional simulated tax.</p>
      {children}
      <p className="demo-note">Demo storefront. No payments or real orders.</p>
    </aside>
  );
}

export function Checkout() {
  const shop = useShop();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const values = totals(shop.cart, products);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      const order = {
        reference: `FRM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        items: shop.cart.map((l) => ({
          name: products.find((p) => p.id === l.id)!.name,
          size: l.size,
          color: l.color,
          quantity: l.quantity,
          price: products.find((p) => p.id === l.id)!.price,
        })),
        ...values,
      };
      sessionStorage.setItem("forme.order.v1", JSON.stringify(order));
      clearCart();
      router.push("/order-confirmation");
    } catch {
      setError(
        "Unable to save the demo confirmation. Enable browser session storage and try again.",
      );
      setBusy(false);
    }
  }
  return (
    <section className="checkout-page">
      <p className="eyebrow">THE FINAL DETAILS</p>
      <h1>A considered checkout.</h1>
      <div className="checkout-demo">
        <Check size={18} />
        <p>
          This is a demo. No payment is taken and no order is fulfilled. Use
          sample contact details.
        </p>
      </div>
      {!shop.ready ? (
        <p className="empty-state">Loading your bag…</p>
      ) : !shop.cart.length ? (
        <div className="empty-state">
          <h2>Your bag is empty.</h2>
          <Link className="retail-button" href="/shop">
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="bag-layout">
          <form className="checkout-form" onSubmit={submit}>
            <h2>Contact & delivery</h2>
            <div className="form-pair">
              <label>
                First name
                <input
                  name="first"
                  required
                  minLength={2}
                  autoComplete="given-name"
                />
              </label>
              <label>
                Last name
                <input
                  name="last"
                  required
                  minLength={2}
                  autoComplete="family-name"
                />
              </label>
            </div>
            <label>
              Email address
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label>
              Phone number
              <input
                type="tel"
                name="phone"
                required
                pattern="[+0-9 ()-]{7,20}"
                autoComplete="tel"
              />
            </label>
            <label>
              Street address
              <input
                name="address"
                required
                minLength={5}
                autoComplete="street-address"
              />
            </label>
            <div className="form-pair">
              <label>
                City
                <input
                  name="city"
                  required
                  minLength={2}
                  autoComplete="address-level2"
                />
              </label>
              <label>
                Postal code
                <input
                  name="postal"
                  required
                  pattern="[0-9]{5}"
                  autoComplete="postal-code"
                />
              </label>
            </div>
            <label>
              Country
              <select name="country" defaultValue="Pakistan">
                <option>Pakistan</option>
              </select>
            </label>
            <label className="consent">
              <input type="checkbox" required />I understand this is a simulated
              checkout with no payment or fulfillment.
            </label>
            <p className="inline-feedback" role="alert">
              {error}
            </p>
            <button className="retail-button" disabled={busy}>
              {busy ? "Preparing confirmation…" : "Place demo order"}{" "}
              <ArrowRight size={17} />
            </button>
            <p className="shipping-note">
              Contact and delivery details are not saved. Only the demo
              reference, items and totals are kept for this browser session.
            </p>
          </form>
          <OrderSummary values={values}>
            {shop.cart.map((l) => (
              <div className="checkout-item" key={lineKey(l)}>
                <span>
                  {products.find((p) => p.id === l.id)!.name} × {l.quantity}
                  <small>
                    {l.color} / {l.size}
                  </small>
                </span>
                <span>
                  {money(
                    products.find((p) => p.id === l.id)!.price * l.quantity,
                  )}
                </span>
              </div>
            ))}
          </OrderSummary>
        </div>
      )}
    </section>
  );
}

export function Confirmation() {
  const { ready } = useShop();
  let order: null | {
    reference: string;
    items: {
      name: string;
      size: string;
      color: string;
      quantity: number;
      price: number;
    }[];
    total: number;
  } = null;
  if (ready) {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("forme.order.v1") || "null",
      );
      if (
        saved &&
        typeof saved.reference === "string" &&
        Number.isSafeInteger(saved.total) &&
        saved.total >= 0 &&
        Array.isArray(saved.items) &&
        saved.items.length &&
        saved.items.every(
          (i: {
            name?: unknown;
            size?: unknown;
            color?: unknown;
            quantity?: unknown;
            price?: unknown;
          }) =>
            typeof i.name === "string" &&
            typeof i.size === "string" &&
            typeof i.color === "string" &&
            Number.isSafeInteger(i.quantity) &&
            Number(i.quantity) > 0 &&
            Number.isSafeInteger(i.price) &&
            Number(i.price) >= 0,
        )
      )
        order = saved;
    } catch {
      order = null;
    }
  }
  return (
    <section className="confirmation-page">
      <Check className="confirmation-check" size={30} />
      <p className="eyebrow">DEMO ORDER CONFIRMATION</p>
      <h1>{order ? "Beautifully considered." : "Your next piece awaits."}</h1>
      <p>
        {order
          ? "Your simulated order is complete. No payment was taken and no goods will be shipped."
          : "Complete a demo checkout to see your order summary here."}
      </p>
      {order && (
        <div className="confirmation-box">
          <p>REFERENCE / {order.reference}</p>
          {order.items.map((i, index) => (
            <div key={index}>
              <span>
                {i.name}
                <small>
                  {i.color} / {i.size} × {i.quantity}
                </small>
              </span>
              <span>{money(i.price * i.quantity)}</span>
            </div>
          ))}
          <div>
            <strong>Total</strong>
            <strong>{money(order.total)}</strong>
          </div>
        </div>
      )}
      <Link className="retail-button" href="/shop">
        Back to the collection <ArrowRight size={17} />
      </Link>
    </section>
  );
}

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="retail-footer">
      <div className="footer-news">
        <div>
          <p className="eyebrow">NOTES FROM FORME</p>
          <h2>
            A little inspiration,
            <br />
            now and then.
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
          }}
        >
          <label htmlFor="newsletter">Email address</label>
          <div>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="Your email"
            />
            <button aria-label="Preview newsletter signup">
              <ArrowRight size={19} />
            </button>
          </div>
          <p role="status">
            {subscribed
              ? "Demo signup preview. You have not been subscribed."
              : "A demo preview. No emails are collected or sent."}
          </p>
        </form>
      </div>
      <div className="footer-columns">
        <Link className="wordmark" href="/">
          FORME
        </Link>
        <div>
          <h3>The collection</h3>
          <Link href="/women">Women</Link>
          <Link href="/men">Men</Link>
          <Link href="/collections/eastern">Eastern edit</Link>
          <Link href="/collections/seasonal">Seasonal pieces</Link>
        </div>
        <div>
          <h3>Your wardrobe</h3>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Shopping bag</Link>
          <Link href="/search">Find a piece</Link>
        </div>
        <div>
          <h3>A thoughtful demo</h3>
          <p>
            Original catalog illustrations.
            <br />
            Editorial stock photography.
            <br />
            No real payments or fulfillment.
          </p>
        </div>
      </div>
      <div className="footer-legal">
        <span>© 2026 FORME — Fictional retail demonstration</span>
        <span>PAKISTAN / PKR</span>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
