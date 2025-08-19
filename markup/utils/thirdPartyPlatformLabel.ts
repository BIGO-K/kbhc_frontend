import config from '$/utils/config';
import { THIRD_PARTY_TYPES } from '$/constants/THIRDPARTY';

/** 서드파티 라벨 처리 */
const getPlatformLabel = (platform: ThirdPartyPlatforms): string => {
	if (platform === THIRD_PARTY_TYPES.kakao || platform === THIRD_PARTY_TYPES.kakaoSync) return '카카오';
	else if (platform === THIRD_PARTY_TYPES.apple) return '애플';
	else if (platform === THIRD_PARTY_TYPES.naver) return '네이버';
	else return '';
};

const thirdPartyConfig = {
	getLabel: getPlatformLabel,
    // 소셜 사용 가능여부 체크
	isUsablePlatform: (platform: ThirdPartyPlatforms): boolean => {
		return config('paid_features.usable_social_logins').includes(platform);
	},
	usablePlatforms: (): ThirdPartyAuthPlatform[] => {
		const usables = config('paid_features.usable_social_logins');

		// label이 있는 객체만 리턴
		return usables.map(_platform => ({
			code: _platform,
			buttonClass: `btn_${_platform.startsWith('kakao') ? 'kakaotalk' : _platform}`,
			iconClass: `ico_sns-${_platform.startsWith('kakao') ? 'kakao' : _platform}`,
			label: getPlatformLabel(_platform).replace('카카오', '카카오톡'),
		})).filter(_entry => _entry.label !== '');
	},
};

export default thirdPartyConfig;