<template>
	<template v-if="rankingBrand.brand_list.length === 0">
		<p class="mm_text-none">
			<i class="ico_text-none"></i>집계된 브랜드가 없습니다
		</p>
	</template>
	<template v-else>
		<div class="mm_inner m_ranking-brand">
			<!-- 랭킹 상단 -->
			<div class="m_ranking-head">
				<div class="m_ranking-head-update">
					<p class="text_update">
						<span>{{ rankingBrand.target_date }}</span>기준
					</p>
					<toggle
						v-model:is-active="isTooltipActive"
						class="btn_help"
						parent-selector=".m_ranking-head-update"
					>
						<i class="ico_tooltip-notice"></i>
					</toggle>
					<div class="m...update-tooltip">
						<p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)산정기간: {{ rankingPeriod }}</p>
						<button
							type="button"
							class="btn_close"
							@click="isTooltipActive = false"
						>
							<i class="ico_tooltip-close"></i><b class="mm_ir-blind">닫기</b>
						</button>
					</div>
				</div>
				<form-select
					v-model="sortDate"
					title="조회기간"
					:use-overlay="true"
				>
					<option value="D">
						일간
					</option>
					<option value="W">
						주간
					</option>
					<option value="M">
						월간
					</option>
				</form-select>
			</div>

			<!-- 브랜드 랭킹 리스트 -->
			<div class="m_ranking-brand-list">
				<ol>
					<li
						v-for="brand in rankingBrand.brand_list"
						:key="brand.id"
					>
						<mm-link
							class="btn_brand"
							:to="{ name: 'BrandShop', params: { id: brand.id } }"
						>
							<ranking-rank
								:rank="brand.rank"
								:change_type="brand.change_type"
								:change_value="brand.change_value"
							></ranking-rank>
							<b>{{ brand.name }}</b>
							<i class="ico_link"></i>
						</mm-link>
						<div class="mm_product-list">
							<div class="mm_scroller T=x">
								<ol>
									<li
										v-for="item in brand.goods_list"
										:key="item.id"
									>
										<div class="mm_product-item">
											<mm-link :to="{ name: 'ProductDetail', params: { id: item.id } }">
												<figure>
													<div class="mm_product-item-image">
														<lazyload
															class="mm_bg-cover image_product"
															:src="item.thumbnail_url"
														></lazyload>
													</div>
													<figcaption>
														<p class="mm_ir-blind">
															{{ item.name }}
														</p>
														<p class="text_price">
															<strong>{{ number(item.base_discounted_price) }}</strong>
														</p>
													</figcaption>
												</figure>
											</mm-link>
										</div>
									</li>
								</ol>
							</div>
						</div>
					</li>
				</ol>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useRanking } from '$/composables/useRanking';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import RankingRank from '@/feature/ranking/component/RankingRank.vue';

	const { number } = useFormatter();
	const { getRankingBrand, getRankPeriod } = useRanking();

	const isTooltipActive = ref(false);
	const sortDate = ref<RankRange>('D');
	const rankingBrand = ref(await getRankingBrand(sortDate.value));
	const rankingPeriod = ref(await getRankPeriod(sortDate.value, rankingBrand.value.target_date));

	watch(sortDate, async () => {
		rankingBrand.value = await getRankingBrand(sortDate.value);
		rankingPeriod.value = await getRankPeriod(sortDate.value, rankingBrand.value.target_date);
	});
</script>