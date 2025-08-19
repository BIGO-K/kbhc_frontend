<template>
	<!-- 스킵 -->
	<nav class="mm_skip">
		<ul>
			<li>
				<a
					href="#mm_body"
					data-href="{ '_type': 'anchor' }"
				>
					본문바로가기
				</a>
			</li>
		</ul>
	</nav>


	<RouterView
		v-slot="{ Component }"
		:data-path="$route.path"
	>
		<template v-if="Component">
			<Suspense
				@resolve="onResolveLoadingComponent"
				@pending="onStartLoadingComponent"
				@fallback="fallbackLoadComponent"
			>
				<component
					:is="Component"
					:data-path="$route.path"
				></component>

				<template #fallback>
					<template v-if="$route.name == 'Main'">
						<main-skeleton></main-skeleton>
					</template>
				</template>
			</Suspense>
		</template>
	</RouterView>


	<template v-if="hasModal">
		<div class="mm_modal">
			<div class="mm_modal-items">
				<layout-modal
					v-for="layer in modalLayers"
					:key="layer.uuid"
					:layer="layer"
				>
				</layout-modal>
			</div>
		</div>
	</template>

	<!-- 오버레이 모달 -->
	<transition
		name="overlay-up"
		@after-leave="onAfterLeaveOverlay"
		@after-enter="onAfterEnterOverlay"
	>
		<Suspense>
			<div
				v-if="overLayers.length > 0"
				class="mm_overlay"
			>
				<div class="mm_overlay-dim"></div>
				<transition-group
					name="overlay-item"
					tag="div"
					class="mm_overlay-list"
					appear
					@before-leave="onBeforeLeaveOverlay"
					@enter="onEnterOverlay"
					@after-leave="onAfterLeaveOverlay"
					@after-enter="onAfterEnterOverlay"
				>
					<layout-overlay
						v-for="item in overLayers"
						:key="item.uuid"
						:layer="item"
					>
					</layout-overlay>
				</transition-group>
			</div>
		</Suspense>
	</transition>

	<!-- BOM 영역 -->
	<template v-if="hasBomContext">
		<div class="mm_bom">
			<layout-bom
				v-for="bom in bomContexts"
				:key="bom.uuid"
				:bom="bom"
			></layout-bom>
		</div>
	</template>

	<!-- Loading -->
	<template v-if="needLoading">
		<layout-loading></layout-loading>
	</template>
</template>

