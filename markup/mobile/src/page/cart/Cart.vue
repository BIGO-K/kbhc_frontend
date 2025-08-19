<template>
	<layout
		title="장바구니"
		layout="popup"
		class="L=lowbtn"
	>
		<template #default>
			<div class="m_cart">
				<template
					v-if="testPacks.length === 1"
				>
					<p class="mm_text-none T=sm">
						<i class="ico_text-none"></i>장바구니에 담긴 상품이 없습니다.<br> 원하는 상품을 장바구니에 담아보세요!
					</p>
					<div class="mm_btn_box">
						<div class="mm_inline">
							<button
								type="button"
								class="mm_btn T=primary"
							>
								<b>쇼핑하러 가기</b>
							</button>
						</div>
					</div>
				</template>

				<template v-else>
					<!-- 장바구니 품목 -->
					<div class="mm_order-item">
						<form-check
							v-model="checkedAll"
							:label="`선택 상품(${selectedItems.length})`"
						></form-check>
						<button
							type="button"
							class="btn_remove"
						>
							<i class="ico_remove-trash"></i><b>선택삭제</b>
						</button>

						<div
							v-for="pack in testPacks"
							:key="pack.key"
							class="mm_order-item-seller"
						>
							<div
								v-if="!pack.is_package"
								class="mm_order...seller-head"
							>
								<p class="text_ship">
									<i class="ico_ship"></i>
									<span
										v-if="pack.shipping_price_policy"
										class="text_price"
									>
										<strong>{{ pack.shipping_price_policy }}</strong>
									</span>
									<span v-else>무료배송</span>
								</p>
							</div>

							<div class="mm_product-list T=sm">
								<ul>
									<li
										v-for="item in pack.items"
										:key="item.goods_id"
									>
										<form-check
											v-model="selectedItems"
											:value="item"
											label="상품 선택"
											:label-on-blind="true"
										></form-check>
										<p class="text_seller">
											<i class="ico_shop"></i>{{ item.seller_name }}
										</p>
										<div
											class="mm_product-item"
											:class="{ 'S=soldout': item.is_soldout }"
										>
											<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
												<figure>
													<div class="mm_product-item-image">
														<lazyload
															class="mm_bg-cover image_product"
															:src="item.goods_thumbnail_url"
														></lazyload>
														<p
															v-if="item.is_soldout"
															class="text_soldout"
														>
															<b>품절</b>
														</p>
														<p
															v-else-if="item.goods_stock < 6"
															class="text_product-status"
														>
															품절임박
														</p>
													</div>
													<figcaption>
														<p
															v-if="!pack.is_package"
															class="text_brand"
														>
															{{ item.brand_name }}
														</p>
														<p class="text_product">
															{{ '시스루스트라이프셔츠' }}
														</p>
														<p class="text_price">
															<del><span>{{ number(118800) }}</span></del><strong>{{ number(54800) }}</strong>
														</p>
														<p
															v-if="!pack.is_package || (pack.is_package && item.option_stock < 1 || item.ea > item.option_stock)"
															class="text_option"
															:class="{ 'S=option-soldout': item.option_stock < 1 || item.ea > item.option_stock }"
														>
															{{ `베이지 FREE / ${item.ea}개` }}
															<span v-if="item.option_stock < 1 || item.ea > item.option_stock">
																{{ item.option_stock < 1 ? `선택한 옵션이 품절되었습니다` : `수량을 확인 해주세요` }}
															</span>
														</p>
														<div
															v-else
															class="text_package"
														>
															<dl>
																<dt>{{ '상품 A 옵션' }}</dt>
																<dd>{{ '홍삼 농축액 1개월 분' }}</dd>
																<dd>
																	<div class="text_category">
																		<dl>
																			<dt>상품유형 :</dt>
																			<dd>{{ '일반상품' }}</dd>
																		</dl>
																	</div>
																</dd>
															</dl>
															<dl>
																<dt>{{ '상품 B 옵션' }}</dt>
																<dd>{{ '스포애니 3개월 이용권' }}</dd>
																<dd>
																	<div class="text_category">
																		<dl>
																			<dt>상품유형 :</dt>
																			<dd>{{ '무형상품(이용권)' }}</dd>
																		</dl>
																	</div>
																</dd>
															</dl>
															<p class="text_option">
																수량 : {{ '1' }}개
															</p>
														</div>
													</figcaption>
												</figure>
											</mm-link>
										</div>
										<div class="mm_product-unit">
											<div
												v-if="!pack.is_package"
												class="text_category"
											>
												<dl>
													<dt>상품유형 :</dt>
													<dd>{{ '무형상품(이용권)' }}</dd>
												</dl>
											</div>
											<div class="text_payment">
												<dl>
													<dt>결제가능수단 :</dt>
													<dd>PG + 스타포인트 + 리워드포인트</dd>
												</dl>
											</div>
											<div class="mm_btn_box">
												<div class="mm_flex T=equal">
													<toggle class="mm_btn T=xs T=light btn_like">
														<i class="ico_like"></i><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
													</toggle>
													<template v-if="item.is_soldout">
														<p class="text_cart-soldout">
															상품이 품절되었어요
														</p>
													</template>

													<template v-else>
														<toggle
															class="mm_btn T=xs T=line btn_option-change"
															parent-selector=".mm_product-unit"
														>
															<b>옵션변경</b><i class="ico_toggle"></i>
														</toggle>
														<button
															type="button"
															class="mm_btn T=xs T=support btn_buy"
															:disabled="item.option_stock < 1 || item.ea > item.option_stock"
														>
															<b>바로구매</b>
														</button>
														<button
															v-if="item.is_present"
															type="button"
															class="mm_btn T=xs T=support btn_present"
															:disabled="item.option_stock < 1 || item.ea > item.option_stock"
														>
															<i
																class="T=sm"
																:class="item.option_stock < 1 || item.ea > item.option_stock ? 'ico_present' : 'ico_present-fill'"
															></i><b>선물하기</b>
														</button>
													</template>
												</div>
											</div>
											<div
												class="m_cart-option"
												:class="{ 'S=option-soldout': item.option_stock < 1 || item.ea > item.option_stock }"
											>
												<!--
													모든 옵션은 옵션의 순서와 무관하게 우선 선택이 가능합니다(예: 옵션2부터 선택가능)
													옵션1, 2모두 1개의 옵션만 있을 경우 옵션 선택없이 수량만 선택 가능합니다. 이 때, .m_product-option-select 요소는 삭제하지 않고 하위에 있는 section만 비노출합니다.
												-->
												<div
													v-if="item.option_stock > 1"
													class="m_product-option-select"
												>
													<template v-if="pack.is_package">
														<section>
															<h6><b>상품 A</b></h6>
															<dl>
																<dt>옵션1</dt>
																<dd>
																	<form-select v-model="sortOption1">
																		<option>옵션명1</option>
																	</form-select>
																</dd>
															</dl>
															<dl>
																<dt>옵션2</dt>
																<dd>
																	<form-select v-model="sortOption2">
																		<option>옵션명2</option>
																	</form-select>
																</dd>
															</dl>
														</section>
														<section>
															<h6><b>상품 B</b></h6>
															<dl>
																<dt>옵션1</dt>
																<dd>
																	<form-select v-model="sortOption1">
																		<option>옵션명1</option>
																	</form-select>
																</dd>
															</dl>
															<dl>
																<dt>옵션2</dt>
																<dd>
																	<form-select v-model="sortOption2">
																		<option>옵션명2</option>
																	</form-select>
																</dd>
															</dl>
														</section>
													</template>
													<template v-else>
														<dl>
															<dt>옵션1</dt>
															<dd>
																<form-select v-model="sortOption1">
																	<option>옵션명1</option>
																</form-select>
															</dd>
														</dl>
														<dl>
															<dt>옵션2</dt>
															<dd>
																<form-select v-model="sortOption2">
																	<option>옵션명2</option>
																</form-select>
															</dd>
														</dl>
													</template>
												</div>
												<div class="m_cart-option-quantity">
													<h6
														v-if="item.option_stock === 1"
														class="mm_text-label T=sm"
													>
														<b>수량</b>
													</h6>
													<form-stepper
														v-model="optionStepper"
														:max="item.option_stock"
													>
													</form-stepper>
													<span
														v-if="item.option_stock <= 5"
														class="text_stock"
													>
														구매가능 수량<strong>{{ item.option_stock }}개</strong>
													</span>
												</div>
												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<button
															type="button"
															class="mm_btn T=xs T=light"
														>
															<b>취소</b>
														</button>
														<button
															type="button"
															class="mm_btn T=xs T=support"
														>
															<b>변경</b>
														</button>
													</div>
												</div>
											</div>
										</div>
										<button
											type="button"
											class="btn_remove"
										>
											<i class="ico_remove"></i><b class="mm_ir-blind">상품 삭제</b>
										</button>
									</li>
								</ul>
							</div>
							<p class="text_purchase-price">
								<strong>{{ '54,800' }}원 + 배송비 {{ '0' }}원 = {{ '54,800' }}원</strong>{{ '300,000' }}원 이상 무료배송
							</p>
						</div>
					</div>
					<hr class="mm_line">

					<!-- 결제금액 -->
					<div class="mm_cost">
						<table>
							<tbody>
								<tr>
									<th scope="row">
										<b>총 상품금액</b>
									</th>
									<td>
										<p class="text_price">
											<strong>{{ number(210000) }}</strong>
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<b>총 배송비 금액</b>
									</th>
									<td>
										<p class="text_price">
											+ <strong>{{ number(2500) }}</strong>
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<b>상품 할인</b>
									</th>
									<td>
										<p class="text_price">
											- <strong>{{ number(6200) }}</strong>
										</p>
									</td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<th scope="row">
										<b>최종 결제금액</b>
									</th>
									<td>
										<p class="text_price">
											<strong class="mm_text-variable">{{ number(201510) }}</strong>
										</p>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</template>
			</div>
		</template>

		<template #button>
			<div
				v-if="isShowsSubmitTip && selectedItems.length > 0"
				class="m_cart-popover"
			>
				<p><strong>품절/재고부족</strong> 상품이 포함되어 있습니다</p>
				<button
					type="button"
					class="btn_close"
					@click="isShowsSubmitTip = false;"
				>
					<i class="ico_popover-close"></i><b class="mm_ir-blind">닫기</b>
				</button>
			</div>
			<div
				class="mm_btn_box T=fixed T=flex btn_order"
				:class="{ 'T=disabled': selectedItems.length <= 0 }"
			>
				<div class="mm_flex T=equal">
					<button
						type="button"
						class="mm_btn T=primary"
					>
						<i class="ico_present-fill"></i><b>선물하기</b>
					</button>
					<button
						type="button"
						class="mm_btn T=primary"
						@click="onOrderPayment"
					>
						<b>구매하기</b>
					</button>
				</div>
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormStepper from '@/component/form/FormStepper.vue';

	const { number } = useFormatter();
	const { bom, router } = useGlobalPageContext();

	const isBlockedItem = (_item: CartItem) => _item.option_stock < 1 || _item.goods_stock < 1 || _item.ea > _item.option_stock;
	const hasCheckedBlocked = computed(() => selectedItems.value.some(_item => isBlockedItem(_item)));

	// XXX 임시 인터페이스
	const testPacks = ref([
		{
			key: '1',
			shipping_price_policy: '2500',
			is_package: false, // 임시 변수
			items: (useFakeCreator().goods(3) as unknown[] as (CartItem & Record<'is_present', boolean>)[]).map((_item, _i) => {
				_item.seller_name = `엠몬스타${_i}`;
				_item.goods_thumbnail_url = `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`;
				_item.option_stock = Math.floor(Math.random() * 3) + 1;
				_item.goods_stock = Math.floor(Math.random() * 10) + 1;
				_item.ea = Math.floor(Math.random() * 6);
				_item.is_soldout = Math.floor(Math.random() * 2) == 0 ? true : false;
				_item.is_present = Math.floor(Math.random() * 2) == 0 ? true : false; // 임시 변수

				return _item;
			}),
		},
		{
			key: '2',
			shipping_price_policy: null,
			is_package: false, // 임시 변수
			items: (useFakeCreator().goods(1) as unknown[] as (CartItem & Record<'is_present', boolean>)[]).map((_item, _i) => {
				_item.seller_name = `엠몬스타${_i}`;
				_item.goods_thumbnail_url = `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`;
				_item.option_stock = Math.floor(Math.random() * 3) + 1;
				_item.goods_stock = Math.floor(Math.random() * 10) + 1;
				_item.ea = Math.floor(Math.random() * 6);
				_item.is_soldout = Math.floor(Math.random() * 2) == 0 ? true : false;
				_item.is_present = Math.floor(Math.random() * 2) == 0 ? true : false; // 임시 변수

				return _item;
			}),
		},
		{
			key: '3',
			shipping_price_policy: null,
			is_package: true, // 임시 변수
			items: (useFakeCreator().goods(1) as unknown[] as (CartItem & Record<'is_present', boolean>)[]).map((_item, _i) => {
				_item.seller_name = `엠몬스타${_i}`;
				_item.goods_thumbnail_url = `/image/_sample/prod_x1_${Math.floor(Math.random() * 4) + 1}.png`;
				_item.option_stock = Math.floor(Math.random() * 3) + 1;
				_item.goods_stock = Math.floor(Math.random() * 10) + 1;
				_item.ea = Math.floor(Math.random() * 6);
				_item.is_soldout = Math.floor(Math.random() * 2) == 0 ? true : false;
				_item.is_present = Math.floor(Math.random() * 2) == 0 ? true : false; // 임시 변수

				return _item;
			}),
		},
	]);

	const cartItems = computed(() => testPacks.value.map(pack => pack.items).flat());
	const selectedItems = ref<CartItem[]>([]);
	const checkedAll = computed({
		get: () => selectedItems.value.length === cartItems.value.length,
		set: _value => {
			selectedItems.value = _value ? cartItems.value : [];
		},
	});

	const sortOption1 = ref('');
	const sortOption2 = ref('');
	const optionStepper = ref(1);

	const onOrderPayment = () => {
		if (hasCheckedBlocked.value) {
			bom.confirm('선택한 상품이 품절이거나\n재고가 부족한 상품이 있습니다.\n해당 상품을 제외하시겠습니까?',
				(_is: boolean) => {
					if (_is) selectedItems.value = selectedItems.value.filter(_item => !isBlockedItem(_item));
				},
				{
					title: '품절/재고부족',
				}
			);

			return;
		}

		router.push({ name: 'Order' });
	};

	// 안내문구
	const isShowsSubmitTip = ref(true);
</script>