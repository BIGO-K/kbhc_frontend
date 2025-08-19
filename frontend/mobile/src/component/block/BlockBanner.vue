<template>
	<component
		:is="banner.link ? 'mm-link' : 'a'"
		:to="banner.link"
		open-webview
	>
		<figure>
			<lazyload
				class="mui_bg-cover image_banner"
				:src="banner.image_url"
			></lazyload>
			<figcaption :class="{ ['T=text-black']: isTextBlack }">
				<template v-if="showImageAlt">
					<p class="text_alt">
						{{ banner.alt }}
					</p>
				</template>
				<template v-else>
					<p
						v-if="banner.text_1"
						class="text_banner1"
					>
						{{ banner.text_1 }}
					</p>
					<p
						v-if="banner.text_2"
						class="text_banner2"
					>
						{{ banner.text_2 }}
					</p>
					<p
						v-if="banner.text_3"
						class="text_banner3"
					>
						{{ banner.text_3 }}
					</p>
					<p
						v-if="banner.text_4"
						class="text_banner4"
					>
						{{ banner.text_4 }}
					</p>
				</template>
			</figcaption>
		</figure>
	</component>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import Lazyload from '@/component/Lazyload.vue';

	const props = defineProps<{
		banner: BlockBanner;
	}>();

	const isTextBlack = computed(() => props.banner.text_color == '#000000' || props.banner.text_color == '#000');
	const showImageAlt = computed(() => {
		return !props.banner.is_use_text
			|| (
				!props.banner.text_1
				&& !props.banner.text_2
				&& !props.banner.text_3
				&& !props.banner.text_4
			);
	});
</script>
