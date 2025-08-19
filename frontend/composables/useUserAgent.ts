export const useUserAgent = () => {

	const isAndroidApp = isMobile() && window.healthCare !== undefined;
	const isIosApp = isMobile() && window.webkit?.messageHandlers !== undefined;
	const isMobileUser = isMobile();
	const isAppUser = isMobile() && (window.healthCare !== undefined || window.webkit?.messageHandlers !== undefined);
	const isAndroidUser = isMobile('android');
	const isIosUser = isMobile('ios');

	return {
		isAppUser,
		isAndroidApp,
		isIosApp,
		isMobileUser,
		isAndroidUser,
		isIosUser,
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