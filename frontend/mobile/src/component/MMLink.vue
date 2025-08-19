<template>
	<a
		v-if="isExternalLink"
		v-bind="$attrs"
		:href="`${to}`"
		target="_blank"
		title="새 창 열림"
	>
		<slot></slot>
	</a>

	<router-link
		v-else
		v-slot="{ isActive, href }"
		v-bind="$props"
		custom
	>
		<!-- 바로 navigate 실행하면, 라우트가 이동되고 가드가 실행된다.. -->
		<template v-if="openWebview && isAppUser">
			<a
				v-bind="$attrs"
				:href="href"
				:class="isActive ? activeClass : inactiveClass"
				:title="isActive ? '선택됨' : ''"
				@click.prevent="linkClicked($event, href)"
			>
				<slot></slot>
			</a>
		</template>
		<template v-else>
			<a
				v-bind="$attrs"
				:href="href"
				:class="isActive ? activeClass : inactiveClass"
				:title="isActive ? '선택됨' : ''"
				@click="linkClicked($event, href)"
			>
				<slot></slot>
			</a>
		</template>
	</router-link>
</template>

<script setup lang='ts'>
	import { computed } from 'vue';
	import { RouterLink, RouteLocationPathRaw, RouteLocationNamedRaw, useLink } from 'vue-router';
	import { useLayerContextStore } from '$/stores/useLayerContextStore';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useUserAgent } from '$/composables/useUserAgent';
	const prop = withDefaults(defineProps<{
		to: string | RouteLocationPathRaw | RouteLocationNamedRaw;
		replace?: boolean;
		inactiveClass?: string;
		activeClass?: string;
		openWebview?: boolean;
	}>(), {
		replace: false,
		inactiveClass: '',
		activeClass: '',
		openWebview: false,
	});
	const { clearLayer } = useLayerContextStore();
	const { navigate } = useLink(prop);
	const { execute } = useAppBridge();
	const { isAppUser } = useUserAgent();
	const linkClicked = async (e: MouseEvent, path: string) => {

		clearLayer();
		/** 메인페이지에서 새웹뷰를 실행시켜야하는 경우 처리 */
		if (prop.openWebview && isAppUser) {
			execute('startWebView', {
				callback: 'baseBridgeCallback',
				url: `${location.origin}${path}`,
			});

			return;
		}

		await navigate(e);
	};

	const isExternalLink = computed(() => typeof prop.to === 'string' && prop.to.startsWith('http'));
</script>