<template>
	<layout
		title="MY 리뷰"
		layout="popup"
	>
		<tab-router
			class="m_my-tab T=lg"
			:aggregates="Object.values(reviewAggregatesData)"
		></tab-router>
	</layout>
</template>

<script setup lang="ts">
	// import { ref } from 'vue';
	import Layout from '@/component/layout/Layout.vue';
	import TabRouter from '@/component/TabRouter.vue';

	const reviewAggregatesData = {
		writables: 3,
		written: 4,
	};
</script>