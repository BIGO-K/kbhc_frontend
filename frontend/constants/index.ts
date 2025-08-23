export const COOP_DEAL_STATUSES: { [key in CoopDealStatus]: key } = {
	upcoming: 'upcoming',
	ongoing: 'ongoing',
	end: 'end',
} as const;

/** 상품별 결제 가능한수단 */
export const USABLE_PAY_TYPES = {
	1: 'PG',
	2: '스타포인트',
	3: 'PG + 스타포인트',
	4: '리워드포인트',
	5: 'PG + 리워드포인트',
	6: '스타포인트 + 리워드포인트',
	7: 'PG + 스타포인트 + 리워드포인트',
} as const;



/** 상품 타입 */
export const GOODS_TYPE_LABEL: { [key in GOODS_TYPE]: string } = {
	'RF': '래플', // 래플상품
	'JP': '공동구매', // 공동 구매
	'GF': '기프티콘', // 기프티콘
	'DG': '무형상품(이용권)', // 무형상품(이용권)
	'SB': '정기구독 상품', // 정기구독 상품
	'BD': '패키지 상품',
	'GN': '일반 상품',
	'TS': '타임딜',
} as const;


export const GOODS_TYPE = {
	'raffle': 'RF', // 래플상품
	'coop': 'JP', // 공동 구매
	'gifticon': 'GF', // 기프티콘
	'digital': 'DG', // 무형상품(이용권)
	'subscribe': 'SB', // 정기구독 상품
	'timedeal': 'TS', // 타임딜
	// 'PO': 'point', // 금액형 상품권 미사용
	'bundle': 'BD', // 묶음 상품
	'general': 'GN', // 일반 상품
} as const;


export const STORE_BASE_KEY = 'operate-kbhc.';
export const STORE_PAY_PROCESS_CONTEXT_KEY = 'paying-context';