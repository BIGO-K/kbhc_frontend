<template>
	<button
		type="button"
		class="mm_btn T=primary"
		@click.prevent="modalRestockApply"
	>
		<b>재입고 알림받기</b>
	</button>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const { openModal } = useGlobalPageContext();

	function modalRestockApply() {
		const component = defineAsyncComponent(() => import('@/feature/restock/RestockApply.vue'));

		return openModal(component);
	}
</script>