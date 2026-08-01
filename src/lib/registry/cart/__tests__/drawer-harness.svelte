<script lang="ts">
	import * as Cart from '$lib/components/ui/cart'
</script>

<Cart.Root checkoutUrl="#" lineHref={() => '#'}>
	<Cart.Sheet>
		<Cart.Trigger />
		<Cart.Content>
			<Cart.Header />
			<Cart.Items>
				<Cart.Title />
			</Cart.Items>
			<Cart.Subtotal />
			<Cart.Checkout />
		</Cart.Content>
	</Cart.Sheet>
</Cart.Root>
