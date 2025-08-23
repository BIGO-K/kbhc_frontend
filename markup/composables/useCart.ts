import { computed, ref, watch } from 'vue';
import { defined } from '$/utils/array';
import { useBackend } from '$/composables/useBackend';
import { useGoodsAdditional } from '$/composables/useGoodsAdditional';

type AddForCart = {
	goods_id: number;
	option_id: number;
	ea: number;
};

export const useCart = () => {
	const { getOptions } = useGoodsAdditional();

	const packs = ref<CartPack[]>([]);
	const options = ref<Record<number, GoodsOption[]>>({});
	const count = ref<number>(0);

    /** 장바구니 조회 처리  */
	const getCartPacks = async () => {
		const response = await useBackend().command<{
			packs: CartPack[];
		}>('v1/shopping/carts', {
			isForce: true,
		});

		return packs.value = response.packs.map((pack, index) => {
			pack.key = `${index}_${pack.seller_id}_${pack.shipping_rule_title}`;
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
			const checkedCartItems = ref<CartItem[]>([...buyableCartItems.value]);
			const checkAllCartItem = computed({
				get: () => checkedCartItems.value.length === buyableCartItems.value.length,
				set: (value) => checkedCartItems.value = value ? [...allCartItems.value] : [],
			});

			/** 장바구니 패킹별 가격정보 */
			const priceContextByPack = computed(() => {
				const context: PriceContextByPackKey = {};
				for (const pack of cartPacks.value) {
					const checkedCartItemsInPack = checkedCartItems.value.filter(checkedCartItem => pack.items.some(cartItem => cartItem.cart_id === checkedCartItem.cart_id));
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

					context[pack.key] = {
						goodsSellPrice,
						goodsBaseDiscountAmount,
						goodsPrice,
						shippingPrice,
						totalPrice: goodsPrice + shippingPrice,
					};
				}

				return context;
			});

			const totalPriceContext = computed(() => {
				const priceContextValues = Object.values(priceContextByPack.value);
				const goodsSellPrice = priceContextValues.reduce((sum, priceContext) => sum + priceContext.goodsSellPrice, 0);
				const shippingPrice = priceContextValues.reduce((sum, priceContext) => sum + priceContext.shippingPrice, 0);
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

			return {
				cartPacks,
				buyableCartItems,
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
				buyAmount: ref<number>(cartItem.ea),
				options: [...optionContext],
				isSingleOption: optionContext.length === 1 && optionContext[0].sub.length === 1,
			};
		},
	};
};