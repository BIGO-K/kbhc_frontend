
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserAgentStore = defineStore('user-agent', () => {
	const deviceInfo = ref<Nullable<{
		uuid: string;
		token: string;
		os: 'A' | 'I';
	}>>(null);
	const hasUserAccessApp = ref(false);

	return {
		deviceInfo,
		applyDeviceInfo: (device: { uuid: string; token: string; os: 'A' | 'I' }) => {
			deviceInfo.value = device;
		},
		hasUserAccessApp,
		setAccessApp: () => {
			hasUserAccessApp.value = true;
		},
	};
}, {
	persist: {
		storage: sessionStorage,
	},
});