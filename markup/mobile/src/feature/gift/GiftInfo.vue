<template>
	<div class="mm_inner m_gift-info">
		<div class="mm_note T=bg">
			<ul>
				<li>사은품은 회원 대상으로 지급됩니다.</li>
			</ul>
		</div>
		<!-- (D) 사은품 정보 팝업에서만 지급조건과 지급기간 내용 앞에 "지급조건:", "지급기간:" 문구가 추가됩니다.(다른 페이지 내 사은품 내용에는 추가되지 않습니다.) -->
		<ul class="mm_gift-list">
			<li>
				<div class="mm_gift-item">
					<figure>
						<lazyload
							class="mm_bg-cover image_gift"
							src="/image/_sample/prod_x1_2.png"
						></lazyload>
						<figcaption>
							<p class="text_name">
								KB 오케어 텀블러 증정
							</p>
							<dl>
								<dt>지급조건</dt>
								<dd>전상품 1,000,000원 이상 구매 시 증정</dd>
							</dl>
							<dl>
								<dt>지급기간</dt>
								<dd>2023.00.00 ~ 2023.00.00</dd>
							</dl>
						</figcaption>
					</figure>
				</div>
			</li>
			<li>
				<div class="mm_gift-item">
					<figure>
						<lazyload
							class="mm_bg-cover image_gift"
							src="/image/_sample/prod_x1_1.png"
						></lazyload>
						<figcaption>
							<p class="text_name">
								KB 오케어 텀블러 증정
							</p>
							<dl>
								<dt>지급조건</dt>
								<dd>전상품 25,000원 이상 구매 시</dd>
							</dl>
							<dl>
								<dt>지급기간</dt>
								<dd>2023.00.00 ~ 2023.00.00</dd>
							</dl>
						</figcaption>
					</figure>
				</div>
			</li>
			<li>
				<div class="mm_gift-item">
					<figure>
						<lazyload
							class="mm_bg-cover image_gift"
							src="/image/_sample/prod_x1_3.png"
						></lazyload>
						<figcaption>
							<p class="text_name">
								KB 오케어 텀블러 증정
							</p>
							<dl>
								<dt>지급조건</dt>
								<dd>전상품 1,000,000원 이상 구매 시 증정</dd>
							</dl>
							<dl>
								<dt>지급기간</dt>
								<dd>2023.00.00 ~ 2023.00.00</dd>
							</dl>
						</figcaption>
					</figure>
				</div>
			</li>
			<li>
				<div class="mm_gift-item">
					<figure>
						<lazyload
							class="mm_bg-cover image_gift"
							src="/image/_sample/prod_x1_4.png"
						></lazyload>
						<figcaption>
							<p class="text_name">
								KB 오케어 텀블러 증정
							</p>
							<dl>
								<dt>지급조건</dt>
								<dd>전상품 1,000,000원 이상 구매 시 증정</dd>
							</dl>
							<dl>
								<dt>지급기간</dt>
								<dd>2023.00.00 ~ 2023.00.00</dd>
							</dl>
						</figcaption>
					</figure>
				</div>
			</li>
			<li>
				<div class="mm_gift-item">
					<figure>
						<lazyload
							class="mm_bg-cover image_gift"
							src="/image/_sample/prod_x1_5.png"
						></lazyload>
						<figcaption>
							<p class="text_name">
								KB 오케어 텀블러 증정
							</p>
							<dl>
								<dt>지급조건</dt>
								<dd>전상품 1,000,000원 이상 구매 시 증정</dd>
							</dl>
							<dl>
								<dt>지급기간</dt>
								<dd>2023.00.00 ~ 2023.00.00</dd>
							</dl>
						</figcaption>
					</figure>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import Lazyload from '@/component/Lazyload.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `사은품 정보`,
	});
</script>

<style src="./_gift.scss" lang="scss"></style>
<style lang="scss">
	@use '../../asset/scss/helper/mixin';

	.m_gift-info {
		padding-top: 16px;

		.mm_note {
			margin: 0;
		}

		.mm_gift-list {
			margin-top: 16px;
		}
	}
</style>
