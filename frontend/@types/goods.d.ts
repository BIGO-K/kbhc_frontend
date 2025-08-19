type GoodsRequiredKey = Extract<keyof Goods, 'id' | 'name' | 'thumbnail_url' | 'headline'>;
type GoodsUsableKey = Exclude<keyof Goods, GoodsRequiredKey>;

type Goods = {
	id: number;
	headline: Nullable<string>;
	name: string;
	thumbnail_url: string;
	// mouse_over_image_url: string;
	price: number;
	base_discounted_price: number;
	badges: string[];// ('무료배송' | '쿠폰' | '최근배송지')[]
	brand_id: number;
	brand_name: string;
	icon: Nullable<{
		background_color_code: string;
		font_color_code: string;
		label: string;
	}>;
	sale_rate: number;
	stock: number;
	is_only_adult: boolean;
	is_soldout: boolean;
	is_use_stock_notify: boolean;
	review_score_average: number;
	review_count: number;
	wish_count: number;
	basic_category?: GoodsForCategory;
};

/** 정기구독 상품 정보 */
type GoodsSubScribe = {
	/** 회차 */
	nth: number;
	/** 정기구독 결제 기간 */
	interval_of_days: number;
};

/** 필수를 제외한 Goods 타입 */
type OptianalGoods = Partial<Goods> & Pick<Goods, GoodsRequiredKey>;

type GoodsForCategory = {
	code: string;
	full_label: string;
	/** 접근 가능한 카테고리 정보 */
	accessable_grades: {
		id: number;
		name: string;
	}[];
};

type GoodsDetail = Pick<Goods, 'id' | 'headline' | 'name' | 'brand_id' | 'brand_name' | 'is_only_adult' | 'is_use_stock_notify'> & {
	is_giftable: boolean;
	seller_id: number;
	image_url: string;
	thumbnail_urls: string[];
	is_custom_made: boolean;
	is_oversea_delivery: boolean;
	sale_reserve?: {
		sell_start_at: string;
		sell_end_at: string;
		ship_start_at: string;
		ship_end_at: string;
	};
	degree_360_image_urls: string[];
	type: string;
	category: {
		full_label: string;
		depth1_category_code: string;
		depth2_category_code: string;
		depth3_category_code: string;
	};
	giveaways: {
		id: number;
		condition_label: string;
		name: string;
		image_url: string;
		start_at: string;
		end_at: string;
	}[];
	is_use_seller_shop: boolean;
	/** 배송정보 관련해서 KB에 무형상품 이슈로 인해 nullable 추가 */
	custom_made_delivery_day: Nullable<number>;
	delivery_info: Nullable<GoodsDeliveryInfo>;
	oversea_delivery_min: Nullable<number>;
	oversea_delivery_max: Nullable<number>;
	return_delivery_info: Nullable<GoodsReturnDeliveryInfo>;
	subscribe: Nullable<GoodsSubScribe>;
	usable_pay_method_code: number;
	usable_pay_method_label: string;
	/** 상품 공급자 구분 */
	provider: string;
};

type GoodsDeliveryShippingArrivalProbability = {
	average_date: string;
	probability: number;
};

type GoodsDeliveryInfo = {
	conditional_free_price: number;
	extra_shipping_price: number;
	is_conditional_free_delivery: boolean;
	is_free_delivery: boolean;
	is_package_delivery: boolean;
	shipping_arrival_probability_list: GoodsDeliveryShippingArrivalProbability[];
	shipping_center_name: string;
	shipping_company: string;
	shipping_price: number;
	today_exportable_message: string;
};

type GoodsReturnDeliveryInfo = {
	ceo_name: string;
	company_name: string;
	return_address: string;
	return_shipping_price: number;
	shipping_company: string;
	tel: string;
};

/** [상품] 옵션 */
type GoodsOption = {
	/** 옵션 명칭 */
	name: string;
	/** 선택가능여부 */
	is_selectable: boolean;
	/** 옵션 추감액 */
	extra_amount: number;
	/** 서브옵션 */
	sub: GoodsSubOption[];
};

/** [상품] 서브옵션 */
type GoodsSubOption = TypeCodeName & {
	/** 옵션 수량 */
	qty: number;
	/** 선택가능여부 */
	is_selectable: boolean;
	/** 옵션 추감액 */
	extra_amount: number;
};

