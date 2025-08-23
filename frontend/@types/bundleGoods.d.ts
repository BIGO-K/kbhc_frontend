type BundleGoodsDetail = {
	bundle: {
		id: number;
		name: string;
		degree_360_image_urls: string[];
		thumbnail_urls: string[];
	};
	goods: BundleChildGoods[];
};

type BundleChildGoods = Pick<Goods, 'id' | 'name' | 'thumbnail_url'> & {
	delivery_info: Nullable<GoodsDeliveryInfo>;
	return_delivery_info: Nullable<GoodsReturnDeliveryInfo>;
	mandatory: {
		title: string;
		content: string;
	}[];
	origin_label: string;
	use_state_label: string;
	brand_name: string;
};

type BundleGoodsInformation = Pick<GoodsInformation, 'detail_info' | 'video_url'>;

type BundleGoodsOptions = {
	/** 패키지 상품 하위 ID */
	goods_id: number;
	/** 패키지 상품 하위 상품진열명 */
	goods_name: string;
	/** 패키지 상품 하위 옵션가격 */
	goods_base_discounted_price: number;
	options: GoodsOption[];
};

type BundleGoodsStockState = {
	is_soldout: boolean;
	stock: number[];
};

type SelectedBundleOption = Omit<BundleGoodsOptions, 'options'> & GoodsOption;

/** 선택된 옵션 항목 * */
type SelectedBundleItem = {
	goods_id: number;
	goods_name: string;
	option_name: string;
	sub_option_name: string;
	code: number;
	stock: number;
	option_price: number;
	goods_price: number;
};

type SelectedBundle = {
	buy_amount: number;
	id: string;
	key: string;
	goods_low_stock: number;
	goods1: SelectedBundleItem;
	goods2: SelectedBundleItem;
};


type BundlePromotion = Pick<GoodsPromotion, 'base_discounted_price' | 'highest_downloadable_coupon_amount' | 'max_discounted_price' | 'price' | 'purchasable' | 'sale_rate' | 'sell_price'>;