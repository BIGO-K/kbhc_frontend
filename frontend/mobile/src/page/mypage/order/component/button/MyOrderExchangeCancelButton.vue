<template>
	<button
		type="button"
		class="mm_btn T=xs T=line"
		@click="cancelExchangeOrder"
	>
		<b>교환철회</b>
	</button>
</template>
<script setup lang="ts">
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';

	const props = defineProps<{
		exchangeId: string;
		exchangeTargetId: number;
	}>();
	const emit = defineEmits<(e: 'onSuccess') => void>();

	const { bom, loading } = useGlobalPageContext();
	const { cancelExchange } = useMyOrder();

	/**
	 * [교환] 철회
	 * @param exchangeId
	 * @param exchangeTargetId
	 */
	async function cancelExchangeOrder() {
		bom.confirm('교환 신청을 철회하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await cancelExchange(props.exchangeId, props.exchangeTargetId);
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