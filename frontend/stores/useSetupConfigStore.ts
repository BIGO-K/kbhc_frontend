import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useBackend } from '$/composables/useBackend';

export const useSetupConfigStore = defineStore('setup-config', () => {
	const setupConfig = ref<Nullable<SetupConfig>>(null);
	const expiredAt = ref<number | undefined>(undefined);
	const isDefaultOn = ref<boolean>(false);
	const defaultInitialSettings: SetupConfig = {
		shop: {
			name: 'KB헬스케어',
			eng_name: 'KBHC',
			name_in_business: '',
			business_number: '',
			sell_account: '',
			ceo_name: '',
			tel: '',
			privacy_manager: '',
			base_address: '',
			detail_address: '',
			homepage_url: '',
			payment_service_info_url: '',
			copyright_text: '',
			business_service_info_url: '',
			bank_owner_name: '',
			cs_tel: '',
			cs_email: '',
			cs_time: '',
			cs_weekday: '',
			cs_lunch_time: '',
			cs_fax_number: '',
			kakao_cs_time: '',
			kakao_cs_weekday: '',
			instagram_link: '',
			facebook_link: '',
			youtube_link: '',
			naver_blog_link: '',
			kakao_channel_link: '',
			kakao_friend_name: '',
			use_renewal: false,
		},
		point: {
			label_name: '',
			suffix: '',
			max_usable_amount: 0,
			max_usable_amount_type: {
				discount_amount: 0,
				discount_type: 'KRW',
				maximum_discount_amount: 0,
			},
			min_usable_balance: 0,
			photo_review_point: 0,
			review_point: 0,
			usable_month: 0,
			grade_rules: [],
		},
		paid_features: {
			reward: false,
			personalization: false,
			review_template: false,
			raffle: false,
			ranking: false,
			time_deal: false,
			cody_shot: false,
			showcase: false,
			joint_purchase: false,
			special_event: false,
			experience_review: false,
			social_login: false,
			usable_social_logins: [],
			active_easypays: [],
			reward_policies: {
				delivery_delay_reward_policies: [],
				soldout_cancel_reward_policies: [],
				maximum_reward_price: 0,
			},
			my_pay: false,
		},
		grade_colors: [],
		seo: {
			title: '',
			description: '',
			keywords: [],
		},
		marketing: {
			gtm: {
				id: '',
			},
			facebook_pixel: {
				id: '',
			},
			kakao_pixel: {
				id: '',
			},
			criteo: {
				id: '',
			},
		},
		gnb: {
			raffle: false,
			joint_purchase: false,
		},
		design: {
			header_type: 'A',
			footer_type: '',
			toolbar_type: '',
			main_color: '#ffd633',
			sub_color: '#3f86f1',
			support_color: '#fceba6',
			color_version: 'black',
			use_header_color: false,
			pc_main_popup_type: '',
			pc_main_popup_version: '',
			mobile_main_popup_type: 'normal',
			mobile_main_popup_version: 'A',
		},

	};

	const init = async () => {
		if (expiredAt.value && setupConfig.value && !isDefaultOn.value) return;

		expiredAt.value = new Date().getTime();
		try {
			setupConfig.value = await useBackend().command<SetupConfig>('v1/informations');
			isDefaultOn.value = false;
		}
		catch (e) {
			setupConfig.value = defaultInitialSettings;
			isDefaultOn.value = true;
			console.error(e);
		}
	};

	return {
		setupConfig,
		expiredAt,
		isDefaultOn,
		init,
		config: <Path extends string | undefined>(
			key?: Path,
			defaultValue?: Path extends string
				? ValueOf<SetupConfig, Split<Path>>
				: undefined
		): ConfigValue<Path> => {
			if (!setupConfig.value || isDefaultOn.value) init();

			if (expiredAt.value) {
				const diffTimes = new Date().getTime() - expiredAt.value;
				if (Math.round((diffTimes / 1000) / 60) > 5) {
					expiredAt.value = undefined;
					init();
				}
			}

			// 설정값 없는 경우 에러 처리
			// KEY가 없는 경우 전체 데이터 리턴
			if (!key) {
				if (!setupConfig.value) {
					isDefaultOn.value = true;

					return (defaultValue || defaultInitialSettings) as ConfigValue<Path>;
				}

				return setupConfig.value as ConfigValue<Path>;
			}

			const dep = key.split('.');
			const dest = { ...(setupConfig.value || defaultInitialSettings) };
			let value = dest as Record<string, unknown>;

			for (const key of dep) {
				value = value[key] as Record<string, unknown>;
			}

			return value as ConfigValue<Path>;
		},
	};
}, {
	persist: {
		storage: sessionStorage,
	},

});