<template>
	<div class="mm_loading">
		<div class="mm_loading-inner">
			<p class="">
				결제 결과를 수신 중입니다. 잠시만 기다려주세요.
			</p>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { onMounted } from 'vue';
	import { useRouteParams } from '@vueuse/router';
	import { usePayingProcessContextStore } from '$/stores/usePayingProcessContextStore';
	import { useAppBridge } from '$/composables/useAppBridge';

	const { closeCurrentWebview, isAppUser } = useAppBridge();
	const orderId = useRouteParams<string>('id');
	const { endProcessContext } = usePayingProcessContextStore();

	onMounted(() => {
		endProcessContext(orderId.value);
		if (isAppUser) {
			closeCurrentWebview();
		}

		window.close();
	});
</script>