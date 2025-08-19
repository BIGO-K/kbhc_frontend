<template>
	<div class="mm_loading">
		<div class="mm_loading-inner">
			<p class="">
				결제 모듈을 로드 중입니다. 잠시만 기다려주세요.
			</p>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { onMounted, computed } from 'vue';
	import { usePayingProcessContextStore } from '$/stores/usePayingProcessContextStore';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useRouteQueryCast } from '$/composables/useRouteQueryCast';

	const props = defineProps<{
		orderId: string;
		orderItemId: number;
	}>();

	const { showCloseButton, isAppUser } = useAppBridge();
	const { startContext } = usePayingProcessContextStore();
	const { queryToString } = useRouteQueryCast();
	const payingUrl = queryToString('paying_url', '');
	const processId = computed(() => `${props.orderId}_${props.orderItemId}`);

	onMounted(() => {
		/** 주문시작시 주문정보 설정 */
		startContext(processId.value);
		if (isAppUser) {
			showCloseButton();
		}

		location.href = payingUrl;
	});
</script>