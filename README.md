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

| Component                    | What it is                                                                                                                                                                                                                                                                                           | Registry deps                                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `product`                    | Product display (Title/Subtitle/Description/Price/PriceMin/PriceMax/Thumbnail/Options/QuantitySelect/JsonLd) over a Medusa `StoreProduct`; URL-driven variant selection, inventory-aware, SSR-safe. Plus `Product.Card` for grids and `Product.Rating` — the aggregate star summary for the product. | `seo`, `review`, `card`                                                                                            |
| `products`                   | Paginated product listing for category/collection/index pages: `Root` (headless or SDK-fetched, filtered by category/collection/type/q), `Grid` (responsive, `Product.Card` per item), `Pagination`.                                                                                                 | `product`, `page-nav`                                                                                              |
| `categories`                 | Paginated product-category listing: `Root` (headless or SDK-fetched, optional `parentId`), `Grid`, `Card`, `Pagination`.                                                                                                                                                                             | `page-nav`, `card`                                                                                                 |
| `collections`                | Paginated collection listing: `Root` (headless or SDK-fetched), `Grid`, `Card`, `Pagination`.                                                                                                                                                                                                        | `page-nav`, `card`                                                                                                 |
| `page-nav`                   | URL-driven pagination primitives (`Root`/`Prev`/`Next`/`Pages`/`Info`) shared by the three listings; 1-based `?p=` links that preserve other search params.                                                                                                                                          | `button`                                                                                                           |
| `review`                     | Presentational atom for a single review: default-exported `Review` compound (Title/Rating/Author/Date/Body), `Item`, and `Star`. Renders from a `review` prop or item context — no SDK, no fetching.                                                                                                 | —                                                                                                                  |
| `reviews`                    | Compound review collection: `Root` (headless over a `reviews` array, or fetches + sorts + paginates for a product), `Summary` (+ `Histogram`), `Sort`, `List`, `Pagination`, `Carousel`, plus a submission `Form`.                                                                                   | `review`, `product`, `carousel`, `button`, `input-text`                                                            |
| `cta`                        | Add-to-cart button + toggle; resolves variant/quantity from `Product` context, pending/success states, optional redirect. Plus `StripeExpressCheckout` — a standalone Apple Pay / Google Pay / Link wallet button.                                                                                   | `product`, `button`                                                                                                |
| `cart`                       | Compound cart with a `CartDrawer` preset; reactive, currency-aware, per-part styling.                                                                                                                                                                                                                | `button`, `sheet`                                                                                                  |
| `address`                    | Compound address form (`AddressForm` / `AddressFormCollapsed` presets) that owns cart writes; region switching + optional Google Places autocomplete.                                                                                                                                                | `field`, `input-text`, `input-select-country`, `input-postal-code`, `input-province`, `google-places-autocomplete` |
| `checkout`                   | Compound checkout (address + summary + payment + place order) with three presets: `CheckoutBraintree` (hosted fields), `CheckoutStripe` (Payment Element / card fields), and `CheckoutAuto` (picks the provider from the cart's region).                                                             | `address`, `button`                                                                                                |
| `auth`                       | Login / register / forgot / reset forms + an `Auth.Dialog` (`?auth=` modal).                                                                                                                                                                                                                         | `dialog`, `button`, `field`, `label`                                                                               |
| `customer`                   | Shopper identity: `SignedIn`/`SignedOut` gates, account menu, sign-in / sign-out, plus `Customer.Reviews` — the shopper's own reviews across products, with edit + delete.                                                                                                                           | `dropdown-menu`, `button`, `reviews`, `review`, `textarea`, `label`                                                |
| `search`                     | Compound storefront search (Root/Icon/Input/Results/Hit); products-first results, dropdown or full page.                                                                                                                                                                                             | —                                                                                                                  |
| `search-box`                 | Drop-in navbar search box that assembles the search primitives.                                                                                                                                                                                                                                      | `search`                                                                                                           |
| `search-dialog`              | Command-palette (⌘/Ctrl-K) search modal.                                                                                                                                                                                                                                                             | `search`, `dialog`                                                                                                 |
| `gallery`                    | Product image gallery/lightbox on embla; optional thumbnail rail + click-to-zoom (`thumbnails`/`zoom` props).                                                                                                                                                                                        | `carousel`, `image-zoom`                                                                                           |
| `image-zoom`                 | Standalone click-to-zoom full-screen image overlay with navigation.                                                                                                                                                                                                                                  | `button`                                                                                                           |
| `faq`                        | Compound FAQ over the shadcn Accordion.                                                                                                                                                                                                                                                              | `accordion`                                                                                                        |
| `markdown`                   | Themed prose renderer for backend HTML (e.g. the content plugin), with Shiki code styling.                                                                                                                                                                                                           | —                                                                                                                  |
| `seo`                        | Head/metadata primitives: `MetaProvider`, `Metadata` (OpenGraph/Twitter), `JsonLd`. SSR-safe.                                                                                                                                                                                                        | —                                                                                                                  |
| `google-places-autocomplete` | Address autocomplete field over Google's `PlaceAutocompleteElement`, themed with shadcn tokens.                                                                                                                                                                                                      | —                                                                                                                  |
| `input-text`                 | Text/textarea field bound to a SvelteKit remote-form field, in a shadcn `Field`.                                                                                                                                                                                                                     | `field`                                                                                                            |
| `input-select`               | Native select bound to a remote-form field, with data-driven options.                                                                                                                                                                                                                                | `field`                                                                                                            |
| `input-select-country`       | Country select fed from the store's regions (ISO-2 values).                                                                                                                                                                                                                                          | `input-select`                                                                                                     |
| `input-postal-code`          | Postal-code field that uppercases as you type.                                                                                                                                                                                                                                                       | `input-text`                                                                                                       |
| `input-province`             | Config-driven province/state field (select where configured, else freeform text).                                                                                                                                                                                                                    | `input-select`, `input-text`                                                                                       |
| `theme-button`               | Icon button that toggles light/dark via mode-watcher.                                                                                                                                                                                                                                                | `button`                                                                                                           |
| `theme-toggle`               | Toggle reflecting/flipping the theme.                                                                                                                                                                                                                                                                | `toggle`                                                                                                           |
| `theme-switch`               | Bare switch toggling light/dark (optional settings-form binding).                                                                                                                                                                                                                                    | `switch`                                                                                                           |
| `theme-select`               | Light / dark / system dropdown driving `userPrefersMode`.                                                                                                                                                                                                                                            | `select`                                                                                                           |

## Product cards and listings

`Product.Root` (a detail page) keeps variant selection in the URL — `?v=`, so it is shareable and
back-button-correct. `Product.Card` is its **sibling**, not a wrapper: it provides the same
`ProductContext` in **local** mode, seeded to the cheapest purchasable variant. That is what lets a
grid of cards each track their own variant, lets swatches inside a card swap in place instead of
navigating, and lets every existing part (`Title`, `Price`, `PriceMin`, `Rating`, …) work in either
place unchanged.

Because the card provides that context, an add-to-cart button inside it needs **no props** — it
reads the card's variant itself:

```svelte
<script lang="ts">
	import * as Products from '$lib/components/ui/products'
	import * as Product from '$lib/components/ui/product'
	import { AddToCartButton } from '$lib/components/ui/cta'
</script>

<Products.Root categoryId={category.id} pageSize={12}>
	{#snippet children({ count })}
		<p>{count} products</p>
		<Products.Grid class="lg:grid-cols-2 xl:grid-cols-3">
			{#snippet children({ product })}
				<Product.Card {product}>
					{#snippet actions()}<AddToCartButton />{/snippet}
				</Product.Card>
			{/snippet}
		</Products.Grid>
		<Products.Pagination />
	{/snippet}
</Products.Root>
```

The button is **composed in** rather than built into the card on purpose: `cta` already declares
`product` as a registry dependency, so a button baked into `product` would be a dependency cycle.

Medusa has no product-level price (prices are per variant), so a range renders as two separate
parts — `Product.PriceMin` and `Product.PriceMax` — which you lay out and style however you want,
rather than a single pre-formatted "$20 – $45" string.

`Categories` and `Collections` have the same `Root` / `Grid` / `Card` / `Pagination` shape. Their
cards read an image from `metadata.thumbnail` (change the key with `imageKey`, or replace the
rendering with an `image` snippet), because neither entity has an image field in Medusa; without
it the card degrades to text.

All three listings put the page in the URL as a **1-based** `?p=` param (page 1 omits it), so
page 2 of a category is a real, indexable, linkable URL. The short name matches the package's other
URL params — `?v=` for variant, `?q=` for query — and avoids reading as SvelteKit's `page`. Pass
`pageParam` if two listings share a page.

## Subcomponents or your own markup

Every listing supports both, and you pick per listing — the `Root` is the same either way. It
fetches, paginates, and publishes context; what renders the items is up to you.

**With subcomponents.** `Grid` reads the page off the context and renders a `Card` per item, so the
listing is four tags:

```svelte
<Collections.Root pageSize={12}>
	{#snippet children({ count })}
		<p>{count} collections</p>
		<Collections.Grid>
			{#snippet empty()}<p>No collections found.</p>{/snippet}
		</Collections.Grid>
		<Collections.Pagination />
	{/snippet}
</Collections.Root>
```

You still control the look: `class` on `Grid` overrides the default 1/2/3/4 breakpoint columns, and
`Card` takes `class`, `href`, `imageKey`, and an `image` snippet.

**With your own markup.** Take the items off the `Root`'s render-prop and skip `Grid` and `Card`
entirely — here a list instead of a grid:

```svelte
<Categories.Root pageSize={12}>
	{#snippet children({ categories, count, loading })}
		<p>{loading ? 'Loading…' : `${count} categories`}</p>

		{#if categories.length}
			<ul class="divide-y rounded-lg border">
				{#each categories as category (category.id)}
					<li>
						<a href="/categories/{category.handle}" class="block p-4 hover:bg-accent">{category.name}</a>
					</li>
				{/each}
			</ul>
		{:else if !loading}
			<p>No categories found.</p>
		{/if}

		<Categories.Pagination />
	{/snippet}
</Categories.Root>
```

Note `Pagination` works in both — it reads the same context, so replacing the item rendering never
costs you the paging. Two things do become yours in the headless version:

- **The empty state.** There is no `Grid`, so there is no `empty` snippet. Guard on `loading` as
  above, or "no results" flashes before the first fetch resolves.
- **The item URL.** `Card` builds hrefs from the `href` you set on `Root`; hand-written markup
  doesn't see it, so a custom `href` on the `Root` won't apply unless you call
  `getCategoriesContext()` yourself.

There is a middle rung too: keep `Grid` for the responsive shell and pass a `children` snippet to
replace only the per-item rendering.

```svelte
<Products.Grid class="lg:grid-cols-2">
	{#snippet children({ product })}<MyCard {product} />{/snippet}
</Products.Grid>
```

All three are live in the demo storefront — `collections-demo` (subcomponents), `categories-demo`
(headless), `products-demo` (both, plus the per-item snippet).

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
