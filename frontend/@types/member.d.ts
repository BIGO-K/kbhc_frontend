type BenefitStates = { point: number; coupon_count: number };

type OrderStateAndCount = {
	count: number;
	status_code: number;
};

type OrderStates = {
	pay_ready: OrderStateAndCount;
	paid: OrderStateAndCount;
	delivery_ready: OrderStateAndCount;
	delivery_ing: OrderStateAndCount;
	delivery_complete: OrderStateAndCount;
	purchase_confirmed: OrderStateAndCount;
	cancel_count: number;
	return_count: number;
	exchange_count: number;
	refund_count: number;
};

type AuthorizeMember = Member;

/** 회원 */
type Member = {
	name: string;
	/** 등급정보 */
	grade: Pick<MemberGrade, 'id' | 'image_url' | 'name'>;
	usable_star_point: boolean;
};

type MemberGrade = {
	id: number;
	name: string;
	image_url: string;
	is_default: boolean;
	order_seq: number;
	grade_up_sell_price_condition: number;
	grade_up_sell_amount_condition: number;
	purchase_benefit_rate: number;
	coupons: MemberGradeCoupon[];
};

type MemberGradeCoupon = Coupon & {
	is_unlimited: boolean;
	download_limit: number;
};

/** 등급업 조건 정보 */
type MemberGradeUpCondition = {
	/** 회원 주문액수 */
	order_amount: number;
	/** 회원 주문건수 */
	order_count: number;
	/** 승급조건: 주문액수 */
	grade_up_order_amount_condition: number;
	/** 승급조건: 주문건수 */
	grade_up_order_count_condition: number;
	/** 다음 등급명 */
	next_grade_name: string;
	/** (현재 등급)최상위등급 여부 */
	is_top_level: boolean;
	/** 등급업 산출기간(월단위) */
	grade_up_calculation_period_month: number;
};

type LoginResult = MemberToken & {
	user: {
		name: string;
		grade: {
			id: number;
			image_url: string;
			name: string;
		};
	};
	usable_star_point: boolean;
};

type MemberToken = {
	token: string;
	refresh_token: string;
	expiry_at: string;
};

type ThirdPartyPlatforms = 'kakao' | 'naver' | 'apple' | 'facebook' | 'payco' | 'kakao_sync';

type ThirdPartyAuthPlatform = {
	code: ThirdPartyPlatforms;
	buttonClass: string;
	iconClass: string;
	label: string;
};

/** 회원 개인 정보 */
type PersonalInformation = {
	login_id: string;
	name: string;
	phone: string;
	regist_type: ThirdPartyPlatforms | 'shop';
	birthday: string;
	email: string;
	is_email_receive: boolean;
	is_sms_receive: boolean;
};