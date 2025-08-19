<template>
	<button
		type="button"
		class="mm_btn T=xs T=line"
		@click="cancelReturnOrder"
	>
		<b>반품철회</b>
	</button>
</template>
<script setup lang="ts">
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useMyOrder } from '$/composables/useMyOrder';

	const props = defineProps<{
		returnId: string;
		returnTargetId: number;
	}>();
	const emit = defineEmits<(e: 'onSuccess') => void>();


	const { bom, loading } = useGlobalPageContext();
	const { cancelReturn } = useMyOrder();

	/**
	 * [반품] 철회
	 * @param returnId
	 * @param returnTargetId
	 */
	async function cancelReturnOrder() {
		bom.confirm('반품 신청을 철회하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await cancelReturn(props.returnId, props.returnTargetId);
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