/** [상품] 프로모션 정보 */
type GoodsPromotion = {
	/** 정가 */
	price: number;
	/** 판매가 */
	sell_price: number;
	/** 1차 할인가 */
	base_discounted_price: number;
	/** 정가 대비 1차 할인율(%) */
	sale_rate: number;
	/** 심야할인액 */
	night_sale_amount: number;
	/** 다운로드 가능한 쿠폰 존재 여부 */
	is_downloadable_coupon: boolean;
	/** 가장 높은 다운로드 쿠폰 할인액 */
	highest_downloadable_coupon_amount: number;
	/** 즉시 할인액 */
	immediately_sale_amount: number;
	/** 타임특가 할인액 */
	time_sale_amount: number;
	/** 최종 할인가(결제가) */
	max_discounted_price: number;
	/** 구매 가능여부 */
	purchasable: boolean;
};

/** [상품] 재고 상태 */
type GoodsStockState = {
	is_soldout: boolean;
	stock: number;
};

/** [상품] 배너 정보 */
type GoodsDetailBanner = {
	is_editor_use: boolean;
	contents: string;
	image_url: string;
	image_alt: string;
};

/** [상품] 상세 정보 */
type GoodsInformation = {
	detail_info: string;
	mandatory: {
		title: string;
		content: string;
	}[];
	origin_label: string;
	use_state_label: string;
	video_url: Nullable<string>;
	top_banners: GoodsDetailBanner[];
	bottom_banners: GoodsDetailBanner[];
	seller_holiday_message: string;
	seller_holiday?: {
		reason: string;
		start_at: string;
		end_at: string;
		release_at: string;
	};
};

/** [상품] 리뷰항목 통계 */
type GoodsReviewTemplateStatistics = {
	id: number;
	title: string;
	/** 하위항목 */
	subdivision_list: GoodsReviewTemplateSubDivision[];
};

type GoodsReviewTemplateSubDivision = TypeIdLabel & {
	/** [하위 항목] 선택한 인원 수 */
	selected_count: number;
	/** [하위 항목] 선택한 비율 */
	selected_rate: number;
	/** [하위 항목] 가장 많이 선택한 항목 여부 */
	is_highest: boolean;
};

/** [상품] 리뷰/문의/좋아요 집계 */
type GoodsReactionAggregate = {
	/** 리뷰어 수 */
	reviewer_count: number;
	/** 리뷰 수 */
	total_review_count: number;
	/** 리뷰 평균 별점 */
	review_average_star: number;
	/** 리뷰 만족도 */
	satisfaction: number;
	/** Q&A 수 */
	total_qna_count: number;
	/** 좋아요 수 */
	wish_count: number;
};

/** 세트상품 */
type PackageGoods = Pick<Goods,
'id' |
'name' |
'base_discounted_price' |
'is_only_adult' |
'thumbnail_url' |
'is_soldout' |
'brand_name' |
'sale_rate' |
'stock'
>;

/** (카테고리/브랜드) 대표 상품 */
type BestGoods = Pick<Goods,
'id' |
'name' |
'base_discounted_price' |
'is_only_adult' |
'thumbnail_url' |
'is_soldout' |
'brand_name' |
'sale_rate' |
'stock'
>;

/** 사은품 */
type Giveaway = {
	id: number;
	name: string;
	condition_label: string;
	image_alt: string;
	image_url: string;
	start_at: string;
	end_at: string;
};

type GiveawayTargetGoodsPaginator = Paginator<Pick<Goods, 'id' | 'name' | 'brand_name' | 'thumbnail_url' | 'headline'>>;

type SelectedOption = {
	name: string;
	sub: GoodsSubOption | undefined;
	subOptions: GoodsSubOption[];
	buyAmount?: number;
};

type GoodsSort = 'selling' | 'recent' | 'lowprice' | 'highprice' | 'salerate' | 'review_count';

/** 선택된 옵션 항목 * */
type SelectedItem = {
	name: string;
	option_name: string;
	code: number;
	stock: number;
	buy_amount: number;
	option_price: number;
	goods_price: number;
};

type GOODS_TYPE = 'RF' | 'JP' | 'GF' | 'DG' | 'SB' | 'BD' | 'GN' | 'TS';