<template>
	<layout title="래플">
		<div class="mm_inner m_raffle T=rb">
			<!-- 진행중 래플 -->
			<section class="m_raffle-ongoing">
				<h3 class="mm_strapline">
					<b>래플</b>
					<button
						type="button"
						class="btn_guide"
						@click="_e => overlayRaffleGuide(_e)"
					>
						<b class="mm_ir-blind">래플 안내</b>
						<i class="ico_guide"></i>
					</button>
				</h3>
				<template v-if="ongoingItems.length === 0">
					<p class="mm_text-none T=sm">
						<i class="ico_text-none"></i>{{ endItems.total === 0 ? '진행중인 래플이 없습니다': '등록된 상품이 없습니다' }}
					</p>
				</template>
				<template v-else>
					<ul>
						<li
							v-for="item in ongoingItems"
							:key="item.id"
						>
							<raffle-product-item
								:item="item"
								:is-end="false"
							></raffle-product-item>
						</li>
					</ul>
				</template>
			</section>

			<!-- 종료된 래플 -->
			<section
				v-if="endItems.total > 0"
				class="m_raffle-end"
			>
				<h3 class="mm_strapline">
					<b>종료된 래플</b>
				</h3>
				<ul>
					<li
						v-for="item in endItems.data"
						:key="item.id"
					>
						<raffle-product-item
							:item="item"
							:is-end="item.status === RAFFLE_STATUS.BUY_END"
						></raffle-product-item>
					</li>
				</ul>
			</section>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useRaffle } from '$/composables/useRaffle';
	import Layout from '@/component/layout/Layout.vue';
	import RaffleProductItem from '@/feature/raffle/component/RaffleProductItem.vue';

	const { getList, getEndedList, RAFFLE_STATUS } = useRaffle();

	const ongoingItems = ref(await getList());
	const endItems = ref(await getEndedList());

	const { openOverlay } = useGlobalPageContext();

	const overlayRaffleGuide = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/feature/raffle/RaffleGuide.vue')), {
			clickElement: _e.currentTarget,
		});
	};
</script>

<style src="../_raffle.scss" lang="scss"></style>