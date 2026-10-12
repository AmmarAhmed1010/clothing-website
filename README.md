# FORME

Independent local Next.js application. Fictional fashion storefront with 24 products (12 per gender), 16 collection routes, search, filters, sorting, color/size variants, wishlist, persistent bag, quantity and stock controls, shipping totals, demo checkout and confirmation.

## Run

Prerequisites: Node.js 24 or newer and pnpm. Versions are pinned in package.json and pnpm-lock.yaml. The pnpm workspace policy permits only the sharp and unrs-resolver dependency builds.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:3001. Each project has its own dependencies, configuration and fixed port; all three can run together.

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

Stop the dev server before starting production on the same port.

## Routes and source

49 application routes, plus a custom 404. The complete route list is generated in `src/app/[...slug]/page.tsx`; home is `src/app/page.tsx`. Shared interfaces live in `src/components`, domain data and logic in `src/lib`, tokens and responsive rules in `src/app/globals.css`, and all images/fonts are local in `public/assets` and `public/fonts`.

Page metadata is generated per route. Motion respects reduced motion. No secrets or environment variables are needed for these demos.

## Demo boundary and integration

No payment or fulfillment. Local storage forme.shop.v1 stores sanitized cart variants and wishlist IDs. Session storage forme.order.v1 stores only reference, products and totals; checkout contact/address fields are not persisted. Replace the local catalog and store with an API and authoritative stock/order/payment services for real commerce.

## Review evidence

Read RESEARCH.md, DESIGN.md, ASSETS.md and QA.md. Brand guidance is in docs/brand-guidelines.md. Browser screenshots and machine-readable outcomes are in output/playwright/.
