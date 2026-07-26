<script lang="ts">
	import Menu from '$lib/components/ui/customer/menu.svelte'
	import MenuTrigger from '$lib/components/ui/customer/menu-trigger.svelte'
	import MenuContent from '$lib/components/ui/customer/menu-content.svelte'
	import MenuItem from '$lib/components/ui/customer/menu-item.svelte'
</script>

<Menu>
	<MenuTrigger>Account</MenuTrigger>
	<MenuContent>
		<MenuItem href="/account/orders">Orders</MenuItem>
		<MenuItem href="/account/profile">Profile</MenuItem>
	</MenuContent>
</Menu>
