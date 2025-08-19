import { computed } from 'vue';
import { useUserAgentStore } from '$/stores/useUserAgentStore';

export const useUserAgent = () => {
	const isAppUser = isMobile('app');
	const isAndroidApp = isMobile('app_android');
	const isIosApp = isMobile('app_ios');
	const isMobileUser = isMobile();
	const isAndroidUser = isMobile('android');
	const isIosUser = isMobile('ios');

	const agentStore = useUserAgentStore();
	const isAppFirstUser = computed(() => {
		return isAppUser && isMobile('app_first') ? !agentStore.hasUserAccessApp : false;
	});

	const currentAppVersion = computed<string>(() => {
		const match = navigator.userAgent.match(/app_version_name:([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3})/i);

		return match !== null && match[1] ? `V${match[1]}` : 'V1.0.0';
	});

	const isInappBrowser = computed<boolean>(() => new RegExp('FBAN|FBAV|Instagram', 'i').test(navigator.userAgent));

	return {
		isAppFirstUser,
		isAppUser,
		isAndroidApp,
		isIosApp,
		isMobileUser,
		isAndroidUser,
		isIosUser,
		currentAppVersion,
		isInappBrowser,
	};
};

const deviceType = {
	iphone: 'iphone',
	ipad: 'ipad',
	ipod: 'ipod',
	ios: 'iphone|ipad|ipod',
	android: 'android|app_android',
	window: 'windows phone|windows mobile',
	opera: 'opera mini',
	// 앱에 userAgent 코드 추가 필요
	app: 'app_ios|app_android',
	app_ios: 'app_ios',
	app_android: 'app_android',
	app_kitkat: 'android 4.4',
	app_first: 'app_first', // 앱 최초실행
};
const allDeviceType = [deviceType.ios, deviceType.android, deviceType.window, deviceType.opera, 'mobile'].join('|');

export const isMobile = (_type?: string) => new RegExp(_type == null ? allDeviceType : (deviceType[_type as keyof typeof deviceType] ?? _type), 'i').test(navigator.userAgent);