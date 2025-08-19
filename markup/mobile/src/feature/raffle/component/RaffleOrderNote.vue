<template>
	<div class="mm_note T=bg">
		<ul>
			<li>래플 상품은 취소/반품/교환이 불가능합니다.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
	/** 주문/결제 */
	.m_order-agree {
		> .mm_note {
			background-color: #f2f7ff;
			color: var(--color_sub);

			ul {
				li::before {
					background-color: var(--color_sub);
				}
			}
		}
	}
</style>