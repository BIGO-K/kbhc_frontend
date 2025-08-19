<template>
	<div class="m_myorder-option">
		<div class="mm_order-item">
			<div class="mm_order-item-seller">
				<div class="mm_order...seller-head">
					<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
				</div>
				<div class="mm_product-list T=sm">
					<ul>
						<li>
							<div class="mm_product-item">
								<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
									<figure>
										<div class="mm_product-item-image">
											<lazyload
												class="mm_bg-cover image_product"
												src="/image/_sample/prod_x1_1.png"
											></lazyload>
										</div>
										<figcaption>
											<p class="text_brand">
												{{ '엠몬스타' }}
											</p>
											<p class="text_product">
												{{ '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
											</p>
											<p class="text_price">
												<strong>{{ number(54800) }}</strong>
											</p>
											<p class="text_option">
												{{ '베이지 FREE / 1개' }}
											</p>
										</figcaption>
									</figure>
								</mm-link>
								<div class="mm_product-unit">
									<div class="m_myorder-option-change">
										<form-select v-model="sortOption">
											<option>옵션</option>
										</form-select>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="mm_order-item-seller">
				<div class="mm_order...seller-head">
					<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
				</div>
				<div class="mm_product-list T=sm">
					<ul>
						<li>
							<div class="mm_product-item">
								<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
									<figure>
										<div class="mm_product-item-image">
											<lazyload
												class="mm_bg-cover image_product"
												src="/image/_sample/prod_x1_1.png"
											></lazyload>
										</div>
										<figcaption>
											<p class="text_brand">
												{{ '엠몬스타' }}
											</p>
											<p class="text_product">
												{{ '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
											</p>
											<p class="text_price">
												<strong>{{ number(54800) }}</strong>
											</p>
											<p class="text_option">
												{{ '베이지 FREE / 1개' }}
											</p>
										</figcaption>
									</figure>
								</mm-link>
								<div class="mm_product-unit">
									<div class="m_myorder-option-change">
										<form-select v-model="sortOption">
											<option>옵션</option>
										</form-select>
									</div>
								</div>
							</div>
						</li>
						<li>
							<div class="mm_product-item">
								<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
									<figure>
										<div class="mm_product-item-image">
											<lazyload
												class="mm_bg-cover image_product"
												src="/image/_sample/prod_x1_1.png"
											></lazyload>
										</div>
										<figcaption>
											<p class="text_brand">
												{{ '엠몬스타' }}
											</p>
											<p class="text_product">
												{{ "[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140" }}
											</p>
											<p class="text_price">
												<strong>{{ number(54800) }}</strong>
											</p>
											<p class="text_option">
												{{ '베이지 FREE / 1개' }}
											</p>
										</figcaption>
									</figure>
								</mm-link>
							</div>
							<div class="mm_product-unit">
								<div class="m_myorder-option-change">
									<form-select v-model="sortOption">
										<option>옵션</option>
									</form-select>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="mm_foot">
			<div class="mm_inner">
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
	import { ref } from 'vue';
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
	const sortOption = ref('');

	defineExpose<OverlayComponentExpose>({
		title: `옵션 변경`,
	});
</script>
