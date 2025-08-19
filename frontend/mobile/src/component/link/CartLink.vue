<template>
	<mm-link :to="{ name: 'Cart' }">
		<i class="ico_cart"></i><strong class="text_badge">{{ count }}</strong><b class="mm_ir-blind">장바구니</b>
	</mm-link>
</template>

<script setup lang='ts'>
	import { useCart } from '$/composables/useCart';

	const { count } = useCart();
</script>