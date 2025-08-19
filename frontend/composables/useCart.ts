import { computed, ref, watch } from 'vue';
import { defined } from '$/utils/array';
import { uuid } from '$/utils/string';
import { useBackend } from '$/composables/useBackend';
import { useGoodsAdditional } from '$/composables/useGoodsAdditional';

const count = ref<number>(0);

export const useCart = () => {
	const { getOptions, getBundleOptions } = useGoodsAdditional();

	const packs = ref<CartPack[]>([]);
	const bundlePacks = ref<CartBundle[]>([]);

	const options = ref<Record<number, GoodsOption[]>>({});
	const bundleOptions = ref <Record<number, BundleGoodsOptions[]>>({});

    /** 장바구니 조회 처리  */
	const getCartPacks = async () => {
		const response = await useBackend().command<{
			packs: CartPack[];
			bundles: CartBundle[];
		}>('v1/shopping/carts', {
			isForce: true,
		});

		bundlePacks.value = response.bundles.map((bundle) => {
			bundle.is_soldout = bundle.items.some(item => item.is_soldout);
			bundle.low_item_stock = Math.min(...bundle.items.map(item => item.option_stock));
			bundle.key = `${bundle.goods.id}_${bundle.cart_ids.join('_')}`;

			bundle.items.map(item => {
				item.bundle_uuid = bundle.bundle_uuid;
				item.ea = bundle.ea,
				item.bundle_goods_id = bundle.goods.id,
				item.goods = {
					id: item.goods_id,
					brand_id: item.brand_id,
					brand_name: item.brand_name,
					base_discounted_price: item.goods_base_discounted_price,
					option_extra_amount: item.option_extra_amount,
					headline: item.goods_headline,
					name: item.goods_name,
					price: item.goods_sell_price,
					stock: item.goods_stock,
					is_soldout: item.is_soldout,
					thumbnail_url: item.goods_thumbnail_url,
				};
			});

			return bundle;
		});

		packs.value = response.packs.map((pack, index) => {
			pack.key = `${index}_${uuid()}`;
			pack.items = pack.items.map(item => {
				// 상품타입 변환
				item.goods = {
					id: item.goods_id,
					brand_id: item.brand_id,
					brand_name: item.brand_name,
					base_discounted_price: item.goods_base_discounted_price,
					option_extra_amount: item.option_extra_amount,
					headline: item.goods_headline,
					name: item.goods_name,
					price: item.goods_sell_price,
					stock: item.goods_stock,
					is_soldout: item.is_soldout,
					thumbnail_url: item.goods_thumbnail_url,
				};

				return item;
			});

			return pack;
		});

		return packs.value;
	};

	return {
		packs,
		options,
		count,
		/** 장바구니 조회 처리  */
		getCartPacks,
		/** 수량만 조회 */
		getCount: async () => {
			const { cart_count } = await useBackend().command<{
				cart_count: number;
			}>('v1/shopping/carts/count');

			return count.value = cart_count;
		},
		/** 장바구니 담기 */
		add: async (addToCart: AddForCart[] | AddForCart) => {
			const { cart_count } = await useBackend().command<{ cart_count: number }>('v1/shopping/carts', {
				method: 'post',
				data: {
					goods_options: Array.isArray(addToCart) ? addToCart : [addToCart],
				},
			});

			count.value = cart_count;
		},
		/** 장바구니 아이템 삭제 */
		remove: async (cartItem: CartItem[] | CartItem) => {
			const cartItems = Array.isArray(cartItem) ? cartItem : [cartItem];
			const { cart_count } = await useBackend().command<{ cart_count: number }>('v1/shopping/carts/remove', {
				method: 'post',
				data: {
					cart_ids: cartItems.map(item => item.cart_id),
				},
			});

			count.value = cart_count;
		},
		/** [패키지 상품 전용] 장바구니 담기 */
		addBundle: async (addToCart: AddForBundleCart[] | AddForBundleCart) => {
			const { cart_count } = await useBackend().command<{ cart_count: number }>('v1/shopping/carts/bundle', {
				method: 'post',
				data: {
					goods_options: Array.isArray(addToCart) ? addToCart : [addToCart],
				},
			});

			count.value = cart_count;
		},
		/** [패키지 상품 전용] 카트 아이템 수정 */
		modifyBundle: async (bundleId: number, items: { cart_id: number; option_id: number }[], ea: number) => {
			await useBackend().command('v1/shopping/carts/bundle/update', {
				method: 'post',
				data: {
					bundle_goods_id: bundleId,
					items,
					ea,
				},
			});
		},
		/** 장바구니 ID로 장바구니 아이템 다중삭제 */
		removeByIds: async (cartId: number[]) => {
			const { cart_count } = await useBackend().command<{ cart_count: number }>('v1/shopping/carts/remove', {
				method: 'post',
				data: {
					cart_ids: cartId,
				},
			});
			count.value = cart_count;
		},
		/** 카트 아이템 수정 */
		modify: async (cartItem: CartItem, optionId: number, ea: number) => {
			await useBackend().command('v1/shopping/carts/update', {
				method: 'post',
				data: {
					cart_id: cartItem.cart_id,
					option_id: optionId,
					ea,
				},
			});
		},
		/** 장바구니 총괄 컨텍스트 */
		context: async (isMember: boolean) => {
			const cartPacks = ref<CartPack[]>(await getCartPacks());
			const allCartItems = computed(() => cartPacks.value.flatMap(pack => pack.items));
			const buyableCartItems = computed(() => allCartItems.value
				.filter(cartItem => !cartItem.is_soldout && cartItem.ea <= cartItem.option_stock)
			);

			const buyableBundleItems = computed(() => bundlePacks.value.filter(bundlePack => !bundlePack.is_soldout && bundlePack.ea <= bundlePack.low_item_stock));
			const checkedBundleItems = ref<CartBundle[]>([...buyableBundleItems.value]);

			const checkedCartItems = ref<CartItem[]>([...allCartItems.value]);
			const checkAllCartItem = computed({
				get: () => checkedCartItems.value.length === allCartItems.value.length && checkedBundleItems.value.length === bundlePacks.value.length,
				set: (value: boolean) => {
					checkedCartItems.value = value ? [...allCartItems.value] : [];
					checkedBundleItems.value = value ? [...bundlePacks.value] : [];
				},
			});
			/** 장바구니 패킹별 가격정보 */
			const priceContextByPack = computed(() => {
				const context: PriceContextByPackKey = {};
				for (const pack of cartPacks.value) {
					const checkedCartItemsInPack = checkedCartItems.value.filter(checkedCartItem => pack.items.some(cartItem => cartItem.cart_id === checkedCartItem.cart_id));
					const goodsSellPrice = checkedCartItemsInPack.reduce((sum, cartItem) => sum + ((cartItem.goods_sell_price + cartItem.option_extra_amount) * cartItem.ea), 0);
					const goodsBaseDiscountAmount = checkedCartItemsInPack.reduce((sum, cartItem) => sum + ((cartItem.goods_sell_price - cartItem.goods_base_discounted_price) * cartItem.ea), 0);
					const goodsPrice = goodsSellPrice - (isMember ? goodsBaseDiscountAmount : 0);

					const shippingPrice = pack.shipping_price_policy === 0
						? 0
						: pack.shipping_price_policy === 1
							? pack.shipping_price
							: pack.is_charge_on_each
								? checkedCartItemsInPack.reduce((sum, cartItem) => {
									const eachGoodsPrice = isMember ? cartItem.goods_base_discounted_price : cartItem.goods_sell_price;

									return sum + (eachGoodsPrice >= pack.conditional_free_from ? 0 : pack.shipping_price * cartItem.ea);
								}, 0)
								: goodsPrice >= pack.conditional_free_from ? 0 : pack.shipping_price;

					const checkedPackShippingPrice = checkedCartItemsInPack.length > 0 ? shippingPrice : 0;

					context[pack.key] = {
						goodsSellPrice,
						goodsBaseDiscountAmount,
						goodsPrice,
						shippingPrice,
						checkedPackShippingPrice,
						totalPrice: goodsPrice + checkedPackShippingPrice,
					};
				}

				for (const bundlePack of bundlePacks.value) {
					const checkedCartItemsInBundle = checkedBundleItems.value.find(checkedBundleItem => checkedBundleItem.key === bundlePack.key);
					const goodsSellPrice = checkedCartItemsInBundle
						? checkedCartItemsInBundle.items.reduce((sum, cartItem) => sum + ((cartItem.goods_sell_price + cartItem.option_extra_amount) * checkedCartItemsInBundle.ea), 0)
						: 0;

					const goodsBaseDiscountAmount = checkedCartItemsInBundle
						? checkedCartItemsInBundle.items.reduce((sum, cartItem) => sum + ((cartItem.goods_sell_price - cartItem.goods_base_discounted_price) * checkedCartItemsInBundle.ea), 0)
						: 0;

					const goodsPrice = goodsSellPrice - (isMember ? goodsBaseDiscountAmount : 0);

					context[bundlePack.key] = {
						goodsSellPrice,
						goodsBaseDiscountAmount,
						goodsPrice,
						shippingPrice: 0,
						checkedPackShippingPrice: 0,
						totalPrice: goodsPrice,
					};
				}

				return context;
			});

			const totalPriceContext = computed(() => {
				const priceContextValues = Object.values(priceContextByPack.value);
				const goodsSellPrice = priceContextValues.reduce((sum, priceContext) => sum + priceContext.goodsSellPrice, 0);
				const shippingPrice = priceContextValues.reduce((sum, priceContext) => sum + priceContext.checkedPackShippingPrice, 0);
				const baseDiscountAmount = priceContextValues.reduce((sum, priceContext) => sum + priceContext.goodsBaseDiscountAmount, 0);

				return {
					goodsSellPrice,
					shippingPrice,
					baseDiscountAmount,
					payAmount: goodsSellPrice + shippingPrice - baseDiscountAmount,
				};
			});

			watch(buyableCartItems, () => {
				// buyableCartItems 변동시 새로운 buyableCartItems 기반으로 checkedCartItems 갱신
				checkedCartItems.value = checkedCartItems.value
					.map(legacy => buyableCartItems.value.find(cartItem => cartItem.cart_id === legacy.cart_id))
					.filter(defined);
			});

			watch(buyableBundleItems, () => {
				checkedBundleItems.value = checkedBundleItems.value
					.map(legacy => buyableBundleItems.value.find(bundle => bundle.key === legacy.key))
					.filter(defined);
			});

			return {
				cartPacks,
				bundlePacks,
				buyableCartItems,
				checkedBundleItems,
				checkedCartItems,
				checkAllCartItem,
				priceContextByPack,
				totalPriceContext,
				reload: async () => cartPacks.value = await getCartPacks(),
			};
		},
		/** 옵션/수량 변경 가능 컨텍스트 조회 */
		getModifyContext: async (cartItem: CartItem): Promise<CartItemModifyContext> => {
			if (!options.value[cartItem.goods.id]) options.value[cartItem.goods.id] = await getOptions(cartItem.goods_id);
			const optionContext = options.value[cartItem.goods.id];

			return {
				cartItem,
				legacyOption: optionContext.find(option => option.sub.find(subOption => subOption.code === cartItem.option_id)),
				legacySubOption: optionContext.flatMap(option => option.sub).find(subOption => subOption.code === cartItem.option_id),
				buyAmount: cartItem.ea,
				options: [...optionContext],
				isSingleOption: optionContext.length === 1 && optionContext[0].sub.length === 1,
			};
		},
		/** 옵션/수량 변경 가능 컨텍스트 조회 */
		getModifyBundleContext: async (cartItem: CartBundle): Promise<BundleCartItemModifyContext> => {
			if (!bundleOptions.value[cartItem.goods.id]) bundleOptions.value[cartItem.goods.id] = await getBundleOptions(cartItem.goods.id);
			const optionContext = bundleOptions.value[cartItem.goods.id];

			const cartItem1 = cartItem.items[0];
			const cartItem1Options = optionContext.find(option => option.goods_id === cartItem1.goods_id);
			const cartItem2 = cartItem.items[1];
			const cartItem2Options = optionContext.find(option => option.goods_id === cartItem2.goods_id);

			if (!cartItem1Options || !cartItem2Options) {
				throw new Error('옵션 정보가 없습니다.');
			}

			const child1LegacyOption = cartItem1Options.options.find(option => option.sub.find(subOption => subOption.code === cartItem1.option_id));
			const child2LegacyOption = cartItem2Options.options.find(option => option.sub.find(subOption => subOption.code === cartItem2.option_id));


			if (!child1LegacyOption || !child2LegacyOption) {
				throw new Error('옵션 정보가 없습니다.');
			}

			return {
				bundle_goods_id: cartItem.goods.id,
				child_goods_1: {
					cartItem: cartItem1,
					legacyOption: child1LegacyOption,
					// legacyOption: {
					// 	name: child1LegacyOption.name,
					// 	is_selectable: child1LegacyOption.is_selectable,
					// 	/** 옵션 추감액 */
					// 	extra_amount: child1LegacyOption.extra_amount,
					// 	/** 서브옵션 */
					// 	sub: child1LegacyOption.sub,
					// 	goods_base_discounted_price: cartItem1.goods_base_discounted_price,
					// 	goods_name: cartItem1.goods_name,
					// 	goods_id: cartItem1.goods_id,

					// },
					legacySubOption: child1LegacyOption.sub.find(sub => sub.code === cartItem1.option_id),
					options: cartItem1Options,
				},
				child_goods_2: {
					cartItem: cartItem2,
					legacyOption: child2LegacyOption,
					// legacyOption: {
					// 	name: child2LegacyOption.name,
					// 	is_selectable: child2LegacyOption.is_selectable,
					// 	/** 옵션 추감액 */
					// 	extra_amount: child2LegacyOption.extra_amount,
					// 	/** 서브옵션 */
					// 	sub: child2LegacyOption.sub,
					// 	goods_base_discounted_price: cartItem2.goods_base_discounted_price,
					// 	goods_name: cartItem2.goods_name,
					// 	goods_id: cartItem2.goods_id,

					// },
					legacySubOption: child2LegacyOption.sub.find(sub => sub.code === cartItem2.option_id),
					options: cartItem2Options,
				},
				buyAmount: cartItem.ea,
			};
		},
	};
};