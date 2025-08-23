
type Gift = {
	/** 선물 주문번호 */
	order_id: string;
	/** 선물 코드 */
	gift_code: string;
	/** 선물 받는사람 이름 */
	receiver_name: string;
	/** 선물 보낸사람 이름 */
	sender_name: string;
	/** 선물 수락(정보입력) 필요여부 */
	gift_acceptance_required: boolean;
	/** 통관부호 입력 필요 여부 */
	personal_clearance_code_required: boolean;
	/** 선물 메시지 */
	gift_info: Nullable<GiftMessage>;
	/** 선물 주문상품 리스트 */
	order_items: GiftOrderItem[];
	/** (입력한) 배송지 정보 */
	shipping_address: Nullable<MyShippingAddress>;
	/** (입력한) 해외배송 개인통관 고유부호 */
	personal_clearance_code: Nullable<string>;
};
type GiftOrderItem = Pick<OrderItem, 'id' | 'voucher_code' | 'goods'>;

/** 선물 메시지 */
type GiftMessage = {
	/** 메시지 카드 이미지 URL */
	background_image_url: string;
	/** 메시지 */
	message: string;
};

/** 선물 수락 FORM */
type GiftAcceptForm = {
	order_id: string;
	shipping_address: Omit<MyShippingAddress, 'name' | 'tel'>;
	personal_clearance_code: Nullable<string>;
	options: ExchangeOptionPair[];
};

type MyGift = {
	order_id: string;
	ordered_at: string;
	gift_message: string;
	bundles: OrderBundlePack<OrderItem>[];
};

type MyGiftDetail = Pick<OrderDetail, 'cancel_ids' | 'exchange_ids' | 'return_ids'> & {
	order: Pick<
	OrderDetail['order'],
	'order_id' |
	'ordered_at' |
	'original_order_id' |
	'receipt_viewable' |
	'shipping_address_changeable' |
	'subscription_info' |
	'bundles'
	> & {
		shipping_address: Nullable<OrderDetail['order']['shipping_address']>;
		payment_info: Nullable<OrderDetail['order']['payment_info']>;
		payment_summary: Nullable<OrderDetail['order']['payment_summary']>;
		/** [선물] 배송지 (입력)필요여부 */
		shipping_address_required: boolean;
		/** [선물] 개인통관고유부호 (입력)필요여부 */
		personal_clearance_code_required: boolean;
		/** [선물] 보내는사람 이름 */
		sender_name: string;
		/** [선물] 수신자 정보 */
		recipient: {
			name: string;
			tel: string;
			/** 개인통관고유부호 */
			personal_clearance_code: Nullable<string>;
		};
		/** [선물] 메시지 정보 */
		gift_info: Nullable<GiftMessage>;
	};
};
