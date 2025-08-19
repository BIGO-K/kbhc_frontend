<template>
	<div class="mm_inner">
		<template v-if="!pending && coopDealPaginator.total === 0">
			<div class="m_coopbuy-on">
				<p class="mm_text-none">
					<i class="ico_text-none"></i>진행중인 공동구매가 없습니다
				</p>
			</div>
		</template>
		<template v-else>
			<infinite-scroll-list
				class="m_coopbuy-on"
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
									<div class="m_coopbuy-on-progress">
										<p class="text_state">
											<coop-timer :target_at="coopDeal.target_at"></coop-timer>
											<strong
												class="mm_tag"
												:class="{'T=bg T=primary': ! coopDeal.is_target_achieve}"
											>
												{{ coopDeal.is_target_achieve ? '목표 달성': '진행중' }}
											</strong>
										</p>
										<p class="text_goal">
											목표까지<b><strong>{{ number(coopDeal.participant_count) }}<sub>명</sub></strong><span>/</span>{{ number(coopDeal.target_count) }}명</b>
										</p>
										<b class="m...progress-bar">
											<i
												:style="`width:${coopDeal.target_achieve_rate}%`"
												:title="`${coopDeal.target_achieve_rate}%`"
											></i>
										</b>
									</div>
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
						<div class="mm_btn_box">
							<div class="mm_flex T=equal">
								<!-- 공유하기 -->
								<button
									type="button"
									class="mm_btn T=light btn_sns-share"
									@click="shareStore.open"
								>
									<i class="ico_share"></i><b>친구에게 공유하기</b>
								</button>
								<mm-link
									class="mm_btn T=primary btn_coopbuy-entry"
									:to="{ name: 'CoopDetail', params: { id: coopDeal.id } }"
								>
									<b>공동구매 참여하기</b>
								</mm-link>
							</div>
						</div>
					</li>
				</template>
			</infinite-scroll-list>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { useShareStore } from '$/stores/useShareStore';
	import { useCoopDeal } from '$/composables/useCoopDeal';
	import { useFormatter } from '$/composables/useFormatter';
	import InfiniteScrollList from '@/component/InfiniteScrollList.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import CoopTimer from '@/feature/coop/component/CoopTimer.vue';

	const { number } = useFormatter();
	const shareStore = useShareStore();
	const {
		startContext,
		initPage,
		coopDealPaginator,
		pending,
		displayedItems,
		applyPage,
	} = useCoopDeal(false);

	await startContext();

	async function nextPage(page: number) {
		await applyPage(page);
	}
</script>