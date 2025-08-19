<template>
	<button
		type="button"
		class="mm_btn T=xs T=support"
		@click="_e => modalVoucherCode(_e, props.voucherCode)"
	>
		<b>일련번호 확인</b>
	</button>
</template>
<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const props = defineProps<{
		voucherCode: string;
	}>();

	const { openModal } = useGlobalPageContext();

	const modalVoucherCode = (_e: MouseEvent, voucherCode: string) => {
		openModal(defineAsyncComponent(() => import('@/page/mypage/order/voucher/code/VoucherCode.vue')), {
			clickElement: _e.currentTarget,
			props: { voucherCode },
		});
	};
</script>