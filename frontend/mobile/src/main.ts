import { createApp } from 'vue';
import { useAuthStore } from '$/stores/useAuthStore';
import { useSetupConfigStore } from '$/stores/useSetupConfigStore';
import { useAppBridge } from '$/composables/useAppBridge';
import pinia from '$/stores';
import MMLink from '@/component/MMLink.vue';
import App from '@/App.vue';
import router from '@/router';

// const { getCount } = useCart();

const app = createApp(App)
	.use(router)
	.use(pinia);


const authStore = useAuthStore();
window.openBrowser = useAppBridge().openBrowser;
// const { login } = useAppBridge();

// login();

(async () => {
	await Promise.all([
		useSetupConfigStore().init(),
		authStore.generateUserUuid(),
	]);


	app.component('MmLink', MMLink).mount('#app');

})();

// array.at 대응용 IOS <= 15.3
if (![].at) {
	Array.prototype.at = function(findIndex) {
		if (findIndex === -1) {
			return this.slice(findIndex)[0];
		}

		return this.slice(findIndex, findIndex + 1)[0];
	};
}

// console.log(' 기업가치를 높이는 IT기술 \n Solution developed by 엠몬스타(https://www.mmonstar.co.kr)\n' + '%c M.MONSTAR!', 'font-weight: bold; font-size: 16px; color: rgba(0, 139, 148, 1); text-shadow: 1px 1px 0 rgba(201, 255, 154, 1) , 2px 2px 1px rgba(19, 169, 132, 1)');