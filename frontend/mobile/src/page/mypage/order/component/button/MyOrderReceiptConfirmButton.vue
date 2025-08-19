<template>
	<button
		type="button"
		class="mm_btn T=xs T=light"
		@click="confirmOrderReceipt"
	>
		<b>수취확인</b>
	</button>
</template>
<script setup lang="ts">
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';

	const props = defineProps<{
		orderItemId: number;
	}>();

	const emit = defineEmits<(e: 'onSuccess') => void>();

	const { bom, loading } = useGlobalPageContext();
	const { confirmReceipt } = useMyOrder();

	/**
	 * 수취확인처리
	 * @param orderItemId
	 */
	function confirmOrderReceipt() {
		bom.confirm('수취 확인 시 배송 완료 처리되며 되돌릴 수 없습니다. 수취 확인을 하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await confirmReceipt(props.orderItemId);
				emit('onSuccess');
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	}
</script>