<template>
	<p
		v-if="items.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>집계된 상품이 없습니다
	</p>

	<template v-else>
		<!-- 아이템 랭킹 -->
		<section class="mm_inner m_ranking-item">
			<h3><b>아이템 랭킹</b></h3>
			<!-- 상품리스트 -->
			<div class="mm_product-list T=card">
				<ol>
					<li
						v-for="item in 5"
						:key="item"
					>
						<p class="text_rank">
							<span
								v-if="testItems[item].change_type === 'U' || testItems[item].change_type === 'D'"
								:class="testItems[item].change_type === 'U' ? 'text_rank-up' : 'text_rank-down'"
							>
								<i
									:class="testItems[item].change_type === 'U' ? 'ico_rank-up' : 'ico_rank-down'"
									:title="testItems[item].change_type === 'U' ? '상승' : '하락'"
								></i>{{ testItems[item].change_value }}
							</span>
							<i
								v-else
								:class="testItems[item].change_type === 'N' ? 'ico_rank-new' : 'ico_rank-unchanged'"
								:title="testItems[item].change_type === 'N' ? '신규' : '변동없음'"
							></i>
						</p>
						<product-item
							class="T=pa"
							:goods="testItems[item]"
							:usable="{
								keys: ['review_count', 'price', 'badges'],
								isReverse: true,
							}"
						></product-item>
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingProduct' }"
						>
							<b>BEST 아이템 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</section>

		<!-- 브랜드 랭킹 -->
		<section class="mm_inner m_ranking-brand">
			<h3><b>브랜드 랭킹</b></h3>
			<div class="m_ranking-brand-list">
				<ol>
					<li>
						<button
							type="button"
							class="btn_brand"
						>
							<b>게스진</b>
							<b class="text_rank">
								<span class="text_rank-up">
									<i
										class="ico_rank-up"
										title="상승"
									></i>8
								</span>
							</b>
						</button>
						<div class="mm_product-list">
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
					</li>
					<li class="S=brand-on">
						<button
							type="button"
							class="btn_brand"
						>
							<b>앤아더스토리즈</b>
							<b class="text_rank">
								<span class="text_rank-down">
									<i
										class="ico_rank-down"
										title="하락"
									></i>1
								</span>
							</b>
						</button>
						<div class="mm_product-list">
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
					</li>
					<li>
						<button
							type="button"
							class="btn_brand"
						>
							<b>라코스테</b>
							<b class="text_rank">
								<i
									class="ico_rank-new"
									title="신규"
								></i>
							</b>
						</button>
						<div class="mm_product-list">
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
					</li>
					<li>
						<button
							type="button"
							class="btn_brand"
						>
							<b>0914</b>
							<b class="text_rank">
								<i
									class="ico_rank-unchanged"
									title="변동없음"
								></i>
							</b>
						</button>
						<div class="mm_product-list">
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
					</li>
					<li>
						<button
							type="button"
							class="btn_brand"
						>
							<b>발몽</b>
							<b class="text_rank">
								<i
									class="ico_rank-new"
									title="신규"
								></i>
							</b>
						</button>
						<div class="mm_product-list">
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
					</li>
					<li>
						<button
							type="button"
							class="btn_brand"
						>
							<b>COS</b>
							<b class="text_rank">
								<i
									class="ico_rank-new"
									title="신규"
								></i>
							</b>
						</button>
						<div class="mm_product-list">
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
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingBrand' }"
						>
							<b>BEST 브랜드 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</section>

		<!-- 뷰 랭킹 -->
		<section class="mm_inner m_ranking-view">
			<h3><b>View 랭킹</b></h3>
			<!-- 상품리스트 -->
			<div class="mm_product-list T=card">
				<ol>
					<li
						v-for="item in 6"
						:key="item"
					>
						<p class="text_rank">
							<span
								v-if="testItems[item].change_type === 'U' || testItems[item].change_type === 'D'"
								:class="testItems[item].change_type === 'U' ? 'text_rank-up' : 'text_rank-down'"
							>
								<i
									:class="testItems[item].change_type === 'U' ? 'ico_rank-up' : 'ico_rank-down'"
									:title="testItems[item].change_type === 'U' ? '상승' : '하락'"
								></i>{{ testItems[item].change_value }}
							</span>
							<i
								v-else
								:class="testItems[item].change_type === 'N' ? 'ico_rank-new' : 'ico_rank-unchanged'"
								:title="testItems[item].change_type === 'N' ? '신규' : '변동없음'"
							></i>
						</p>
						<product-item
							class="T=pa"
							:goods="testItems[item]"
							:usable="{
								keys: ['review_count', 'price', 'badges', 'base_discounted_price', 'sale_rate', 'brand_name', 'is_soldout', 'is_use_stock_notify'],
								isReverse: true
							}"
							:use-wish="false"
						></product-item>
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingView' }"
						>
							<b>BEST VIEW 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</section>

		<!-- 찜 랭킹 -->
		<section class="mm_inner m_ranking-like">
			<h3><b>찜 랭킹</b></h3>
			<!-- 상품리스트 -->
			<div class="mm_product-list">
				<ol>
					<li
						v-for="(item, i) in testItems"
						:key="item.id"
					>
						<p class="text_rank">
							<span
								v-if="item.change_type === 'U' || item.change_type === 'D'"
								:class="item.change_type === 'U' ? 'text_rank-up' : 'text_rank-down'"
							>
								<i
									:class="item.change_type === 'U' ? 'ico_rank-up' : 'ico_rank-down'"
									:title="item.change_type === 'U' ? '상승' : '하락'"
								></i>{{ item.change_value }}
							</span>
							<i
								v-else
								:class="item.change_type === 'N' ? 'ico_rank-new' : 'ico_rank-unchanged'"
								:title="item.change_type === 'N' ? '신규' : '변동없음'"
							></i>
						</p>
						<product-item
							class="T=pa"
							:goods="item"
							:usable="{
								keys: ['review_count', 'price', 'badges'],
								isReverse: true
							}"
							:use-wish="false"
						></product-item>
						<p class="text_like">
							<i :class="i < 3 ? 'ico_like-fill' : 'ico_like'"></i><span>{{ i < 3 ? item.wish_count : item.wish_count > 999 ? '999+' : item.wish_count }}</span>
						</p>
					</li>
				</ol>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=xs T=line btn_more"
							:to="{ name: 'RankingWishlist' }"
						>
							<b>BEST 찜 더보기</b><i class="ico_link"></i>
						</mm-link>
					</div>
				</div>
			</div>
		</section>
	</template>
</template>

<script setup lang="ts">
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';

	const { number } = useFormatter();

	const productItems = useFakeCreator().goods(3);// XXX 상품 임시 생성
	type change_type = 'U' | 'D' | 'N' | '';// TODO 타입 불러오기 확인
	const changeTypes = ['U', 'D', 'N', ''];

	const testItems = (useFakeCreator().goods(7) as unknown[] as (Goods & HasRank)[]).map((_item, _i) => {
		_item.rank = _i;
		_item.change_type = (changeTypes[Math.floor(Math.random() * changeTypes.length)]) as change_type;
		_item.change_value = Math.floor(Math.random() * 10);

		return _item;
	});

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>