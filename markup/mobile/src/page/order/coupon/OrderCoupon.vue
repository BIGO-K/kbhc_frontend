<template>
	<div class="m_order-coupon">
		<div class="mm_order-item">
			<div class="mm_product-list T=sm">
				<ul>
					<li>
						<div class="mm_product-item">
							<a>
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											src="/image/_sample/prod_x1_1.png"
										></lazyload>
									</div>
									<figcaption>
										<p class="text_brand">엠몬스타</p>
										<p class="text_product">[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140</p>
										<p class="text_price"><strong>{{ number(54800) }}</strong></p>
										<p class="text_option">베이지 FREE / 1개</p>
									</figcaption>
								</figure>
							</a>
						</div>
						<div class="mm_product-unit">
							<form-select>
								<option>쿠폰을 선택하세요</option>
								<option selected>
									첫 구매 15% 할인 쿠폰 - APP 전용/ 최대 10% 최대 10%
								</option>
							</form-select>
						</div>
					</li>
					<li>
						<div class="mm_product-item">
							<a>
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											src="/image/_sample/prod_x1_2.png"
										></lazyload>
									</div>
									<figcaption>
										<p class="text_brand">엠몬스타</p>
										<p class="text_product">시스루스트라이프셔츠</p>
										<p class="text_price"><strong>{{ number(54800) }}</strong></p>
										<p class="text_option">베이지 FREE / 1개</p>
									</figcaption>
								</figure>
							</a>
						</div>
						<div class="mm_product-unit">
							<form-select>
								<option>쿠폰을 선택하세요</option>
							</form-select>
						</div>
					</li>
				</ul>
				<ul>
					<li>
						<div class="mm_product-item">
							<a>
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											src="/image/_sample/prod_x1_3.png"
										></lazyload>
									</div>
									<figcaption>
										<p class="text_brand">엠몬스타</p>
										<p class="text_product">[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140</p>
										<p class="text_price"><strong>{{ number(54800) }}</strong></p>
										<p class="text_option">베이지 FREE / 1개</p>
									</figcaption>
								</figure>
							</a>
						</div>
						<div class="mm_product-unit">
							<form-select>
								<option>쿠폰을 선택하세요</option>
								<option selected>
									첫 구매 15% 할인 쿠폰 - APP 전용/ 최대 10% 최대 10%
								</option>
							</form-select>
						</div>
					</li>
				</ul>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
					>
						<b>적용하기</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const { number } = useFormatter();

	defineExpose<OverlayComponentExpose>({
		title: `쿠폰 적용`,
	});
</script>