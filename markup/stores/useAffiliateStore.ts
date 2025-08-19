
import { ref, computed } from 'vue';
import { LocationQuery } from 'vue-router';
import { defineStore } from 'pinia';
import { useUserAgent } from '$/composables/useUserAgent';

/** 자체 */
const affiliateShop = [
	'app_push', 	// 앱푸시
	'email', 		// EMAIL 발송
	'sms', 			// SMS 발송
	'google',
];

/** [네이버] */
const affiliateNaver = [
	'naver_mn', 	// 네이버 몰명
	'naver_gfa', 	// 네이버 GFA 성과형
	'naver_kw', 	// 네이버 키워드 검색
	'naver_mkw', 	// 네이버 키워드 검색 M
	'naver_pa',		// 네이버 상품 검색 광고
	'naver_ss', 	// 네이버 쇼핑몰
	'naver_cb', 	// 네이버 카페
	/** [네이버] EP */
	'naver_Pep', 	// 네이버 EP
	'naver_Mep', 	// 네이버 M EP
	/** [네이버] 브랜드검색 */
	'naver_Pbr', 	// 네이버 브랜드 검색
	'naver_Mbr', 	// 네이버 브랜드 검색  M
	/** [네이버] 바로가기 */
	'naver_pc', 	// 네이버 PC
	'naver_mo', 	// 네이버 MO
	/** [네이버] 쇼핑박스 */
	'naver_b1',
	'naver_b2',
	'naver_b3',
	'naver_b4',
	'naver_b5',
	/** [네이버] 맨즈 */
	'naver_m1',
	'naver_m2',
	'naver_m3',
	'naver_m4',
	'naver_m5',
	/** [네이버] 트랜드몰 A형 */
	'naver_tAM', 	// 네이버 트랜드몰 A 형 몰명
	'naver_tA1',
	'naver_tA2',
	'naver_tA3',
	'naver_tA4',
	'naver_tA5',
	'naver_tA6',
	'naver_tA7',
	'naver_tA8',
	/** [네이버] 트랜드몰 B형 */
	'naver_tBM', 	// 네이버 트랜드몰 B형 몰형
	'naver_tB1',
	'naver_tB2',
	'naver_tB3',
];

/** [다음] */
const affiliateDaum = [
	'daum_ep', 		// 다음 EP
	'daum_logo', 	// 다음 몰명
	'daum_cb', 		// 다음 카페, 블로그
	/** [다음] 바로가기 */
	'daum_mo', 		// 다음 M
	'daum_pc', 		// 다음 PC
];

/** [카카오] */
const affiliateKakao = [
	'kakao_kw', 	// 카카오 키워드
	'kakao_biz', 	// 카카오 비즈보드
	'kakao_da', 	// 카카오 디스플레이
	'kakao_pf', 	// 카카오 플친
	'kakao_ch', 	// 카카 채널
	/** [카카오] 쇼핑박스 */
	'kakao_p1',
	'kakao_p2',
	'kakao_p3',
	'kakao_p4',
	'kakao_p5',
	/** [카카오] 쇼핑박스 M */
	'kakao_m1',
	'kakao_m2',
	'kakao_m3',
	'kakao_m4',
	'kakao_m5',
];

/** 소셜 */
const affiliateSns = [
	'youtube',
	'facebook',
	'Instagram',
	'wmp_wd', // 위메프
];

/** 리타겟팅 */
const affiliateRetargeting = [
	'mobion', 	// 모비온
	'doyouad', 	// 두유애드
	'gg_gdn', 	// GDN
	'targetgt', // 타겟팅게이츠
	'criteo', 	// 크리테오
];

// PC >> M 제휴코드
const pcToMobileAffiliates: Record<string, string> = {
	'naver_Mep': 'naver_Pep',
	'naver_mkw': 'naver_kw',
	'naver_Mbr': 'naver_Pbr',
	'daum_mo': 'daum_pc',
	'naver_mo': 'naver_pc',
};

// M >> PC 제휴코드
const mobileToPcAffiliates: Record<string, string> = {
	'naver_Pep': 'naver_Mep',
	'naver_kw': 'naver_mkw',
	'naver_Pbr': 'naver_Mbr',
	'daum_pc': 'daum_mo',
	'naver_pc': 'naver_mo',
};

const affiliateCodes = [...affiliateShop, ...affiliateNaver, ...affiliateDaum, ...affiliateKakao, ...affiliateSns, ...affiliateRetargeting];

export const useAffiliateStore = defineStore('affiliate', () => {
	const { isMobileUser, isAndroidApp, isAppUser } = useUserAgent();

	const defaultAffiliateCode = computed(() => {
		return isMobileUser
			? isAppUser
				? isAndroidApp ? 'app_a' : 'app_i'
				: 'MOBILE'
			: 'PC';
	});
	const currentCode = ref<string>(defaultAffiliateCode.value);

	return {
		currentCode,
		set: (code?: string, query?: LocationQuery) => {
			if (!code || code === '') return;

			// affiliate 코드 확인
			if (!affiliateCodes.includes(code)) {
				currentCode.value = defaultAffiliateCode.value;

				return;
			}

			// 매출 코드 포함된 경우
			currentCode.value = isMobileUser && mobileToPcAffiliates[code]
				// mobile 코드로 넘어왔을 경우 pc 코드로 변환
				? mobileToPcAffiliates[code]
				: !isMobileUser && pcToMobileAffiliates[code]
					// PC에 모바일 코드 넘어오는 경우 치환
					? pcToMobileAffiliates[code]
					: code;

			// 네이버 쇼핑 광고 검색 관련 처리 추가
			if (currentCode.value === 'naver_Pep' || currentCode.value === 'naver_Mep' && query) {
				if (query?.nv_ad && query.nv_ad.includes('pla')) currentCode.value = `naver_pa`;
			}
		},
	};
}, {
	persist: {
		storage: sessionStorage,
	},
});