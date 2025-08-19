<template>
	<layout title="래플 응모 내역">
		<div class="m_myraffle">
			<template v-if="onGoingItems.length === 0 && closedItems.length === 0">
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
					<template v-if="onGoingItems.length === 0">
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
					<template v-else>
						<div class="mm_product-list T=sm">
							<ul>
								<li
									v-for="item in onGoingItems"
									:key="item.id"
								>
									<div class="mm_tag-list">
										<b
											class="mm_tag"
											:class="{ 'T=bg T=gray': item.status == RAFFLE_STATUS.ENTRY_END }"
										>
											{{ getProgressLabel(item) }}
										</b>
									</div>
									<product-item
										:goods="(item.goods as OptianalGoods)"
										:usable="{
											keys: ['brand_name'],
										}"
										:use-wish="false"
									></product-item>
									<div class="mm_btn_box">
										<template v-if="item.status == RAFFLE_STATUS.NOTICE_START">
											<button
												v-if="item.is_confirmed_winner"
												type="button"
												class="mm_btn T=primary"
												@click="_e => modalRaffleResult(_e, item)"
											>
												<b>당첨 결과 확인하기</b>
											</button>
											<b
												v-else
												class="mm_btn"
											>당첨자 추첨 진행중</b>
										</template>
										<b
											v-else
											class="mm_btn"
										>
											{{ date(item.notice_at, 'MM.DD (ddd) HH:mm') }} 당첨자 발표 예정
										</b>
									</div>
								</li>
							</ul>
						</div>
					</template>
				</section>

				<hr class="mm_line">

				<!-- 종료된 응모 내역 -->
				<section class="m_myraffle-off">
					<h3><b>종료된 응모 내역</b><small>(최근 6개월)</small></h3>
					<template v-if="closedItems.length === 0">
						<p class="mm_text-none T=sm">
							<i class="ico_text-none"></i>종료된 응모 내역이 없습니다
						</p>
					</template>
					<template v-else>
						<div class="mm_product-list T=sm">
							<ul>
								<li
									v-for="item in closedItems"
									:key="item.id"
								>
									<div class="mm_tag-list">
										<b
											class="mm_tag"
											:class="{ 'T=bg T=dark': !item.is_winner }"
										>
											{{ item.is_winner ? '당첨' : '미당첨' }}
										</b>
										<b
											v-if="item.is_winner"
											class="mm_tag T=bg"
											:class="item.is_bought ? 'T=secondary' : 'T=gray'"
										>
											{{ item.is_bought ? '구매완료' : '미구매' }}
										</b>
									</div>
									<product-item
										:goods="(item.goods as OptianalGoods)"
										:usable="{
											keys: ['brand_name'],
										}"
										:use-wish="false"
									></product-item>
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
	import { defineAsyncComponent, ref } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useRaffle } from '$/composables/useRaffle';
	import Layout from '@/component/layout/Layout.vue';
	import ProductItem from '@/component/ProductItem.vue';

	const { openModal } = useGlobalPageContext();
	const { date } = useFormatter();
	const { RAFFLE_STATUS, getMyEntryList } = useRaffle();

	const onGoingItems = ref<MyRaffle[]>([]);
	const closedItems = ref<MyRaffle[]>([]);

	await Promise.allSettled([
		getMyEntryList(false).then(_data => {
			onGoingItems.value = _data;
		}),
		getMyEntryList(true).then(_data => {
			closedItems.value = _data;
		}),
	]);

	const modalRaffleResult = (_e: MouseEvent, _raffle: MyRaffle) => {
		openModal(defineAsyncComponent(() => import('@/feature/raffle/b/RaffleResult.vue')), {
			props: {
				raffle: _raffle,
			},
			clickElement: _e.currentTarget,
		});
	};

	const getProgressLabel = (raffle: MyRaffle) => {
		switch (raffle.status) {
			case RAFFLE_STATUS.UPCOMING:
			case RAFFLE_STATUS.ENTRY_START:
				return '진행중';
			case RAFFLE_STATUS.ENTRY_END:
				return '응모마감';
			case RAFFLE_STATUS.NOTICE_START:
			case RAFFLE_STATUS.BUY_START:
			case RAFFLE_STATUS.BUY_END:
			default:
				return raffle.is_confirmed_winner ? '추첨완료' : '추첨중';
		}
	};
</script>

<style src="./_raffle.scss" lang="scss"></style>