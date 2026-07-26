<script lang="ts">
	import { cn } from '$lib/utils.js'
	import { getCart, updateCartItem, removeFromCart } from 'sveltekit-medusa-sdk'
	import { setCartContext } from './ctx.svelte.js'
	import * as logic from './cart-logic.js'
	import { defaultLineHref } from './cart-logic.js'
	import type { CartQuery, LineHrefFn } from './types.js'
	import type { StoreCart } from '@medusajs/types'
	import type { Snippet } from 'svelte'

	interface Props {
		onupdate?: (cart: StoreCart) => void
		onremove?: (cart: StoreCart) => void
		onerror?: (err: unknown) => void
		checkoutUrl?: string
		lineHref?: LineHrefFn
		class?: string
		children: Snippet
	}
	let {
		onupdate,
		onremove,
		onerror,
		checkoutUrl = '/checkout',
		lineHref = defaultLineHref,
		class: className = '',
		children
	}: Props = $props()

	// Call the query once; read `.current`/`.loading`/`.error` reactively (top-level runs once).
	// The SDK's getCart is a SvelteKit remote query exposing those at runtime, but its built type
	// under-resolves to a bare Promise here, so bridge it to CartQuery.
	const q = getCart() as unknown as CartQuery
	let pending = $state(false)

	async function updateItem(itemId: string, quantity: number) {
		if (pending) return
		pending = true
		try {
			const cart = await updateCartItem({ item_id: itemId, quantity })
			if (cart) onupdate?.(cart)
		} catch (e) {
			onerror?.(e)
		} finally {
			pending = false
		}
	}
	async function removeItem(itemId: string) {
		if (pending) return
		pending = true
		try {
			const cart = await removeFromCart(itemId)
			if (cart) onremove?.(cart)
		} catch (e) {
			onerror?.(e)
		} finally {
			pending = false
		}
	}

	setCartContext({
		get cart() {
			return q.current
		},
		get loading() {
			return q.loading ?? false
		},
		get error() {
			return q.error
		},
		get count() {
			return logic.totalQuantity(q.current)
		},
		get lineCount() {
			return logic.lineCount(q.current)
		},
		get subtotal() {
			return logic.subtotal(q.current)
		},
		get pending() {
			return pending
		},
		get checkoutUrl() {
			return checkoutUrl
		},
		get lineHref() {
			return lineHref
		},
		updateItem,
		removeItem
	})
</script>

<div class={cn('', className)}>
	{@render children()}
</div>
