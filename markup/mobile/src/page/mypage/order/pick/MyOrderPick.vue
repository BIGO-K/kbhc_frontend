<template>
	<div class="m_myorder-option">
		<div class="mm_order-item">
			<form-check
				v-model="checkedAll"
				label="전체선택"
			></form-check>
			<div class="mm_order-item-seller">
				<div class="mm_order...seller-head">
					<h5><i class="ico_shop"></i><b>{{ '엠몬스타' }}</b></h5>
				</div>
				<div class="mm_product-list T=sm">
					<ul>
						<li>
							<form-check
								v-model="selectedItems"
								:value="orderItems[0]"
								label="상품 선택"
								:label-on-blind="true"
							></form-check>
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
							</div>
						</li>
						<li>
							<form-check
								v-model="selectedItems"
								:value="orderItems[1]"
								label="상품 선택"
								:label-on-blind="true"
							></form-check>
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
							<form-check
								v-model="selectedItems"
								:value="orderItems[2]"
								label="상품 선택"
								:label-on-blind="true"
							></form-check>
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
							</div>
							<div class="mm_product-unit">
								<p class="text_readonly T=select">
									<b>{{ '5,480원 (10%) 할인 (~2022.12.31) [등급 할인 쿠폰]' }}</b>
									<i class="ico_form-select"></i>
								</p>
							</div>
						</li>
						<li>
							<form-check
								v-model="selectedItems"
								:value="orderItems[3]"
								label="상품 선택"
								:label-on-blind="true"
							></form-check>
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
							</div>
							<div class="mm_product-unit">
								<p class="text_readonly T=select">
									<b>{{ '5,480원 (10%) 할인 (~2022.12.31) [등급 할인 쿠폰]' }}</b>
									<i class="ico_form-select"></i>
								</p>
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
	import { ref, computed } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const { number } = useFormatter();

	// XXX 임시 인터페이스
	interface test {
		id: string;
	}
	const orderItems = ref<test[]>([
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
		{ id: '4' },
	]);
	const selectedItems = ref<test[]>(orderItems.value.filter(_item => !_item.id));

	const checkedAll = computed({
		get: () => selectedItems.value.length === orderItems.value.length,
		set: _value => {
			selectedItems.value = _value ? [...orderItems.value] : [];
		},
	});

	defineExpose<OverlayComponentExpose>({
		title: `부분 선택`,
	});
</script>