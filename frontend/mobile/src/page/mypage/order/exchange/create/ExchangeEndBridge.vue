<template>
	<div class="mm_loading">
		<div class="mm_loading-inner">
			<p class="">
				결과 수신중입니다. 잠시만 기다려주세요.
			</p>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { computed, onMounted } from 'vue';
	import { usePayingProcessContextStore } from '$/stores/usePayingProcessContextStore';
	import { useAppBridge } from '$/composables/useAppBridge';

	const props = defineProps<{
		orderId: string;
		orderItemId: number;
	}>();

	const processId = computed(() => `${props.orderId}_${props.orderItemId}`);

	const { closeCurrentWebview, isAppUser } = useAppBridge();
	const { endProcessContext } = usePayingProcessContextStore();

	endProcessContext(processId.value);

	onMounted(() => {
		if (isAppUser) {
			closeCurrentWebview();
		}

		window.close();
	});
</script>