/** 주문서 */
type OrderSheet = {
	need_personal_clearance_code: boolean;
	orderer_information: {
		email: Nullable<string>;
		phone: string;
		personal_clearance_code: Nullable<string>;
		point_balance: number;
		latest_payment_method_code: Nullable<number>;
		latest_payment_card_code: Nullable<number>;
		latest_payment_bank_code: Nullable<number>;
		latest_payment_depositor_name: Nullable<string>;
		latest_cash_receipt_apply_type: Nullable<number>;
		latest_cash_receipt_apply_key: Nullable<string>;
		latest_shipping_message: Nullable<string>;
	};
	packs: OrderSheetPack[];
	giveaway_groups: OrderSheetGiveawayGroup[];
};

type OrderSheetGiveawayGroup = {
	goods_id: number;
	giveaways: OrderSheetGiveaway[];
};
type OrderSheetGiveaway = Omit<Giveaway, 'start_at' | 'end_at'>;

type OrderSheetSelectedGiveaway = {
	goods_id: number;
	giveaway_id: Nullable<number>;
};

type DiscountByItem = Record<string, {
	unitPrice: number;
	baseDiscountAmount: number;
	nightSaleAmount: number;
	couponDiscountAmount: number;
	immediatelySaleAmount: number;
	totalDiscountedPrice: number;
	totalDiscountAmount: number;
}>;

type OrderSheetPack = {
	charged_shipping_price: number;
	condition_amount: number;
	conditional_free_from: number;
	extra_shipping_price: number;
	items: OrderSheetPackItem[];
	shipping_price: number;
	shipping_price_payment_type: number;
	shipping_price_policy: number;
	shipping_rule_id: number;
	shipping_rule_title: string;
	shipping_type: number;
	mergedOrderItems: OrderSheetMergedOrderItems[];
};

type OrderSheetPackItem = {
	uuid: string;
	appliable_immediately_sale: null | Discounter & {
		id: number;
		title: string;
	};
	goods: OrderSheetPackItemGoods;
	option: {
		id: number;
		name: string;
		extra_amount: number;
	};
	brand_id: number;
	brand_name: string;
	goods_base_discounted_price: number;
	goods_headline: string | null;
	goods_id: number;
	goods_list_price: number;
	goods_name: string;
	goods_sell_price: number;
	goods_thumbnail_url: string;
	goods_type: string;
	night_sale_amount: number | null;
	night_sale_id: number | null;
	option_extra_amount: number;
	option_id: number;
	option_name: string;
	seller_id: number;
	seller_name: string;
	usable_coupon_regists: OrderSheetUsableCouponRegist[];
};

type OrderSheetMergedOrderItems = {
	key: string;
	seller_name: string;
	usable_coupon_regists: OrderSheetUsableCouponRegist[];
	goods: OrderSheetPackItemGoods;
	option: {
		id: number;
		name: string;
		extra_amount: number;
	};
	ea: number;
	list: OrderSheetPackItem[];
};

type OrderSheetUsableCouponRegist = {
	regist_id: number;
	coupon: Pick<Coupon, 'id' | 'title' | 'discount_amount' | 'discount_type' | 'maximum_discount_amount'> & {
		expire_at: string;
	};
};

type OrderSheetPackItemGoods = Pick<Goods, 'id' | 'brand_name' | 'name' | 'thumbnail_url' | 'headline' | 'base_discounted_price'> & { sell_price: number };

type SelectedForOrder = {
	goods_id: number;
	option_id: number;
	ea: number;
	cart_id?: number;
};

type OrderProcess = {
	order_id: string;
	selected: SelectedForOrder[];
};
type PayMethod = {
	code: number;
	label: string;
	eng_label: string;
	child_methods?: {
		code: number;
		label: string;
	}[];
};
type OrderSheetAppliedCouponRegist = Record<string, OrderSheetUsableCouponRegist | undefined>;
type OrderSheetTotalDiscountedPrice = Record<string, number>;

type OrderPrePareForm = {
	orderer_info: {
		email: string;
		personal_clearance_code: string;
		is_remember_personal_clearance_code: boolean;
		name: string;
		phone: string;
	};
	receive_address: {
		id?: number;
		shipping_name?: string;
		name: string;
		phone: string;
		zip_code: string;
		base_address: string;
		detail_address: string;
		is_extra_area: boolean;
		message: string;
	};
	payment_info: {
		method: number;
		card_code?: number;
		interest_month?: number;
		is_interest_free: boolean;
		is_partial_interest: boolean;
		bank_code?: number;
		depositor_name: string;
		cash_receipt_apply_type: number;
		cash_receipt_apply_key: string;
		using_point: number;
		for_payment_price: number;
	};
	packs: PackForOrder[];
	refund_account: Nullable<{
		owner_name: string;
		bank_code: string;
		account_number: string;
	}>;
	giveaways: {
		goods_id: number;
		giveaway_id: Nullable<number>;
	}[];
	my_pay_virtual_id: Nullable<string>;
};

type OrderResult = {
	packs: {
		shipping_price: number;
		mergedOrderItems: OrderSheetResultMergedOrderItems[];
		is_dawn_delivery: boolean;
		items: OrderResultPackItem[];
	}[];
	receive_address: {
		shipping_name: Nullable<string>;
		base_address: string;
		detail_address: string;
		zip_code: string;
		name: string;
		phone: string;
		message: Nullable<string>;
		entrance_description: string;
	};
	payment_info: {
		label: string;
		eng_label: string;
		card_label: string;
		card_masking_number: string;
		approve_at: string;
		bank_label: string;
		bank_account_number: string;
		bank_input_expire_date: string;
		buy_point: number;
		bank_depositor_name: string;
	};
	giveaways: {
		id: number;
		name: string;
		condition_label: string;
		image_url: string;
		image_alt: string;
	}[];
};

type OrderResultPack = {
	shipping_price: number;
	mergedOrderItems: OrderResultMergedOrderItems[];
	items: OrderResultPackItem[];
};

type OrderResultPackItem = {
	uuid: string;
	appliable_immediately_sale: null | Discounter & {
		id: number;
		title: string;
	};
	goods: OrderSheetPackItemGoods;
	option: {
		id: number;
		name: string;
		extra_amount: number;
	};
	brand_id: number;
	brand_name: string;
	goods_base_discounted_price: number;
	goods_headline: string | null;
	goods_id: number;
	goods_list_price: number;
	goods_name: string;
	goods_sell_price: number;
	goods_thumbnail_url: string;
	goods_type: string;
	night_sale_amount: number | null;
	night_sale_id: number | null;
	option_extra_amount: number;
	option_id: number;
	option_name: string;
	seller_id: number;
	seller_name: string;
	usable_coupon_regists: OrderSheetUsableCouponRegist[];
};

type OrderResultMergedOrderItems = {
	key: string;
	seller_name: string;
	goods: OrderSheetPackItemGoods;
	option: {
		id: number;
		name: string;
		extra_amount: number;
	};
	ea: number;
	list: OrderResultPackItem[];
};