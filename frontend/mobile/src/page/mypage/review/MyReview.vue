<template>
	<layout
		title="MY 리뷰"
		layout="popup"
	>
		<tab-router
			class="m_my-tab T=lg"
			:aggregates="Object.values(reviewAggregatesData)"
			:is-keep="false"
		></tab-router>
	</layout>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { onBeforeRouteLeave } from 'vue-router';
	import { useReview } from '$/composables/useReview';
	import Layout from '@/component/layout/Layout.vue';
	import TabRouter from '@/component/TabRouter.vue';

	const { aggregateEventBus, getMyReviewAggregate } = useReview();
	const pReviewAggregatesData = await getMyReviewAggregate();
	const reviewAggregatesData = ref(pReviewAggregatesData);

	const eventBusOff = aggregateEventBus.on(async () => {
		try {
			reviewAggregatesData.value = await getMyReviewAggregate();
		}
		catch (e) {
			// console.log(e);
		}
	});

	onBeforeRouteLeave(() => {
		eventBusOff();
	});
</script>