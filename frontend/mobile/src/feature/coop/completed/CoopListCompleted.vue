<template>
	<div class="mm_inner">
		<template v-if="!pending && coopDealPaginator.total === 0">
			<div class="m_coopbuy-off">
				<p class="mm_text-none">
					<i class="ico_text-none"></i>종료된 <b>공동구매가</b> 없습니다
				</p>
			</div>
		</template>
		<template v-else>
			<infinite-scroll-list
				class="m_coopbuy-off"
				:init-page="initPage"
				:total-count="coopDealPaginator.total"
				:items-per-page="coopDealPaginator.per_page"
				:is-loading="pending"
				:items="displayedItems|| []"
				:ul-class="'m_coopbuy-list'"
				@page-required="nextPage"
			>
				<template #item="{ item: coopDeal }">
					<li v-if="coopDeal">
						<mm-link :to="{ name: 'CoopDetail', params: { id: coopDeal.id } }">
							<figure>
								<lazyload
									class="mm_bg-cover image_product"
									:src="`${coopDeal.thumbnail_url}`"
								></lazyload>
								<figcaption>
									<p class="text_state">
										{{ coopDeal.is_target_achieve ? '목표 달성': '목표 미달성' }}<span>/</span><strong>{{ number(coopDeal.participant_count) }}</strong> 명 참여
									</p>
									<p class="text_brand">
										{{ coopDeal.brand_name }}
									</p>
									<p class="text_product">
										{{ coopDeal.goods_name }}
									</p>
									<p class="text_price">
										<b>공동구매가</b><strong>{{ number(coopDeal.joint_purchase_price ) }}</strong><del><span>{{ number(coopDeal.price) }}</span></del>
									</p>
								</figcaption>
							</figure>
						</mm-link>
					</li>
				</template>
			</infinite-scroll-list>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { useCoopDeal } from '$/composables/useCoopDeal';
	import { useFormatter } from '$/composables/useFormatter';
	import InfiniteScrollList from '@/component/InfiniteScrollList.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const { number } = useFormatter();
	const {
		startContext,
		initPage,
		coopDealPaginator,
		pending,
		displayedItems,
		applyPage,
	} = useCoopDeal(true);

	await startContext();

	async function nextPage(page: number) {
		await applyPage(page);
	}
</script>