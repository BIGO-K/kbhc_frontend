type SearchAddress = {
	zip_code: string;
	/** 지번 */
	jibun_address: string;
	/** 도로명 */
	road_address: string;
};

type MyShippingAddress = {
	/** 받는사람 */
	name: string;
	/** 휴대폰 번호 */
	tel: string;
	/** 우편번호 */
	zip_code: string;
	/** 주소 */
	base_address: string;
	/** 상세주소 */
	detail_address: string;
	message?: string;
};

type MyShippingAddressDetail = MyShippingAddress & {
	id: number;
	/** 배송지명 */
	shipping_name: string;
	/** 최근배송지 여부 */
	is_recent: boolean;
};

type MyShippingAddressStoreForm = Omit<MyShippingAddressDetail, 'id' | 'is_recent' | 'message'>;

type MyClaimShippingAddressForm = Omit<MyShippingAddress, 'id' | 'is_recent' | 'message' | 'name' | 'tel'>;