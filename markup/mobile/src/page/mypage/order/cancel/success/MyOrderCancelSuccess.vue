<template>
	<layout
		title="취소 완료"
		layout="popup"
	>
		<div class="m_myclaim-cancel-success">
			<h3 class="mm_heading m_myclaim-title">
				<i class="ico_success"></i>
				<b>주문 취소가 완료되었습니다</b>
			</h3>

			<!-- 취소 상품 목록 -->
			<div class="mm_order-item">
				<form-check
					v-model="checkedAll"
					label="전체선택"
				></form-check>
				<div class="mm_order-item-seller">
					<div class="mm_order...seller-head">
						<p class="text_ship">
							<i class="ico_ship"></i><span class="text_price"><strong>{{ number(2500) }}</strong></span>
						</p>
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
								<p class="text_seller">
									<i class="ico_shop"></i>{{ '엠몬스타' }}
								</p>
								<div class="mm_product-item">
									<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_2.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_brand">
													{{ '엠몬스타' }}
												</p>
												<p class="text_product">
													{{ '[매긴나잇브릿지]플리츠 디테일 드레스' }}
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
						<p class="text_ship">
							<i class="ico_ship"></i><span class="text_price"><strong>{{ number(2500) }}</strong></span>
						</p>
					</div>
					<div class="mm_product-list T=sm">
						<ul>
							<li>
								<p class="text_seller">
									<i class="ico_shop"></i>{{ '엠몬스타' }}
								</p>
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
												<p class="text_brand">
													{{ '엠몬스타' }}
												</p>
												<p class="text_product">
													{{ '[매긴나잇브릿지]플리츠 디테일 드레스' }}
												</p>
												<p class="text_price">
													<strong>{{ number(54800) }}</strong>
												</p>
												<p class="text_option">
													{{ '베이지 FREE / 10개' }}
												</p>
											</figcaption>
										</figure>
									</a>
								</div>
							</li>
							<li>
								<form-check
									v-model="selectedItems"
									:value="orderItems[1]"
									label="상품 선택"
									:label-on-blind="true"
								></form-check>
								<p class="text_seller">
									<i class="ico_shop"></i>{{ '엠몬스타' }}
								</p>
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
													{{ '[매긴나잇브릿지]플리츠 디테일 드레스' }}
												</p>
												<p class="text_price">
													<strong>{{ number(54800) }}</strong>
												</p>
												<p class="text_option">
													{{ '베이지 FREE / 10개' }}
												</p>
											</figcaption>
										</figure>
									</mm-link>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="mm_inner">
				<div class="mm_note T=bg">
					<ul>
						<li>노출되는 가격 및 옵션은 현재와 다를 수 있습니다.</li>
						<li>품절 등 장바구니에 담을 수 없는 상품은 체크하실 수 없습니다.</li>
						<li>취소 수량과 별개로 장바구니에는 1개의 수량만 담깁니다.</li>
					</ul>
				</div>
			</div>
			<div
				ref="$btnFooter"
				class="m_myclaim-foot"
				:class="classStickyOff"
			>
				<div class="mm_btn_box">
					<div class="mm_flex T=equal">
						<mm-link
							class="mm_btn T=support"
							:to="{ name: 'MyOrderCancel' }"
						>
							<b>취소내역 확인</b>
						</mm-link>
						<button
							type="button"
							class="mm_btn T=primary"
						>
							<b>장바구니 담기</b>
						</button>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, watch } from 'vue';
	import { useScroll } from '@vueuse/core';
	import { useFormatter } from '$/composables/useFormatter';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';

	const { number } = useFormatter();

	// XXX 임시 인터페이스
	interface test {
		id: string;
	}
	const orderItems = ref<test[]>([
		{ id: '1' },
		{ id: '2' },
	]);
	const selectedItems = ref<test[]>(orderItems.value.filter(_item => !_item.id));

	const checkedAll = computed({
		get: () => selectedItems.value.length === orderItems.value.length,
		set: _value => {
			selectedItems.value = _value ? [...orderItems.value] : [];
		},
	});

	const $view = ref<HTMLElement | null>(null);
	const $scroller = ref<HTMLElement | null>(null);
	const $btnFooter = ref<HTMLElement | null>(null);

	const smooth = ref(false);
	const behavior = computed(() => smooth.value ? 'smooth' : 'auto');
	const { y } = useScroll($scroller, { behavior });
	const classStickyOff = ref('');

	watch(y, (_currentScrollY) => {

		if (!$btnFooter.value) return;

		if (_currentScrollY - (window.innerHeight - $btnFooter.value.offsetHeight) >= 0) classStickyOff.value = 'S=sticky-off';
		else classStickyOff.value = '';

	});

	onMounted(() => {

		$view.value = document.querySelector('.mm_view') as HTMLElement;
		if ($view.value !== null) $scroller.value = $view.value.querySelector('.mm_page > .mm_scroller') as HTMLElement;

	});
</script>