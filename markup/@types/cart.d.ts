type CartPack = {
	key: string;
	conditional_free_from: number;
	extra_shipping_price: number;
	is_charge_on_each: boolean;
	seller_id: number;
	seller_name: string;
	shipping_price: number;
	shipping_price_policy: number;
	shipping_rule_title: string;
	items: CartItem[];
};

type CartItem = {
	brand_id: number;
	brand_name: string;
	cart_id: number;
	ea: number;
	goods_base_discounted_price: number;
	goods_headline: Nullable<string>;
	goods_id: number;
	goods_name: string;
	goods_sell_price: number;
	goods_stock: number;
	goods_thumbnail_url: string;
	goods_type: string;
	is_soldout: boolean;
	option_extra_amount: number;
	option_id: number;
	option_name: string;
	option_stock: number;
	seller_id: number;
	seller_name: string;
	goods: Pick<Goods, 'id' | 'brand_id' | 'brand_name' | 'base_discounted_price' | 'headline' | 'name' | 'price' | 'stock' | 'is_soldout' | 'thumbnail_url'> & {
		option_extra_amount: number;
	};
};


type CartItemModifyContext = {
	cartItem: CartItem;
	legacyOption?: GoodsOption;
	legacySubOption?: GoodsSubOption;
	isSingleOption: boolean;
	options: GoodsOption[];
	buyAmount: Ref<number>;
};

type PriceContextByPackKey = Record<string, {
	goodsSellPrice: number;
	goodsBaseDiscountAmount: number;
	goodsPrice: number;
	shippingPrice: number;
	totalPrice: number;
}>;