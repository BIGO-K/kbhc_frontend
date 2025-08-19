<template>
	<p
		v-if="items.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>집계된 브랜드가 없습니다
	</p>

	<div
		v-else
		class="mm_inner m_ranking-brand"
	>
		<!-- 랭킹 상단 -->
		<div class="m_ranking-head">
			<div class="m_ranking-head-update">
				<p class="text_update">
					<span>2023.00.00</span>기준
				</p>
				<toggle
					v-model:is-active="isTooltipActive"
					class="btn_help"
					parent-selector=".m_ranking-head-update"
				>
					<i class="ico_tooltip-notice"></i>
				</toggle>
				<div class="m...update-tooltip">
					<p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)산정기간: 2021.12.26. 00:00~23:59</p>
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
			>
				<option>일간</option>
				<option>주간</option>
				<option>월간</option>
			</form-select>
		</div>

		<!-- 브랜드 랭킹 리스트 -->
		<div class="m_ranking-brand-list">
			<ol>
				<li>
					<mm-link
						class="btn_brand"
						:to="{ name: 'BrandShop', params: { id: 123 } }"
					>
						<b class="text_rank">
							<span class="text_rank-up">
								<i
									class="ico_rank-up"
									title="상승"
								></i>8
							</span>
						</b>
						<b>게스진</b>
						<i class="ico_link"></i>
					</mm-link>
					<div class="mm_product-list">
						<div class="mm_scroller T=x">
							<ol>
								<li
									v-for="item in productItems"
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
														<strong>{{ number(item.price) }}</strong>
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
				<li>
					<mm-link
						class="btn_brand"
						:to="{ name: 'BrandShop', params: { id: 123 } }"
					>
						<b class="text_rank">
							<span class="text_rank-down">
								<i
									class="ico_rank-down"
									title="하락"
								></i>1
							</span>
						</b>
						<b>앤아더스토리즈</b>
						<i class="ico_link"></i>
					</mm-link>
					<div class="mm_product-list">
						<div class="mm_scroller T=x">
							<ol>
								<li
									v-for="item in productItems"
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
														<strong>{{ number(item.price) }}</strong>
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
				<li>
					<mm-link
						class="btn_brand"
						:to="{ name: 'BrandShop', params: { id: 123 } }"
					>
						<b class="text_rank">
							<i
								class="ico_rank-unchanged"
								title="변동없음"
							></i>
						</b>
						<b>라코스테</b>
						<i class="ico_link"></i>
					</mm-link>
					<div class="mm_product-list">
						<div class="mm_scroller T=x">
							<ol>
								<li
									v-for="item in productItems"
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
														<strong>{{ number(item.price) }}</strong>
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
				<li>
					<mm-link
						class="btn_brand"
						:to="{ name: 'BrandShop', params: { id: 123 } }"
					>
						<b class="text_rank">
							<i
								class="ico_rank-new"
								title="신규"
							></i>
						</b>
						<b>발몽</b>
						<i class="ico_link"></i>
					</mm-link>
					<div class="mm_product-list">
						<div class="mm_scroller T=x">
							<ol>
								<li
									v-for="item in productItems"
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
														<strong>{{ number(item.price) }}</strong>
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
				<li>
					<mm-link
						class="btn_brand"
						:to="{ name: 'BrandShop', params: { id: 123 } }"
					>
						<b class="text_rank">
							<i
								class="ico_rank-new"
								title="신규"
							></i>
						</b>
						<b>COS</b>
						<i class="ico_link"></i>
					</mm-link>
					<div class="mm_product-list">
						<div class="mm_scroller T=x">
							<ol>
								<li
									v-for="item in productItems"
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
														<strong>{{ number(item.price) }}</strong>
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

<script setup lang="ts">
	import { ref } from 'vue';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const { number } = useFormatter();

	const productItems = useFakeCreator().goods(4);// XXX 상품 임시 생성

	const isTooltipActive = ref(false);

	const sortDate = ref('');
	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>