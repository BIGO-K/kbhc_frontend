/** 래플 */
type Raffle = {
	id: number;
	/** 래플 상태값 */
	status: 'UPCOMING' | 'ENTRY_START' | 'ENTRY_END' | 'NOTICE_START' | 'BUY_START' | 'BUY_END';
    /** 이용가능 디바이스 리스트 */
	available_device_list: ('M_APP' | 'M_WEP' | 'PC')[];
    /** 응모 시작일 */
	entry_start_at: string;
    /** 응모 종료일 */
	entry_end_at: string;
    /** 발표일시 */
	notice_at: string;
    /** 구매 시작일 */
	buy_start_at: string;
    /** 구매 종료일 */
	buy_end_at: string;
    /** 총 참여자 수 */
	total_entry_count: number;
    /** 래플 참여 여부 */
	is_entry: boolean;
    /** 당첨자 추첨 진행 여부 */
	is_confirmed_winner: boolean;
    /** 상품 */
	goods: Pick<Goods,
	'id' |
	'thumbnail_url' |
	'name' |
	'brand_name' |
	'price' |
	'base_discounted_price' |
	'sale_rate' |
	'is_only_adult'
	>;
};

/** 래플 상세 */
type RaffleDetail = Pick<Raffle,
'id' |
'status' |
'available_device_list' |
'entry_start_at' |
'entry_end_at' |
'buy_start_at' |
'buy_end_at' |
'is_confirmed_winner' |
'is_entry' |
'notice_at'
> & {
    /** 상품 ID */
	goods_id: number;
    /** 참여 인원 */
	participant_count: number;
    /** 목표 당첨자 수 */
	limit_winners: number;
};

/** 회원 래플 응모 내역 */
type MyRaffle = Pick<Raffle,
'id' |
'status' |
'notice_at' |
'buy_start_at' |
'buy_end_at' |
'is_confirmed_winner'
> & {
	/** 당첨여부 */
	is_winner: boolean;
	/** 당첨 후 구매여부 */
	is_bought: boolean;
	goods: Pick<Goods, 'id' | 'name' | 'brand_name' | 'thumbnail_url'>;
};

/** 래플 당첨자 */
type RaffleWinner = {
    /** 유저 아이디 (마스킹) */
	login_id: string;
    /** 유저명 (마스킹) */
	name: string;
};

/** 래플 응모 정보 */
type RaffleEntryInfo = Pick<PersonalInformation, 'name' | 'login_id' | 'phone'>;