<script setup lang="ts">
	import { computed, onErrorCaptured, onMounted } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import { useStyleTag } from '@vueuse/core';
	import { AxiosError } from 'axios';
	import { useAuthStore } from '$/stores/useAuthStore';
	import { useBomStore } from '$/stores/useBomStore';
	import { useLayerContextStore } from '$/stores/useLayerContextStore';
	import { usePageContextStore } from '$/stores/usePageContextStore';
	import config from '$/utils/config';
	import mons from '$/utils/mons';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useCart } from '$/composables/useCart';
	import { useUserAgent } from '$/composables/useUserAgent';
	import LayoutBom from '@/component/layout/LayoutBom.vue';
	import LayoutModal from '@/component/layout/LayoutModal.vue';
	import LayoutOverlay from '@/component/layout/LayoutOverlay.vue';
	import LayoutLoading from '@/component/Loading.vue';
	import MainSkeleton from '@/page/main/component/MainSkeleton.vue';

	const { isAppUser } = useUserAgent();
	const { login } = useAppBridge();
	const bomStore = useBomStore();
	// bom contexts 정보
	const bomContexts = computed(() => bomStore.bomContexts);
	const needLoading = computed(() => bomStore.loading);
	// bom context 존재 여부
	const hasBomContext = computed(() => bomContexts.value.length > 0);
	const { grade_colors } = config();
	const color = {
		main: null ?? '#ffd633',
		// sub: null ?? '#f3f7ff',
		sub: null ?? '#3f86f1',
		support: null ?? '#fceba6',
	};

	onErrorCaptured((e) => {
		if (e instanceof AxiosError) {

			pageContextStore.applicationError = e;

			return false;
		}
		// console.log('this error:', e);

		return false;
	});

	useStyleTag(`
		:root {
			/* 클라이언트 컬러 */
			--color_main: ${color.main};
			--color_sub: ${color.sub};
			--color_support: ${color.support};
			--color_variable: var(--color_sub);
			--color_header: #fff;
			--color_text_base: #26282c;
			/* 등급 컬러 */
			${grade_colors.map(gradeColor => `--color_level${gradeColor.grade_order + 1} : ${gradeColor.color_code};`).join('')}
			/* 상품 비율 */
			--prod_ratio_base: 1;
			/* 높이 */
			--header_height_base: 48px;
			--header_height_main: 56px;
		}
		`.replace(/\/\*(.*)\*\/|\s/g, ''),
		{ id: 'style_root' }
	);

	// 오버레이/모달
	const pageContextStore = usePageContextStore();
	const { getCount } = useCart();
	const router = useRouter();
	const route = useRoute();
	const layerContextStore = useLayerContextStore();
	const layerContexts = computed(() => layerContextStore.layerContexts);
	const overLayers = computed(() => layerContexts.value.filter(context => context.type === 'overlay'));
	const modalLayers = computed(() => layerContexts.value.filter(context => context.type === 'modal'));
	const hasModal = computed(() => {
		if (modalLayers.value.length < 1) {
			return false;
		}

		return modalLayers.value.find(layer => layer.isActive) !== undefined;
	});

	// (접근성) 오버레이 노출 시 닫기 버튼에 포커스
	const onAfterEnterOverlay = (_$el: Element) => {
		const $item = _$el.classList.contains('mm_overlay') ? _$el.querySelector('.mm_overlay-list')?.lastElementChild : _$el;
		if ($item == null) return;

		($item.querySelector('.btn_overlay-close') as HTMLButtonElement)?.focus();
	};
	// (접근성) 오버레이 닫을 때 클릭한 요소에 포커스
	const onAfterLeaveOverlay = () => {
		(layerContextStore.removedOverlayContext?.clickElement as Nullable<HTMLElement>)?.focus();
	};

	const overlayBackClass = 'S=back';
	const onBeforeLeaveOverlay = (_$el: Element) => _$el.previousElementSibling?.classList.add(overlayBackClass);
	const onEnterOverlay = (_$el: Element) => _$el.previousElementSibling?.classList.remove(overlayBackClass);

	const { loading } = mons();

	function onResolveLoadingComponent() {
		loading.hide();
		if (route.meta.isForward) {
			return;
		}
		const scroller = document.querySelector(`[data-path="${route.path}"] #mm_body > .mm_scroller`);

		if (scroller) {
			scroller.scrollTop = pageContextStore.getCurrentPageContext(route.path)?.scrollTop || 0;
		}
	}

	function onStartLoadingComponent() {
		loading.show();
	}

	function fallbackLoadComponent() {

	}
	/** 회원이 아닌 경우 무조건 로그인 페이지로 보낸다 */
	const authStore = useAuthStore();
	const isMember = computed(() => authStore.member !== null);
	const loginChecker = async () => {
		if (isMember.value || route.name == 'Present') {
			return;
		}

		if (isAppUser) {
			await login();

			return;
		}
		else if (location.origin.includes('mmonstar.co.kr')) {
			router.push('/temp-login');
		}

	};

	router.beforeEach(async (to, from, next) => {
		if (to.path !== '/temp-login' && !to.meta.onlyGuest) {
			loginChecker();
		}

		pageContextStore.applyPageContext({
			key: from.path,
			scrollTop: document.querySelector(`[data-path="${from.path}"] #mm_body > .mm_scroller`)?.scrollTop || 0,
		});

		return next();
	});

	onMounted(() => {
		if (isAppUser) {
			loginChecker();

			if (isMember.value) {
				getCount();
			}
		}
	});
</script>

<style lang="scss">
	$transition_time: 0.25s;

	// 오버레이 모션
	.overlay-up-enter-active,
	.overlay-up-leave-active {
		transition: $transition_time;

		.mm_overlay-dim {
			transition: opacity $transition_time;
		}
	}

	.overlay-up-enter-from,
	.overlay-up-leave-to {
		pointer-events: none;

		.mm_overlay-dim {
			opacity: 0;
		}

		// 마지막 overlay가 닫힐 때
		.mm_overlay-item {
			transform: translateY(100%);
		}
	}

	.mm_overlay-item {
		filter: drop-shadow(0 0 15px rgba(#000, 0.2));
		transition: $transition_time ease-out;
		transition-property: transform visibility;
	}

	.overlay-item-enter-from,
	.overlay-item-leave-to,
	.mm_overlay-item:not(:last-child, .S\=back) {
		// .S=back 클래스로 현재 요소를 닫을 때 이전 요소 노출 제어
		visibility: hidden;
		transform: translateY(100%);
		pointer-events: none;
	}

	.mm_layout {
		transition: transform 200ms ease 100ms;

		&[class*='enter-active']
		{
			position: fixed;
			z-index: 20000;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		&[class*='leave-active']
		{
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}
	}
</style>