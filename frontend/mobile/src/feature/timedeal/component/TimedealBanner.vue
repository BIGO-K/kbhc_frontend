<template>
	<mm-link
		:to="{
			name: 'ProductDetail',
			params: {
				id: timeDealBanner.goods_id
			},
		}"
		open-webview
	>
		<figure>
			<lazyload
				class="mui_bg-cover image_banner"
				:src="timeDealBanner.image_url"
				:alt="timeDealBanner.image_alt"
			></lazyload>
			<figcaption :class="{ ['T=text-black']: isTextBlack }">
				<p class="text_state">
					<strong v-if="afterStart">타임딜 진행중</strong>
					<strong
						v-else
						class="T=timedeal-schedule"
					>타임딜 진행예정</strong>
					<b>
						<span class="text_hour">{{ timer.hour }}</span>:<span class="text_min">{{ timer.minute }}</span>:<span class="text_sec">{{ timer.second }}</span>
					</b>
				</p>
				<template v-if="showImageAlt">
					<p class="text_alt">
						{{ timeDealBanner.image_alt }}
					</p>
				</template>
				<template v-else>
					<p
						v-if="timeDealBanner.banner_text_1"
						class="text_banner1"
					>
						{{ timeDealBanner.banner_text_1 }}
					</p>
					<p
						v-if="timeDealBanner.banner_text_2"
						class="text_banner2"
					>
						{{ timeDealBanner.banner_text_2 }}
					</p>
					<p
						v-if="timeDealBanner.banner_text_3"
						class="text_banner3"
					>
						{{ timeDealBanner.banner_text_3 }}
					</p>
					<p
						v-if="timeDealBanner.banner_text_4"
						class="text_banner4"
					>
						{{ timeDealBanner.banner_text_4 }}
					</p>
				</template>
			</figcaption>
		</figure>
	</mm-link>
</template>
<script setup lang="ts">
	import { ref, computed } from 'vue';
	import monsDate from '$/utils/date';
	import { useCountDown } from '$/composables/useCountDown';
	import Lazyload from '@/component/Lazyload.vue';

	const props = defineProps<{
		item: TimeDealBanner;
	}>();

	const timeDealBanner = ref(props.item);
	const afterStart = computed(() => monsDate().isAfter(timeDealBanner.value.sell_start_at));
	const { timer } = useCountDown(
		afterStart.value ? timeDealBanner.value.sell_end_at : timeDealBanner.value.sell_start_at, {
			startDate: afterStart.value ? timeDealBanner.value.sell_start_at : timeDealBanner.value.display_start_at,
			dayToHour: true,
		}
	);

	const isTextBlack = computed(() => timeDealBanner.value.banner_text_color == '#000000' || timeDealBanner.value.banner_text_color == '#000');
	const showImageAlt = computed(() => {
		return !timeDealBanner.value.banner_text_1
			&& !timeDealBanner.value.banner_text_2
			&& !timeDealBanner.value.banner_text_3
			&& !timeDealBanner.value.banner_text_4;
	});
</script>
