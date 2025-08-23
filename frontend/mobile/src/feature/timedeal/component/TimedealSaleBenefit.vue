<template>
	<dl class="text_timesale">
		<dt>타임특가 쿠폰할인</dt>
		<dd class="text_price">
			<span>{{ `- ${number(timeSaleAmount)}` }}</span>
		</dd>
	</dl>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	defineProps<{
		timeSaleAmount: number;
	}>();
	const { number } = useFormatter();
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/function';

	/** 상품상세 */
	.m_prodetail-head-benefit {
		#{function.escape('.m...benefit-detail')} {
			dl {
				&.text_timesale {
					color: var(--color_sub);

					.text_price {
						span {
							color: var(--color_sub);
						}
					}
				}
			}
		}
	}
</style>