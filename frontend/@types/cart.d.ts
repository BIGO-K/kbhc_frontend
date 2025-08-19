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

type CartBundle = {
	key: string;
	cart_ids: number[];
	ea: number;
	bundle_uuid: string;
	usable_pay_method_code: number;
	usable_pay_method_label: string;
	goods: Pick<Goods, 'id' | 'base_discounted_price' | 'name' | 'thumbnail_url' > & { type: string; sell_price: number };
	is_soldout: boolean;
	low_item_stock: number;
	items: CartItem[];
};

type CartItem = {
	brand_id: number;
	brand_name: string;
	cart_id: number;
	ea: number;
	bundle_uuid?: string;
	goods_base_discounted_price: number;
	goods_headline: Nullable<string>;
	goods_id: number;
	bundle_goods_id?: Nullable<number>;
	goods_name: string;
	goods_sell_price: number;
	goods_stock: number;
	goods_thumbnail_url: string;
	goods_type: GOODS_TYPE;
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
	usable_pay_method_code: number;
	usable_pay_method_label: string;
};


type CartItemModifyContext = {
	cartItem: CartItem;
	legacyOption?: GoodsOption;
	legacySubOption?: GoodsSubOption;
	isSingleOption: boolean;
	options: GoodsOption[];
	buyAmount: number;
};

type BundleItem = {
	cartItem: CartItem;
	legacyOption?: BundleOption;
	legacySubOption?: GoodsSubOption;
	options: BundleGoodsOptions;
};

type BundleCartItemModifyContext = {
	bundle_goods_id: number;
	child_goods_1: BundleItem;
	child_goods_2: BundleItem;
	buyAmount: number;
};

type PriceContextByPackKey = Record<string, {
	goodsSellPrice: number;
	goodsBaseDiscountAmount: number;
	goodsPrice: number;
	shippingPrice: number;
	checkedPackShippingPrice: number;
	totalPrice: number;
}>;

type AddForCart = {
	goods_id: number;
	option_id: number;
	ea: number;
};

type AddForBundleCart = {
	bundle_goods_id: number;
	option_ids: number[];
	ea: number;
};