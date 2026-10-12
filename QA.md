# QA evidence

Review date: 10 October 2026. Local Chromium inspection and Playwright verification at 390, 768 and 1440 pixels. See `output/playwright/qa-results.json` for route-level results and `output/playwright/` for full-page screenshots.

## Technical gates

- ESLint: passed.
- TypeScript strict no-emit check: passed.
- Next.js optimized production build: passed; routes prerendered successfully.
- Domain unit tests: 4 commerce tests passed.

## Browser gates

Every application route is checked at the three widths for successful responses, one primary heading, horizontal overflow, control labels and empty button names. Unknown routes are checked for HTTP 404. Page errors and console errors are collected. Representative page types and key flow states are captured.

Checks target practical accessibility: semantic structure, labeled controls, visible keyboard focus, keyboard menus and reduced motion. This is not a full WCAG conformance audit or a measured performance score.

## Refinements made after initial review

Corrected editorial image descriptions, sanitized cart quantities/variants, made confirmation hydration safe and guarded malformed session data. Original garment illustrations provide consistent product imagery and color variants.

## Limitations

No payment or fulfillment. Local storage forme.shop.v1 stores sanitized cart variants and wishlist IDs. Session storage forme.order.v1 stores only reference, products and totals; checkout contact/address fields are not persisted. Replace the local catalog and store with an API and authoritative stock/order/payment services for real commerce.

## Final measured outcomes

- 150 recorded browser checks passed; page/console errors: 0.
- Production HTTP verification: 49 application routes passed, 1749 internal link references resolved to known routes, custom 404 passed.
- Production browser checks passed on the homepage and three representative inner pages: hydration, image decoding and desktop overflow.
- Optimized build output is saved in output/playwright/build-output.txt.
- Mobile menu opens, Escape closes and returns focus, keyboard focus outline, reduced-motion content visible, homepage images load, no failed asset requests.
- Unavailable XL color variant disabled; back gallery updates; category filter and price sort; malformed saved confirmation handled.

## Screenshot index

- [cart-1440.png](output/playwright/cart-1440.png)
- [cart-390.png](output/playwright/cart-390.png)
- [cart-768.png](output/playwright/cart-768.png)
- [cart-filled-1440.png](output/playwright/cart-filled-1440.png)
- [cart-filled-390.png](output/playwright/cart-filled-390.png)
- [checkout-1440.png](output/playwright/checkout-1440.png)
- [checkout-390.png](output/playwright/checkout-390.png)
- [checkout-768.png](output/playwright/checkout-768.png)
- [checkout-filled-1440.png](output/playwright/checkout-filled-1440.png)
- [checkout-filled-390.png](output/playwright/checkout-filled-390.png)
- [collections-eastern-1440.png](output/playwright/collections-eastern-1440.png)
- [collections-eastern-390.png](output/playwright/collections-eastern-390.png)
- [collections-eastern-768.png](output/playwright/collections-eastern-768.png)
- [home-1440.png](output/playwright/home-1440.png)
- [home-390.png](output/playwright/home-390.png)
- [home-768.png](output/playwright/home-768.png)
- [home-desktop-preview.png](output/playwright/home-desktop-preview.png)
- [home-preview.png](output/playwright/home-preview.png)
- [home-production.png](output/playwright/home-production.png)
- [men-1440.png](output/playwright/men-1440.png)
- [men-390.png](output/playwright/men-390.png)
- [men-768.png](output/playwright/men-768.png)
- [order-confirmation-1440.png](output/playwright/order-confirmation-1440.png)
- [order-confirmation-390.png](output/playwright/order-confirmation-390.png)
- [order-confirmation-768.png](output/playwright/order-confirmation-768.png)
- [order-confirmation-filled-1440.png](output/playwright/order-confirmation-filled-1440.png)
- [order-confirmation-filled-390.png](output/playwright/order-confirmation-filled-390.png)
- [products-everyday-tee-1440.png](output/playwright/products-everyday-tee-1440.png)
- [products-everyday-tee-390.png](output/playwright/products-everyday-tee-390.png)
- [products-everyday-tee-768.png](output/playwright/products-everyday-tee-768.png)
- [review-sheet.png](output/playwright/review-sheet.png)
- [search-1440.png](output/playwright/search-1440.png)
- [search-390.png](output/playwright/search-390.png)
- [search-768.png](output/playwright/search-768.png)
- [shop-1440.png](output/playwright/shop-1440.png)
- [shop-390.png](output/playwright/shop-390.png)
- [shop-768.png](output/playwright/shop-768.png)
- [wishlist-1440.png](output/playwright/wishlist-1440.png)
- [wishlist-390.png](output/playwright/wishlist-390.png)
- [wishlist-768.png](output/playwright/wishlist-768.png)
- [women-1440.png](output/playwright/women-1440.png)
- [women-390.png](output/playwright/women-390.png)
- [women-768.png](output/playwright/women-768.png)
