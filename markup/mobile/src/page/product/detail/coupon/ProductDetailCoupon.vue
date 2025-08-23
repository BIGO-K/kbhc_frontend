<template>
	<div class="m_product-coupon">
		<div class="m_product-coupon-head">
			<h3><b>받기 가능한 쿠폰</b><strong>30<sub>장</sub></strong></h3>
			<button
				type="button"
				class="mm_btn T=secondary btn_download"
			>
				<b>전체 쿠폰받기</b>
			</button>
		</div>

		<!-- 쿠폰 리스트 -->
		<ul class="m_product-coupon-list">
			<li>
				<p class="text_coupon">
					서프라이즈 쿠폰 10% 할인
				</p>
				<p class="text_period">
					발행일로부터 3일까지 사용 가능
				</p>
				<button
					type="button"
					class="mm_btn T=xs T=line T=secondary btn_download"
				>
					<b>쿠폰받기</b>
				</button>
			</li>
			<li>
				<p class="text_coupon">
					썸머세일 주말 쿠폰_A_18% 할인 쿠폰 5월~7월동안 사용 가능
				</p>
				<p class="text_period">
					2020.05.04 10:00 ~ 2021.05.18 23:59
				</p>
				<button
					type="button"
					class="mm_btn T=xs T=line T=secondary btn_download"
				>
					<b>쿠폰받기</b>
				</button>
			</li>
			<li>
				<p class="text_coupon">
					일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔
				</p>
				<p class="text_period">
					2020.05.04 10:00 ~ 2021.05.18 23:59
				</p>
				<b class="mm_btn T=xs T=disabled btn_download">발급완료</b>
			</li>
			<li>
				<p class="text_coupon">
					서프라이즈 THE NATURE SHOP 쿠폰 10% 할인
				</p>
				<p class="text_period">
					발행일로부터 3일까지 사용 가능
				</p>
				<button
					type="button"
					class="mm_btn T=xs T=line T=secondary btn_download"
				>
					<b>쿠폰받기</b>
				</button>
			</li>
			<li>
				<p class="text_coupon">
					서프라이즈 THE NATURE SHOP 쿠폰 20% 할인
				</p>
				<p class="text_period">
					발행일로부터 3일까지 사용 가능
				</p>
				<button
					type="button"
					class="mm_btn T=xs T=line T=secondary btn_download"
				>
					<b>쿠폰받기</b>
				</button>
			</li>
			<li>
				<p class="text_coupon">
					서프라이즈 THE NATURE SHOP 쿠폰 30% 할인
				</p>
				<p class="text_period">
					발행일로부터 3일까지 사용 가능
				</p>
				<button
					type="button"
					class="mm_btn T=xs T=line T=secondary btn_download"
				>
					<b>쿠폰받기</b>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `쿠폰 다운받기`,
	});
</script>