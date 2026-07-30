# sveltekit-medusa-ui

Ready-made, theme-native SvelteKit components for [Medusa](https://medusajs.com) storefronts,
distributed as a [shadcn-svelte](https://shadcn-svelte.com) registry. Every component styles itself
purely through shadcn CSS variables, so it drops into any shadcn-svelte project and inherits its
theme — including dark mode — like a first-party component. Commerce components are wired to the
[`sveltekit-medusa-sdk`](https://www.npmjs.com/package/sveltekit-medusa-sdk) remote functions.

Built for Svelte 5 / SvelteKit. Per-component API documentation is hosted separately.

## Getting started

**Prerequisites:** a shadcn-svelte project (a `components.json`, Tailwind, and the shadcn base
setup). If you don't have one, run `npx shadcn-svelte@latest init` first.

Add a component with the shadcn-svelte CLI, passing the full URL to its registry item:

```bash
# Registry dependencies are resolved and installed automatically.
npx shadcn-svelte@latest add https://pevey.com/r/cart.json
npx shadcn-svelte@latest add https://pevey.com/r/gallery.json
```

Adding `gallery`, for example, also pulls its registry dependencies (`carousel`, `image-zoom`).

**Backend:** the commerce components (`cart`, `cta`, `address`, `checkout`, `auth`, `customer`,
`product`, `reviews`, `search`) expect the SDK configured once via `createMedusaHandle(...)` in your
`hooks.server.ts`. **Theme controls** need `<ModeWatcher />` placed once in your root layout.

## Components

| Component                    | What it is                                                                                                                                                                                                                                  | Registry deps                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `product`                    | Product display (Title/Subtitle/Description/Price/Options/QuantitySelect/JsonLd) over a Medusa `StoreProduct`; URL-driven variant selection, inventory-aware, SSR-safe. Plus `Product.Rating` — the aggregate star summary for the product. | `seo`, `review`                                                                                                    |
| `review`                     | Presentational atom for a single review: default-exported `Review` compound (Title/Rating/Author/Date/Body), `Item`, and `Star`. Renders from a `review` prop or item context — no SDK, no fetching.                                        | —                                                                                                                  |
| `reviews`                    | Compound review collection: `Root` (headless over a `reviews` array, or fetches + sorts + paginates for a product), `Summary` (+ `Histogram`), `Sort`, `List`, `Pagination`, `Carousel`, plus a submission `Form`.                          | `review`, `product`, `carousel`, `button`, `input-text`                                                            |
| `cta`                        | Add-to-cart button + toggle; resolves variant/quantity from `Product` context, pending/success states, optional redirect. Plus `StripeExpressCheckout` — a standalone Apple Pay / Google Pay / Link wallet button.                          | `product`, `button`                                                                                                |
| `cart`                       | Compound cart with a `CartDrawer` preset; reactive, currency-aware, per-part styling.                                                                                                                                                       | `button`, `sheet`                                                                                                  |
| `address`                    | Compound address form (`AddressForm` / `AddressFormCollapsed` presets) that owns cart writes; region switching + optional Google Places autocomplete.                                                                                       | `field`, `input-text`, `input-select-country`, `input-postal-code`, `input-province`, `google-places-autocomplete` |
| `checkout`                   | Compound checkout (address + summary + payment + place order) with three presets: `CheckoutBraintree` (hosted fields), `CheckoutStripe` (Payment Element / card fields), and `CheckoutAuto` (picks the provider from the cart's region).    | `address`, `button`                                                                                                |
| `auth`                       | Login / register / forgot / reset forms + an `Auth.Dialog` (`?auth=` modal).                                                                                                                                                                | `dialog`, `button`, `field`, `label`                                                                               |
| `customer`                   | Shopper identity: `SignedIn`/`SignedOut` gates, account menu, sign-in / sign-out, plus `Customer.Reviews` — the shopper's own reviews across products, with edit + delete.                                                                  | `dropdown-menu`, `button`, `reviews`, `review`, `textarea`, `label`                                                |
| `search`                     | Compound storefront search (Root/Icon/Input/Results/Hit); products-first results, dropdown or full page.                                                                                                                                    | —                                                                                                                  |
| `search-box`                 | Drop-in navbar search box that assembles the search primitives.                                                                                                                                                                             | `search`                                                                                                           |
| `search-dialog`              | Command-palette (⌘/Ctrl-K) search modal.                                                                                                                                                                                                    | `search`, `dialog`                                                                                                 |
| `gallery`                    | Product image gallery/lightbox on embla; optional thumbnail rail + click-to-zoom (`thumbnails`/`zoom` props).                                                                                                                               | `carousel`, `image-zoom`                                                                                           |
| `image-zoom`                 | Standalone click-to-zoom full-screen image overlay with navigation.                                                                                                                                                                         | `button`                                                                                                           |
| `faq`                        | Compound FAQ over the shadcn Accordion.                                                                                                                                                                                                     | `accordion`                                                                                                        |
| `markdown`                   | Themed prose renderer for backend HTML (e.g. the content plugin), with Shiki code styling.                                                                                                                                                  | —                                                                                                                  |
| `seo`                        | Head/metadata primitives: `MetaProvider`, `Metadata` (OpenGraph/Twitter), `JsonLd`. SSR-safe.                                                                                                                                               | —                                                                                                                  |
| `google-places-autocomplete` | Address autocomplete field over Google's `PlaceAutocompleteElement`, themed with shadcn tokens.                                                                                                                                             | —                                                                                                                  |
| `input-text`                 | Text/textarea field bound to a SvelteKit remote-form field, in a shadcn `Field`.                                                                                                                                                            | `field`                                                                                                            |
| `input-select`               | Native select bound to a remote-form field, with data-driven options.                                                                                                                                                                       | `field`                                                                                                            |
| `input-select-country`       | Country select fed from the store's regions (ISO-2 values).                                                                                                                                                                                 | `input-select`                                                                                                     |
| `input-postal-code`          | Postal-code field that uppercases as you type.                                                                                                                                                                                              | `input-text`                                                                                                       |
| `input-province`             | Config-driven province/state field (select where configured, else freeform text).                                                                                                                                                           | `input-select`, `input-text`                                                                                       |
| `theme-button`               | Icon button that toggles light/dark via mode-watcher.                                                                                                                                                                                       | `button`                                                                                                           |
| `theme-toggle`               | Toggle reflecting/flipping the theme.                                                                                                                                                                                                       | `toggle`                                                                                                           |
| `theme-switch`               | Bare switch toggling light/dark (optional settings-form binding).                                                                                                                                                                           | `switch`                                                                                                           |
| `theme-select`               | Light / dark / system dropdown driving `userPrefersMode`.                                                                                                                                                                                   | `select`                                                                                                           |

## Styling individual subcomponents

Components ship as shadcn-style **compound primitives** — an `X.Root` that provides context plus the
parts you compose inside it. **Every part takes a `class`** that is `cn`-merged onto its element, so
you style each piece independently. Layout is child order + flex classes; behavior is props on `Root`.
There are no custom styling CSS variables — parts use the shadcn tokens (`--radius`, `bg-primary`, …)
and inherit your theme.

```svelte
<script lang="ts">
	import * as Gallery from '$lib/components/ui/gallery'
</script>

<Gallery.Root {images} alt="Product" thumbnails="left" zoom>
	<Gallery.Thumbnails class="w-24"><Gallery.ThumbnailImage /></Gallery.Thumbnails>
	<Gallery.Main>
		<Gallery.Carousel><Gallery.Image class="aspect-square rounded-xl object-cover" /></Gallery.Carousel>
		<Gallery.Dots class="mt-3" />
	</Gallery.Main>
</Gallery.Root>
```

Here `zoom` and `thumbnails="left"` are behavior/layout props on `Root`, while `class` on
`Gallery.Thumbnails`, `Gallery.Image`, and `Gallery.Dots` restyles each part in place. The same
pattern applies to every compound component in the registry.

## Credits

`image-zoom` is vendored from **[more-shadcn-svelte](https://github.com/kevwpl/more-shadcn-svelte)**
by kevwpl, used under the MIT License.
