<template>
	<layout
		title="장바구니"
		layout="popup"
		class="L=lowbtn"
	>
		<template #default>
			<div class="m_cart">
				<template
					v-if="cartPacks.length < 1 && bundlePacks.length < 1"
				>
					<p class="mm_text-none T=sm">
						<i class="ico_text-none"></i>장바구니에 담긴 상품이 없습니다.<br> 원하는 상품을 장바구니에 담아보세요!
					</p>
					<div class="mm_btn_box">
						<div class="mm_inline">
							<button
								type="button"
								class="mm_btn T=primary"
								@click="closeCurrentWebview"
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
							v-model="checkAllCartItem"
							:label="`선택 상품(${checkedCartItems.length + checkedBundleItems.length})`"
						></form-check>
						<button
							type="button"
							class="btn_remove"
							@click="removeSelected"
						>
							<i class="ico_remove-trash"></i><b>선택삭제</b>
						</button>

						<template v-if="bundlePacks.length > 0">
							<div
								v-for="pack in bundlePacks"
								:key="pack.key"
								class="mm_order-item-seller"
							>
								<div class="mm_product-list T=sm">
									<ul>
										<li>
											<form-check
												v-model="checkedBundleItems"
												:value="pack"
												label="상품 선택"
												:label-on-blind="true"
											></form-check>
											<div
												:class="{ 'S=soldout': pack.is_soldout }"
												class="mm_product-item"
											>
												<mm-link :to="{ name: 'BundleGoodsDetail', params: { id: pack.goods.id } }">
													<figure>
														<div class="mm_product-item-image">
															<lazyload
																class="mm_bg-cover image_product"
																:src="pack.goods.thumbnail_url"
															></lazyload>

															<p
																v-if="pack.is_soldout"
																class="text_soldout"
															>
																<b>품절</b>
															</p>
															<p
																v-else-if="pack.low_item_stock < 6"
																class="text_product-status"
															>
																품절임박
															</p>
														</div>

														<figcaption>
															<p class="text_product">
																{{ pack.goods.name }}
															</p>

															<p class="text_price">
																<del v-if="pack.goods.sell_price > pack.goods.base_discounted_price"><span>{{ number(pack.goods.sell_price) }}</span></del>
																<strong>{{ number(pack.goods.base_discounted_price) }}</strong>
															</p>

															<div class="text_package">
																<dl
																	v-for="item in pack.items"
																	:key="`${pack.goods.id}_${item.goods_id}`"
																>
																	<dt>{{ item.goods_name }} 옵션</dt>
																	<dd>{{ optionText(item.option_name) }}</dd>
																	<dd>
																		<div class="text_category">
																			<dl>
																				<dt>상품유형 :</dt>
																				<dd>{{ GOODS_TYPE_LABEL[item.goods_type] }}</dd>
																			</dl>
																		</div>
																	</dd>
																</dl>
																<p
																	class="text_option"
																	:class="{ 'S=option-soldout': pack.ea > pack.low_item_stock }"
																>
																	수량 : {{ pack.ea }}개
																	<span v-if="pack.low_item_stock < 1 || pack.ea > pack.low_item_stock">
																		{{ pack.low_item_stock < 1 ? `선택한 옵션이 품절되었습니다` : `수량을 확인 해주세요` }}
																	</span>
																</p>
															</div>
														</figcaption>
													</figure>
												</mm-link>
											</div>
											<div class="mm_product-unit">
												<div class="text_payment">
													<dl>
														<dt>결제가능수단 :</dt>
														<dd>{{ pack.usable_pay_method_label }}</dd>
													</dl>
												</div>
												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<toggle
															class="mm_btn T=xs T=light btn_like"
															:is-active="wishedStore.isWishedGoods(pack.goods.id)"
															is-lazy
															@click="_e => toggleWished(_e, pack.goods.id)"
														>
															<i class="ico_like"></i><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
														</toggle>

														<template v-if="pack.is_soldout">
															<p class="text_cart-soldout">
																상품이 품절되었어요
															</p>
														</template>
														<template v-else>
															<toggle
																:is-active="activateBundleKey === pack.key"
																class="mm_btn T=xs T=line btn_option-change"
																parent-selector=".mm_product-unit"
																@toggle="(isActive) => fetchBundleOptions(isActive, pack)"
															>
																<b>옵션변경</b><i class="ico_toggle"></i>
															</toggle>
															<button
																type="button"
																class="mm_btn T=xs T=support btn_buy"
																:disabled="pack.low_item_stock < 1 || pack.ea > pack.low_item_stock"
																@click="buyBundle(pack)"
															>
																<b>바로구매</b>
															</button>

															<button
																type="button"
																class="mm_btn T=xs T=support btn_present"
																:disabled="pack.low_item_stock < 1 || pack.ea > pack.low_item_stock"
																@click="buyBundle(pack, true)"
															>
																<i
																	class="T=sm"
																	:class="pack.low_item_stock < 1 || pack.ea > pack.low_item_stock ? 'ico_present' : 'ico_present-fill'"
																></i><b>선물하기</b>
															</button>
														</template>
													</div>
												</div>
												<cart-bundle-options
													v-if="activateBundleKey === pack.key && modifyBundleContext"
													:key="pack.key"
													:modify-bundle-context="modifyBundleContext"
													@change-option="changeBundleOption"
													@close-context="closeContext"
												>
												</cart-bundle-options>
											</div>

											<button
												type="button"
												class="btn_remove"
												@click="removeCartItem(pack.items)"
											>
												<i class="ico_remove"></i><b class="mm_ir-blind">상품 삭제</b>
											</button>
										</li>
									</ul>
								</div>

								<p class="text_purchase-price">
									<strong>{{ number(priceContextByPack[pack.key].goodsPrice) }}원 + 배송비 {{ number(priceContextByPack[pack.key].shippingPrice) }}원 = {{ number(priceContextByPack[pack.key].totalPrice) }}원</strong>
								</p>
							</div>
						</template>

						<template v-if="cartPacks.length > 0">
							<div
								v-for="pack in cartPacks"
								:key="pack.key"
								class="mm_order-item-seller"
							>
								<div class="mm_order...seller-head">
									<p class="text_ship">
										<i class="ico_ship"></i>
										<span
											v-if="priceContextByPack[pack.key].shippingPrice"
											class="text_price"
										>
											<strong>{{ number(priceContextByPack[pack.key].shippingPrice) }}</strong>
										</span>
										<span v-else>무료배송</span>
									</p>
								</div>

								<div class="mm_product-list T=sm">
									<ul>
										<li
											v-for="item in pack.items"
											:key="item.cart_id"
										>
											<form-check
												v-model="checkedCartItems"
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
												<mm-link :to="{ name: 'ProductDetail', params: { id: item.goods_id } }">
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
															<p class="text_brand">
																{{ item.brand_name }}
															</p>
															<p class="text_product">
																{{ item.goods_name }}
															</p>
															<p class="text_price">
																<del v-if="item.goods_sell_price > item.goods_base_discounted_price"><span>{{ number(item.goods_sell_price) }}</span></del>
																<strong>{{ number(item.goods_base_discounted_price + item.option_extra_amount) }}</strong>
															</p>
															<p
																class="text_option"
																:class="{ 'S=option-soldout': item.option_stock < 1 || item.ea > item.option_stock }"
															>
																{{ `${optionText(item.option_name)} / ${item.ea}개` }}
																<span v-if="item.option_stock < 1 || item.ea > item.option_stock">
																	{{ item.option_stock < 1 ? `선택한 옵션이 품절되었습니다` : `수량을 확인 해주세요` }}
																</span>
															</p>
														</figcaption>
													</figure>
												</mm-link>
											</div>
											<div class="mm_product-unit">
												<div class="text_category">
													<dl>
														<dt>상품유형 :</dt>
														<dd>{{ GOODS_TYPE_LABEL[item.goods_type] }}</dd>
													</dl>
												</div>
												<div class="text_payment">
													<dl>
														<dt>결제가능수단 :</dt>
														<dd>{{ item.usable_pay_method_label }}</dd>
													</dl>
												</div>

												<div class="mm_btn_box">
													<div class="mm_flex T=equal">
														<toggle
															class="mm_btn T=xs T=light btn_like"
															:is-active="wishedStore.isWishedGoods(item.goods.id)"
															is-lazy
															@click="_e => toggleWished(_e, item.goods.id)"
														>
															<i class="ico_like"></i><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
														</toggle>
														<template v-if="item.is_soldout">
															<p class="text_cart-soldout">
																상품이 품절되었어요
															</p>
														</template>

														<template v-else>
															<toggle
																:is-active="activeCartItemId === item.cart_id"
																class="mm_btn T=xs T=line btn_option-change"
																parent-selector=".mm_product-unit"
																@toggle="(isActive) => fetchOptions(isActive, item)"
															>
																<b>옵션변경</b><i class="ico_toggle"></i>
															</toggle>
															<button
																type="button"
																class="mm_btn T=xs T=support"
																:disabled="item.option_stock < 1 || item.ea > item.option_stock"
																@click="buy(item)"
															>
																<b>바로구매</b>
															</button>

															<button
																v-if="item.goods_type !== GOODS_TYPE.raffle"
																type="button"
																class="mm_btn T=xs T=support"
																:disabled="item.option_stock < 1 || item.ea > item.option_stock"
																@click="buy(item, true)"
															>
																<i
																	class="T=sm"
																	:class="item.option_stock < 1 || item.ea > item.option_stock ? 'ico_present' : 'ico_present-fill'"
																></i><b>선물하기</b>
															</button>
														</template>
													</div>
												</div>
												<cart-options
													v-if="activeCartItemId === item.cart_id && modifyContext"
													:key="item.cart_id"
													:goods-type="item.goods_type"
													:options="modifyContext.options"
													:modify-context="modifyContext"
													@change-option="changeOption"
													@close-context="closeContext"
												>
												</cart-options>
											</div>
											<button
												type="button"
												class="btn_remove"
												@click="removeCartItem(item)"
											>
												<i class="ico_remove"></i><b class="mm_ir-blind">상품 삭제</b>
											</button>
										</li>
									</ul>
								</div>
								<p class="text_purchase-price">
									<strong>{{ number(priceContextByPack[pack.key].goodsPrice) }}원 + 배송비 {{ number(priceContextByPack[pack.key].checkedPackShippingPrice) }}원 = {{ number(priceContextByPack[pack.key].totalPrice) }}원</strong>
									<template v-if="pack.conditional_free_from > 0">
										{{ number(pack.conditional_free_from) }}원 이상 무료배송{{ pack.is_charge_on_each ? ' (개별부과)' : '' }}
									</template>
								</p>
							</div>
						</template>
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
											<strong>{{ number(totalPriceContext.goodsSellPrice) }}</strong>
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<b>총 배송비 금액</b>
									</th>
									<td>
										<p class="text_price">
											+ <strong>{{ number(totalPriceContext.shippingPrice) }}</strong>
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<b>상품 할인</b>
									</th>
									<td>
										<p class="text_price">
											- <strong>{{ number(totalPriceContext.baseDiscountAmount) }}</strong>
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
											<strong class="mm_text-variable">{{ number(totalPriceContext.payAmount) }}</strong>
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
				v-if="isShowsSubmitTip && checkedCartItems.length > 0 && hasCheckedBlocked"
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
				v-if="cartPacks.length > 0 || bundlePacks.length > 0"
				class="mm_btn_box T=fixed T=flex btn_order"
				:class="{ 'T=disabled': checkedCartItems.length <= 0 && checkedBundleItems.length <= 0 }"
			>
				<div class="mm_flex T=equal">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="onOrderPayment(true)"
					>
						<i class="ico_present-fill"></i><b>선물하기</b>
					</button>
					<button
						type="button"
						class="mm_btn T=primary"
						@click="onOrderPayment()"
					>
						<b>구매하기</b>
					</button>
				</div>
			</div>
		</template>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
	import { useOrderStore } from '$/stores/useOrderStore';
	import { useWishedStore } from '$/stores/useWishedStore';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useCart } from '$/composables/useCart';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { GOODS_TYPE, GOODS_TYPE_LABEL } from '$/constants/index';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import CartBundleOptions from '@/page/cart/CartBundleOptions.vue';
	import CartOptions from '@/page/cart/CartOptions.vue';

	const { isMember, bom, router, loading, openOverlay } = useGlobalPageContext();
	const { number, optionText } = useFormatter();
	const orderStore = useOrderStore();
	const cart = useCart();
	const wishedStore = useWishedStore();

	const {
		cartPacks,
		bundlePacks,
		checkedBundleItems,
		checkedCartItems,
		priceContextByPack,
		totalPriceContext,
		reload,
		checkAllCartItem,
	} = await cart.context(isMember.value);

	const isBlockedItem = (_item: CartItem) => _item.option_stock < 1 || _item.goods_stock < 1 || _item.ea > _item.option_stock || _item.is_soldout;
	const checkedBundleCartItems = computed(() => checkedBundleItems.value.flatMap(bundle => bundle.items));
	/** 일반 상품 & 패키지 상품 합친 항목 */
	const allCartItemBundleAndPack = computed(() => checkedBundleCartItems.value.concat(checkedCartItems.value));
	const hasCheckedBlocked = computed(() => allCartItemBundleAndPack.value.some(_item => isBlockedItem(_item)));
	const hasGifticonItems = computed(() => allCartItemBundleAndPack.value.some(_item => _item.goods_type === GOODS_TYPE.gifticon));
	const hasSubscribeItems = computed(() => allCartItemBundleAndPack.value.some(_item => _item.goods_type === GOODS_TYPE.subscribe));

	const uniqueCartGoodsIds = computed(() => [...new Set(cartPacks.value.flatMap(pack => pack.items).map((item) => item.goods_id))].concat([...new Set(bundlePacks.value.map(bundle => bundle.goods.id))]));
	if (uniqueCartGoodsIds.value.length > 0) {
		wishedStore.check(uniqueCartGoodsIds.value);
	}

	const hasDifferentGoodsType = (goodsType: GOODS_TYPE) => {
		return allCartItemBundleAndPack.value.some(_item => _item.goods_type !== goodsType);
	};

	const packFirstPayType = computed(() => allCartItemBundleAndPack.value[0]?.usable_pay_method_code || 0);
	const hasDifferentPayType = computed(() => allCartItemBundleAndPack.value.some(item => item.usable_pay_method_code !== packFirstPayType.value));
	const activeCartItemId = ref<number | null>(null);
	const activateBundleKey = ref<string | null>(null);
	const modifyContext = ref<CartItemModifyContext | null>(null);
	const modifyBundleContext = ref<BundleCartItemModifyContext | null>(null);

	async function fetchOptions(isActive: boolean, cartItem: CartItem) {
		if (!isActive) {
			return;
		}
		modifyContext.value = await cart.getModifyContext(cartItem);
		activeCartItemId.value = cartItem.cart_id;
		activateBundleKey.value = null;
		modifyContext.value.isSingleOption = modifyContext.value.options.length === 1 && modifyContext.value.options[0].sub.length === 1;
	}

	async function fetchBundleOptions(isActive: boolean, bundleItem: CartBundle) {
		if (!isActive) {
			return;
		}
		modifyBundleContext.value = await cart.getModifyBundleContext(bundleItem);
		activateBundleKey.value = bundleItem.key;
		activeCartItemId.value = null;
	}

	/** 상품개별 구매버튼 */
	async function buy(item: CartItem, forGift: boolean = false) {
		const orderData = [{
			option_id: item.option_id,
			ea: item.ea,
			cart_id: item.cart_id,
			goods_id: item.goods.id,
		}];

		if (item.option_stock < 1 || item.ea > item.option_stock) {
			return bom.alert('옵션 재고 수량이 부족합니다.');
		}

		orderProcess(orderData, forGift);
	}

	/** 상품개별 구매버튼 */
	async function buyBundle(bundlePack: CartBundle, forGift: boolean = false) {
		const orderData = bundlePack.items.map(item => {
			return {
				bundle_uuid: bundlePack.bundle_uuid,
				bundle_goods_id: bundlePack.goods.id,
				option_id: item.option_id,
				ea: bundlePack.ea,
				cart_id: item.cart_id,
				goods_id: item.goods.id,
			};
		});

		// if (item.option_stock < 1 || item.ea > item.option_stock) {
		// 	return bom.alert('옵션 재고 수량이 부족합니다.');
		// }
		orderProcess(orderData, forGift);
	}

	/** 하단 구매하기 버튼 */
	const onOrderPayment = (forGift: boolean = false) => {
		if (allCartItemBundleAndPack.value.length < 1) {
			return bom.alert('선택된 상품이 없습니다');
		}

		if (hasCheckedBlocked.value) {
			bom.confirm('선택한 상품이 품절이거나\n재고가 부족한 상품이 있습니다.\n해당 상품을 제외하시겠습니까?',
				(_is: boolean) => {
					if (_is) checkedCartItems.value = checkedCartItems.value.filter(_item => !isBlockedItem(_item));
				},
				{
					title: '품절/재고부족',
				}
			);

			return;
		}

		const buyLabel = forGift ? '선물' : '구매';
		/** 기프티콘 상품 유형만 있는지 체크 */
		if (hasGifticonItems.value && hasDifferentGoodsType(GOODS_TYPE.gifticon)) {
			return bom.alert(`기프티콘 상품은 다른 유형의\n 상품과 같이 ${buyLabel}할 수 없습니다.\n 다시 선택해주세요.`);
		}
		if (hasSubscribeItems.value) {
			if (hasDifferentGoodsType(GOODS_TYPE.subscribe)) {
				return bom.alert(`정기구독 상품은 다른 유형의\n 상품과 같이 ${buyLabel}할 수 없습니다.\n 다시 선택해주세요.`);
			}
			if (allCartItemBundleAndPack.value.length > 1) {
				return bom.alert(`정기구독 상품은 단일 상품만 ${buyLabel} 가능합니다.\n(여러 상품을 한번에 ${buyLabel}할 수 없습니다.)`);
			}
		}
		/** 결제방식 다른 경우 체크  */
		if (hasDifferentPayType.value) {
			return bom.alert(`결제방식이 다른 상품은 \n같이 ${buyLabel}할 수 없습니다.\n 다시 선택해주세요.`);
		}

		// @TODO 상품유형이 다른경우 체크 필요
		const orderData = allCartItemBundleAndPack.value.map((item) => {
			return {
				bundle_uuid: item.bundle_uuid,
				bundle_goods_id: item.bundle_goods_id,
				option_id: item.option_id,
				ea: item.ea,
				cart_id: item.cart_id,
				goods_id: item.goods.id,
			};
		});
		orderProcess(orderData, forGift);
	};

	async function removeSelected() {
		if (allCartItemBundleAndPack.value.length < 1) {
			return bom.alert('선택된 상품이 없습니다');
		}
		removeCartItem(allCartItemBundleAndPack.value);
	}

	async function removeCartItem(cartItem: CartItem | CartItem[]) {
		bom.confirm('선택한 상품을 삭제하시겠습니까?', async flag => {
			if (!flag) {
				return;
			}

			loading.show();

			try {
				await cart.remove(cartItem);
				bom.alert('삭제 되었습니다.');
				await reload();
				checkedCartItems.value = cartPacks.value.flatMap((pack) => pack.items).filter(_item => !isBlockedItem(_item));
			}
			catch (error) {
				useErrorAlert(error);
			}
			finally {
				loading.hide();
			}
		});
	}

	async function changeOption(code: number, amount: number, context: CartItemModifyContext) {
		if (!modifyContext.value) {
			return bom.alert('옵션 변경할 상품이 없습니다');
		}
		loading.show();
		try {
			await cart.modify(modifyContext.value.cartItem, code, amount);
			modifyContext.value = context;
			await reload();
			bom.alert('옵션이 변경 되었습니다', () => {
				closeContext();
			});

		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	async function changeBundleOption(bundleId: number, items: { cart_id: number; option_id: number }[], ea: number) {
		loading.show();
		if (!modifyBundleContext.value) {
			return bom.alert('옵션 변경할 상품이 없습니다');
		}
		try {
			await cart.modifyBundle(bundleId, items, ea);
			await reload();
			bom.alert('옵션이 변경 되었습니다', () => {
				closeContext();
			});
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	const component = defineAsyncComponent(() => import('@/page/mypage/wishlist/product/folder/MyWishlistProductFolder.vue'));
	async function toggleWished(element: HTMLElement, goodsId: number) {
		if (wishedStore.isWishedGoods(goodsId)) {
			wishedStore.remove([goodsId]);

			return;
		}

		openOverlay(component, {
			clickElement: element,
			props: {
				type: 'add',
				goodsId: goodsId,
			},
		});
	}

	function closeContext() {
		activeCartItemId.value = null;
		activateBundleKey.value = null;
		modifyBundleContext.value = null;
		modifyContext.value = null;
	}

	// 안내문구
	const isShowsSubmitTip = ref<boolean>(true);

	/** 실제 주문 프로세스 실행 */
	async function orderProcess(orderData: SelectedForOrder[], forGift: boolean = false) {
		if (orderData.length < 1) {
			return bom.alert('주문할 상품을 선택해주세요.');
		}

		loading.show();
		try {
			const orderId = await orderStore.generateOrderId(orderData, forGift);

			router.push({
				name: 'Order',
				params: {
					id: orderId,
				},
			});
		}
		catch (e) {
			// console.log(e);
		}
		finally {
			loading.hide();
		}
	}

	const { closeCurrentWebview } = useAppBridge();

	onMounted(() => {
		cart.getCount();
	});
</script>
