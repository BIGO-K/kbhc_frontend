<template>
	<layout title="래플">
		<div class="mm_inner m_raffle T=rb">
			<!-- 진행중 래플 -->
			<section class="m_raffle-ongoing">
				<h3 class="mm_strapline">
					<b>래플</b>
					<a
						class="btn_guide"
						@click.prevent="overlayRaffleGuide()"
					>
						<b class="mm_ir-blind">래플 안내</b>
						<i class="ico_guide"></i>
					</a>
				</h3>
				<ul>
					<li
						v-for="item in ongoingItems"
						:key="item.id"
					>
						<div class="mm_product-item T=pa">
							<mm-link :to="{ name: 'RaffleDetail', params: { id: item.id } }">
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											:src="item.goods.thumbnail_url"
										></lazyload>
										<p
											v-if="item.progressStatus != '진행 예정'"
											class="text_join"
										>
											{{ number(720000) }}명 참여중
										</p>
									</div>
									<figcaption>
										<div
											class="m_raffle-ongoing-progress"
											:class="{ 'T=proceeding': item.progressStatus === '응모' }"
										>
											<dl v-if="item.progressStatus === '진행 예정'">
												<dt>래플 진행 예정</dt>
												<dd>{{ '1월 20일 (금)' }}</dd>
											</dl>
											<dl v-else-if="item.progressStatus === '응모'">
												<dt>래플 종료 까지</dt>
												<dd>{{ number(72) }}<span>:</span>{{ number(18) }}<span>:</span>{{ number(40) }}</dd>
											</dl>
											<dl v-else>
												<dt>래플 종료</dt>
												<dd>00<span>:</span>00<span>:</span>00</dd>
											</dl>
											<div
												v-if="item.progressStatus != '진행 예정'"
												class="m...progress-bar"
											>
												<template v-if="item.progressStatus === '응모'">
													<p
														class="text_state"
														style="left: 20%;"
														title="20%"
													>
														진행중
													</p>
													<b style="width: 20%;"><i></i></b>
												</template>
												<template v-else>
													<!-- (D) 종료일 경우 p태그에 style 속성을 주지 않습니다. -->
													<p
														class="text_state"
														title="100%"
													>
														종료
													</p>
													<b style="width: 100%;"><i></i></b>
												</template>
											</div>
										</div>
										<p class="text_brand">
											{{ item.goods.brand_name }}
										</p>
										<p class="text_product">
											{{ item.goods.name }}
										</p>
										<p class="text_sale">
											{{ item.goods.sale_rate }}%
										</p>
										<p class="text_price">
											<strong>{{ number(item.goods.base_discounted_price) }}</strong><del><span>{{ number(item.goods.price) }}</span></del>
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</div>
						<div
							v-if="item.progressStatus != '진행 예정'"
							class="mm_btn_box"
						>
							<a
								v-if="item.progressStatus === '응모'"
								class="mm_btn T=primary"
								@click.prevent="overlayRaffleEntry()"
							>
								<b>응모하기</b>
							</a>
							<b
								v-else
								class="mm_btn T=disabled"
							>{{ '05.28 (금) 17:00' }} 당첨자 발표 예정</b>
						</div>
					</li>
				</ul>
			</section>

			<!-- 종료된 래플 -->
			<section class="m_raffle-end">
				<h3 class="mm_strapline">
					<b>종료된 래플</b>
				</h3>
				<ul>
					<li
						v-for="item in endItems"
						:key="item.id"
					>
						<div class="mm_product-item T=pa">
							<mm-link :to="{ name: 'RaffleDetail', params: { id: item.id } }">
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											:src="item.goods.thumbnail_url"
										></lazyload>
										<p class="text_join">
											{{ number(720000) }}명 참여
										</p>
									</div>
									<figcaption>
										<p class="text_brand">
											{{ item.goods.brand_name }}
										</p>
										<p class="text_product">
											{{ item.goods.name }}
										</p>
										<p class="text_sale">
											{{ item.goods.sale_rate }}%
										</p>
										<p class="text_price">
											<strong>{{ number(item.goods.base_discounted_price) }}</strong><del><span>{{ number(item.goods.price) }}</span></del>
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</div>
						<div class="mm_btn_box">
							<div class="mm_flex T=equal">
								<a
									v-if="item.progressStatus === '구매'"
									class="mm_btn T=xs T=primary"
									@click.prevent="modalRaffleResult(item)"
								>
									<b>당첨 결과 확인하기</b>
								</a>
								<template v-else>
									<b class="mm_btn T=xs T=disabled">래플 종료</b>

									<a
										v-if="item.is_confirmed_winner"
										class="mm_btn T=xs T=primary"
										@click.prevent="overlayRaffleWinner()"
									>
										<b>당첨자 보기</b>
									</a>
								</template>
							</div>
						</div>
					</li>
				</ul>
			</section>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const { number } = useFormatter();

	type RaffleItem = {
		id: number; // 래플 ID
		progressStatus: '진행 예정' | '응모' | '응모 마감' | '구매' | '종료'; // 래플 진행 상태
		total_entry_count: number; // 총 참여자 수
		is_confirmed_winner: boolean; // 당첨자 추첨 진행 여부
		isWinner: boolean; // 당첨 여부
		goods: {
			id: number;
			name: string;
			thumbnail_url: string;
			price: number;
			base_discounted_price: number;
			brand_name: string;
			sale_rate: number;
		};
	};

	const raffleItems = ref<RaffleItem[]>([
		{
			id: 1,
			progressStatus: '진행 예정',
			total_entry_count: 0,
			is_confirmed_winner: false,
			isWinner: false,
			goods: {
				id: 1,
				name: '클레오 스트라이프 니트 탑 / CLEO STRIPE KNIT TOP_4colors',
				thumbnail_url: '/image/_sample/prod_x1_1.png',
				price: 10000,
				base_discounted_price: 20000,
				brand_name: '엠몬스타',
				sale_rate: 50,
			},
		},
		{
			id: 2,
			progressStatus: '응모',
			total_entry_count: 720000,
			is_confirmed_winner: false,
			isWinner: false,
			goods: {
				id: 2,
				name: '클레오 스트라이프 니트 탑 / CLEO STRIPE KNIT TOP_4colors',
				thumbnail_url: '/image/_sample/prod_x1_2.png',
				price: 1000,
				base_discounted_price: 248000,
				brand_name: '엠몬스타',
				sale_rate: 50,
			},
		},
		{
			id: 3,
			progressStatus: '응모 마감',
			total_entry_count: 720000,
			is_confirmed_winner: false,
			isWinner: false,
			goods: {
				id: 3,
				name: '클레오 스트라이프 니트 탑 / CLEO STRIPE KNIT TOP_4colors',
				thumbnail_url: '/image/_sample/prod_x1_3.png',
				price: 127000,
				base_discounted_price: 248000,
				brand_name: '엠몬스타',
				sale_rate: 50,
			},
		},
		{
			id: 4,
			progressStatus: '구매',
			total_entry_count: 720000,
			is_confirmed_winner: false,
			isWinner: false,
			goods: {
				id: 4,
				name: '클레오 스트라이프 니트 탑 / CLEO STRIPE KNIT TOP_4colors',
				thumbnail_url: '/image/_sample/prod_x1_4.png',
				price: 127000,
				base_discounted_price: 248000,
				brand_name: '엠몬스타',
				sale_rate: 50,
			},
		},
		{
			id: 5,
			progressStatus: '구매',
			total_entry_count: 940512,
			is_confirmed_winner: true,
			isWinner: true,
			goods: {
				id: 5,
				name: '클레오 스트라이프 니트 탑 / CLEO STRIPE KNIT TOP_4colors',
				thumbnail_url: '/image/_sample/prod_x1_1.png',
				price: 127000,
				base_discounted_price: 248000,
				brand_name: '엠몬스타',
				sale_rate: 50,
			},
		},
		{
			id: 6,
			progressStatus: '종료',
			total_entry_count: 940512,
			is_confirmed_winner: false,
			isWinner: false,
			goods: {
				id: 6,
				name: '클레오 스트라이프 니트 탑 / CLEO STRIPE KNIT TOP_4colors',
				thumbnail_url: '/image/_sample/prod_x1_2.png',
				price: 127000,
				base_discounted_price: 248000,
				brand_name: '엠몬스타',
				sale_rate: 50,
			},
		},
		{
			id: 7,
			progressStatus: '종료',
			total_entry_count: 940512,
			is_confirmed_winner: true,
			isWinner: true,
			goods: {
				id: 7,
				name: '클레오 스트라이프 니트 탑 / CLEO STRIPE KNIT TOP_4colors',
				thumbnail_url: '/image/_sample/prod_x1_3.png',
				price: 127000,
				base_discounted_price: 248000,
				brand_name: '엠몬스타',
				sale_rate: 50,
			},
		},
	]);

	const ongoingItems = computed(() => raffleItems.value.filter(_data => (_data.progressStatus === '진행 예정' || _data.progressStatus === '응모' || _data.progressStatus === '응모 마감' || (_data.progressStatus === '구매' && !_data.is_confirmed_winner))));
	const endItems = computed(() => raffleItems.value.filter(_data => ((_data.progressStatus === '구매' && _data.is_confirmed_winner) || _data.progressStatus === '종료')));

	const { openModal } = useGlobalPageContext();

	function modalRaffleResult(_raffle: RaffleItem) {
		const component = defineAsyncComponent(() => import('@/feature/raffle/b/RaffleResult.vue'));

		return openModal(component, {
			props: {
				raffle: _raffle,
			},
		});
	}

	const { openOverlay } = useGlobalPageContext();

	function overlayRaffleGuide() {
		const component = defineAsyncComponent(() => import('@/feature/raffle/RaffleGuide.vue'));

		return openOverlay(component);
	}

	function overlayRaffleEntry() {
		const component = defineAsyncComponent(() => import('@/feature/raffle/RaffleEntry.vue'));

		return openOverlay(component);
	}

	function overlayRaffleWinner() {
		const component = defineAsyncComponent(() => import('@/feature/raffle/RaffleWinner.vue'));

		return openOverlay(component);
	}
</script>

<style src="../_raffle.scss" lang="scss"></style>