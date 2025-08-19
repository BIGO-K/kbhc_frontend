<template>
	<div
		class="m_raffle-result T=rb"
		:class="{ 'T=raffle-prize': prop.raffle.isWinner }"
	>
		<div class="mm_product-item">
			<figure>
				<div class="mm_product-item-image">
					<lazyload
						class="mm_bg-cover image_product"
						:src="prop.raffle.goods.thumbnailUrl"
					></lazyload>
				</div>
				<figcaption>
					<p class="text_product">
						{{ prop.raffle.goods.name }}
					</p>
				</figcaption>
			</figure>
		</div>
		<template v-if="!isEntry">
			<h3><b>응모한 내역이 없습니다</b></h3>
			<p class="text_notice">
				진행중인 래플에 응모해보세요!
			</p>
		</template>

		<!-- 당첨 -->
		<template v-else-if="prop.raffle.isWinner">
			<h3><b>래플 당첨을 축하합니다!</b></h3>
			<p class="text_notice">
				해당 기간에 꼭 구매해주세요.
			</p>
			<p class="text_period">
				2023년 6월 15일 월요일<b>14:00~21:00 (7시간)</b>
			</p>
			<div class="mm_btn_box">
				<mm-link
					class="mm_btn T=primary"
					:to="{ name: 'Order' }"
				>
					<b>구매하러 가기</b>
				</mm-link>
			</div>
		</template>

		<!-- 미당첨 -->
		<template v-else>
			<h3><b>아쉽게도 당첨되지 않았습니다</b></h3>
			<p class="text_notice">
				다음에 다시 도전해주세요!
			</p>
		</template>

		<!-- 추첨중 -->
		<!--
			<h3><b>아직 결과가 안나왔어요 :(</b></h3>
			<p class="text_notice">
			조금만 더 기다려주세요!
			</p>
		-->
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Lazyload from '@/component/Lazyload.vue';

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

	const prop = defineProps<{
		/** @prop { T } - LayoutModal의 closer 함수 */
		closer: <T>(context?: T) => void;
		raffle: RaffleEntry;
	}>();

	defineExpose<ModalComponentExpose>({
		title: `당첨 결과 확인`,
		isHideHeader: true,
	});

	const isEntry = ref(true);
</script>

<style src="../_raffle.scss" lang="scss"></style>