<template>
	<div class="m_review-write">
		<!-- 상품정보 : 자동노출 -->
		<div class="m_review-write-product">
			<div class="m...product-point S=point-on">
				<p><i class="ico_review-photo"></i>포토 리뷰 등록 시 최대<b><strong>{{ number(1500) }}원</strong></b>적립!</p>
				<div class="m...product-point-inner">
					<dl><dt>텍스트 리뷰</dt><dd><strong>{{ number(1000) }}원</strong></dd></dl>
					<dl><dt>포토 리뷰</dt><dd><strong>{{ number(1500) }}원</strong></dd></dl>
				</div>
			</div>
			<div class="mm_product-item T=single-sm">
				<figure>
					<div class="mm_product-item-image">
						<lazyload
							class="mm_bg-cover image_product"
							src="/image/_sample/prod_x1_2.png"
						></lazyload>
					</div>
					<figcaption>
						<p class="text_product">
							{{ 'Bene bag_white canvas [매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
						</p>
						<p class="text_option">
							{{ '화이트 FREE / 1개' }}
						</p>
					</figcaption>
				</figure>
			</div>
		</div>

		<my-review-input></my-review-input>

		<div class="mm_inner">
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
					>
						<b>수정하기</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';
	import MyReviewInput from '@/page/mypage/review/component/MyReviewInput.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const { number } = useFormatter();

	defineExpose<OverlayComponentExpose>({
		title: `리뷰 쓰기`,
	});
</script>