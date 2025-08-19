<template>
	<layout title="래플 응모 내역">
		<div class="m_myraffle">
			<template v-if="raffleList.length < 1">
				<p class="mm_text-none">
					<i class="ico_text-none"></i>응모하신 내역이 없습니다
				</p>
				<div class="mm_btn_box">
					<div class="mm_inline">
						<mm-link
							class="mm_btn T=primary"
							:to="{ name: 'Raffle' }"
						>
							<b>래플 메인 바로가기</b>
						</mm-link>
					</div>
				</div>
			</template>
			<template v-else>
				<!-- 진행중인 응모 내역 -->
				<section class="m_myraffle-on">
					<h3><b>진행중인 응모 내역</b></h3>
					<template v-if="onGoingItems.length < 1">
						<p class="mm_text-none T=sm">
							<i class="ico_text-none"></i>응모하신 내역이 없습니다
						</p>
						<div class="mm_btn_box">
							<div class="mm_inline">
								<mm-link
									class="mm_btn T=primary"
									:to="{ name: 'Raffle' }"
								>
									<b>래플 메인 바로가기</b>
								</mm-link>
							</div>
						</div>
					</template>
					<div
						v-else
						class="mm_product-list T=sm"
					>
						<ul>
							<li
								v-for="item in onGoingItems"
								:key="item.goods.id"
							>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'RaffleDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													:src="item.goods.thumbnailUrl"
												></lazyload>
											</div>
											<figcaption>
												<div class="mm_tag-list">
													<b
														class="mm_tag"
														:class="{ 'T=bg T=gray': item.progressStatus === '응모 마감' }"
													>{{ item.progressStatus }}</b>
												</div>
												<p class="text_brand">
													{{ item.goods.brandName }}
												</p>
												<p class="text_product">
													{{ item.goods.name }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
									<div class="mm_btn_box">
										<b
											v-if="item.progressStatus === '추첨중'"
											class="mm_btn"
										>
											당첨자 추첨 진행중
										</b>
										<a
											v-else-if="item.progressStatus === '추첨완료'"
											class="mm_btn T=primary"
											@click.prevent="modalRaffleResult(item)"
										>
											<b>당첨 결과 확인하기</b>
										</a>
										<b
											v-else-if="new Date(item.announceAt) > nowDate"
											class="mm_btn"
										>
											{{ '05.28 (금) 17:00' }} 당첨자 발표 예정
										</b>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</section>
				<hr class="mm_line">

				<!-- 종료된 응모 내역 -->
				<section class="m_myraffle-off">
					<h3><b>종료된 응모 내역</b><small>(최근 6개월)</small></h3>
					<template v-if="endItems.length < 1">
						<p class="mm_text-none T=sm">
							<i class="ico_text-none"></i>종료된 응모 내역이 없습니다
						</p>
					</template>
					<template v-else>
						<div class="mm_product-list T=sm">
							<ul>
								<li
									v-for="item in endItems"
									:key="item.goods.id"
								>
									<div class="mm_product-item">
										<mm-link :to="{ name: 'RaffleDetail', params: { id: 123 } }">
											<figure>
												<div class="mm_product-item-image">
													<lazyload
														class="mm_bg-cover image_product"
														:src="item.goods.thumbnailUrl"
													></lazyload>
												</div>
												<figcaption>
													<div class="mm_tag-list">
														<b
															class="mm_tag"
															:class="{ 'T=bg T=dark': !item.isWinner }"
														>{{ item.isWinner ? '당첨' : '미당첨' }}</b>
														<b
															v-if="item.isWinner"
															class="mm_tag T=bg"
															:class="[{ 'T=gray': !item.isPurchase }, { 'T=secondary': item.isPurchase }]"
														>
															{{ item.isPurchase ? '구매완료' : '미구매' }}
														</b>
													</div>
													<p class="text_brand">
														{{ item.goods.brandName }}
													</p>
													<p class="text_product">
														{{ item.goods.name }}
													</p>
												</figcaption>
											</figure>
										</mm-link>
									</div>
								</li>
							</ul>
						</div>
						<hr class="mm_line">
					</template>
				</section>
			</template>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';

	const { openModal } = useGlobalPageContext();

	interface RaffleEntry {
		id: number; // 래플 ID
		progressStatus: string; // 래플 진행 상태  ('진행중', '추첨중', '추첨완료', '응모 마감')
		announceAt: string; // 당첨자 발표 예정일
		isWinner: boolean; // 당첨 여부
		isPurchase: boolean; // 구매 여부
		purchase_start_at: string; // 구매 시작일
		purchase_end_at: string; // 구매 종료일
		goods: {
			id: number; // 상품 ID
			name: string; // 상품명
			brandName: string; // 브랜드명
			thumbnailUrl: string; // 대표 이미지
		};
	}

	function modalRaffleResult(_raffle: RaffleEntry) {
		const component = defineAsyncComponent(() => import('@/feature/raffle/b/RaffleResult.vue'));

		return openModal(component, {
			props: {
				raffle: _raffle,
			},
		});
	}

	const nowDate = new Date();

	const raffleList = ref<RaffleEntry[]>([
		{
			id: 123,
			progressStatus: '진행중',
			announceAt: '2080-09-22T09:04:42Z',
			isWinner: false,
			isPurchase: false,
			purchase_start_at: '2022-09-20T20:00:00Z',
			purchase_end_at: '2022-09-30T15:00:00Z',
			goods: {
				id: 123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_2.png',
			},
		},
		{
			id: 1515,
			progressStatus: '추첨중',
			announceAt: '2080-09-22T09:04:42Z',
			isWinner: false,
			isPurchase: false,
			purchase_start_at: '2022-09-20T20:00:00Z',
			purchase_end_at: '2022-09-30T15:00:00Z',
			goods: {
				id: 534,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_1.png',
			},
		},
		{
			id: 4536,
			progressStatus: '추첨완료',
			announceAt: '2080-09-22T09:04:42Z',
			isWinner: true,
			isPurchase: false,
			purchase_start_at: '2022-09-20T20:00:00Z',
			purchase_end_at: '2022-09-30T15:00:00Z',
			goods: {
				id: 534,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_3.png',
			},
		},
		{
			id: 124343,
			progressStatus: '응모 마감',
			announceAt: '2025-09-22T09:04:42Z',
			isWinner: false,
			isPurchase: false,
			purchase_start_at: '2022-09-20T20:00:00Z',
			purchase_end_at: '2022-09-30T15:00:00Z',
			goods: {
				id: 3123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_1.png',
			},
		},
		{
			id: 3545,
			progressStatus: '응모 마감',
			announceAt: '2022-09-22T09:04:42Z',
			isWinner: true,
			isPurchase: false,
			purchase_start_at: '2022-09-20T20:00:00Z',
			purchase_end_at: '2022-09-30T15:00:00Z',
			goods: {
				id: 3123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_3.png',
			},
		},
		{
			id: 1431,
			progressStatus: '응모 마감',
			announceAt: '2023-09-22T09:04:42Z',
			isWinner: true,
			isPurchase: true,
			purchase_start_at: '2022-09-20T20:00:00Z',
			purchase_end_at: '2022-09-30T15:00:00Z',
			goods: {
				id: 3123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_2.png',
			},
		},
		{
			id: 1431,
			progressStatus: '응모 마감',
			announceAt: '2023-09-22T09:04:42Z',
			isWinner: false,
			isPurchase: false,
			purchase_start_at: '2022-09-20T20:00:00Z',
			purchase_end_at: '2022-09-30T15:00:00Z',
			goods: {
				id: 3123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_2.png',
			},
		},
	]);

	const onGoingItems = computed(() => raffleList.value.filter(_data => (new Date(_data.announceAt) > nowDate)));
	const endItems = computed(() => raffleList.value.filter(_data => (_data.progressStatus === '응모 마감' && new Date(_data.announceAt) < nowDate)));
</script>

<style src="./_raffle.scss" lang="scss"></style>