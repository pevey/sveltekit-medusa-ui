# sveltekit-medusa-ui

Ready-made, theme-native SvelteKit components for Medusa storefronts, distributed as a
[shadcn-svelte](https://shadcn-svelte.com) registry. Every component styles itself purely through
shadcn CSS variables, so it drops into any shadcn-svelte project and inherits its theme (including
dark mode) like a first-party component.

Add a component with the shadcn-svelte CLI:

```bash
npx shadcn-svelte@latest add <registry-url>/gallery2
```

## Components

Each component ships as shadcn-style **compound primitives** (`X.Root` + parts) _and_ thin numbered **presets**
(`X1`, `X2`, …) that compose them. A **new number** is only introduced for a different installed dependency or
composition; layout, position, breakpoint visibility, and per-part styling are **composition + `class`**, not props.

| Component    | Kind       | Features                                                                                                                                                | Registry deps           |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `gallery`    | primitives | `Gallery.Root` + `.Carousel`/`.Image`/`.Thumbnails`/`.ThumbnailImage`/`.Dots` on embla, sharing a context. Compose freely; style each part via `class`. | `carousel`              |
| `gallery1`   | preset     | Batteries-included: thumbnails (`left`/`right`/`bottom`/`none`), mobile peek + dots, embla passthrough, `filterString`, bindable selected index.        | `gallery`               |
| `gallery2`   | preset     | `gallery1` **plus** click-to-zoom overlay.                                                                                                              | `gallery`, `image-zoom` |
| `image-zoom` | primitive  | Standalone click-to-zoom full-screen overlay with gallery navigation.                                                                                   | `button`                |
| `markdown`   | component  | Themed prose renderer for backend-rendered HTML.                                                                                                        | —                       |

### Compound usage

```svelte
<script lang="ts">
	import * as Gallery from '$lib/components/ui/gallery'
</script>

<Gallery.Root {images} alt="Product" class="flex-row">
	<Gallery.Thumbnails class="hidden w-20 md:flex"><Gallery.ThumbnailImage /></Gallery.Thumbnails>
	<div class="flex min-w-0 flex-1 flex-col">
		<Gallery.Carousel><Gallery.Image class="aspect-square object-cover" /></Gallery.Carousel>
		<Gallery.Dots class="mt-3 flex md:hidden" />
	</div>
</Gallery.Root>
```

Position = child order + a flex-direction class on `Gallery.Root`; breakpoint visibility = responsive classes on
`Gallery.Thumbnails`/`Gallery.Dots`; per-part styling = each part's `class`. No position/breakpoint props on the
primitives, and no custom styling CSS vars — reuse the shadcn tokens (`--radius`, `bg-primary`, …). For custom
per-image rendering: `<Gallery.Image>{#snippet child({ src, alt })}…{/snippet}</Gallery.Image>`.

### Preset props (`Gallery1` / `Gallery2`)

| Prop                  | Type                                      | Default    | Notes                                                                                   |
| --------------------- | ----------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `images`              | `(string \| StoreProductImage)[]`         | —          | URL strings or Medusa image objects (uses `.url`).                                      |
| `filterString`        | `string`                                  | —          | Keep only images whose URL includes this substring; falls back to all if none match.    |
| `thumbnails`          | `'left' \| 'right' \| 'bottom' \| 'none'` | `'bottom'` | Rail position (`left`/`right` = vertical rail).                                         |
| `thumbnailBreakpoint` | `'sm' \| 'md' \| 'lg' \| 'xl'`            | `'md'`     | At/above this width the rail shows; below it, mobile peek + dots.                       |
| `peek`                | `string \| false`                         | `'85%'`    | Mobile main-image width; remainder reveals the next image. `false` = full width + dots. |
| `alt`                 | `string`                                  | `''`       | Fallback alt text.                                                                      |
| `class`               | `string`                                  | `''`       | Merged onto the root flex container.                                                    |
| `opts`                | `EmblaOptionsType`                        | —          | Embla passthrough (`loop`, `align`, `dragFree`, …).                                     |
| `plugins`             | `EmblaPluginType[]`                       | —          | Embla plugins, e.g. `embla-carousel-autoplay` (install the plugin yourself).            |
| `api`                 | `CarouselAPI` (`$bindable`)               | —          | The main embla api.                                                                     |
| `selectedIndex`       | `number` (`$bindable`)                    | `0`        | The selected image index — bind to observe/drive selection.                             |

## Theme switchers

Four light/dark theme controls built on **[`mode-watcher`](https://github.com/svecosystem/mode-watcher)** (installed
automatically). **Setup:** place **`<ModeWatcher />`** once in your root layout (`+layout.svelte`) — it seeds the theme
from the OS/cookie and persists changes. Each control changes the theme immediately on interaction.

| Component      | Kind     | Notes                                                                                                                                                                          | Registry deps |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `theme-button` | `Button` | Icon button; toggles. Props: `size`, `variant` (default `ghost`), `class`, `sun`/`moon` snippets.                                                                              | `button`      |
| `theme-toggle` | `Toggle` | `pressed = mode === onMode`; icon + text `label` (default `"Mode"`). Props: `size`, `variant` (default `outline`), `onMode` (default `light`), `label`, `class`, `sun`/`moon`. | `toggle`      |
| `theme-switch` | `Switch` | Bare switch (no label — wrap in `Field` if you want one). `checked = mode === onMode`. Props: `onMode` (default `light`), `size`, `class`, `aria-label`, `form?`, `field?`.    | `switch`      |
| `theme-select` | `Select` | Bare **light / dark / system** dropdown (the only 3-state control) driving `userPrefersMode`. Props: `size`, `class`, `aria-label`, `form?`, `field?`.                         | `select`      |

- **`onMode`** (`theme-toggle`/`theme-switch`): which mode counts as _on_ (default `'light'` → on = light, off = dark; set `'dark'` to reverse).
- **Icons** (`theme-button`/`theme-toggle`) reflect the current mode (sun = light, moon = dark); override with `sun`/`moon` snippets.
- **`form` + `field`** (`theme-switch`/`theme-select`) is _optional and additive_ — for wiring the control into a SvelteKit remote-function settings form; it never replaces the immediate theme change.

## Credits

`image-zoom` is from **[more-shadcn-svelte](https://github.com/kevwpl/more-shadcn-svelte)**
by kevwpl, used under the MIT License.
