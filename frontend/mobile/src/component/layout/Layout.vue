<template>
	<template v-if="prop.layout === 'none'">
		<slot></slot>
	</template>
	<template v-else>
		<div
			:class="layoutClass"
			:data-path="$route.path"
		>
			<!-- 헤더 -->
			<header class="mm_header">
				<h1 :class="{ 'mm_ir-blind': prop.hideTitle }">
					<b>{{ prop.title }}</b>
				</h1>
				<slot name="afterTitle"></slot>

				<template v-if="prop.layout !== 'popup'">
					<div class="mm_lside">
						<button
							type="button"
							class="btn_back"
							@click="historyBack"
						>
							<i class="ico_history-back"></i><b class="mm_ir-blind">이전으로</b>
						</button>
					</div>
				</template>

				<template v-if="prop.layout === 'popup'">
					<div class="mm_rside">
						<button
							v-if="!hideCloseButton"
							type="button"
							class="btn_popup-close"
							@click="historyBack"
						>
							<i class="ico_popup-close"></i><b class="mm_ir-blind">팝업 닫기</b>
						</button>
					</div>
				</template>
				<template v-else-if="!layoutClass.includes('L=lowbtn')">
					<div class="mm_rside">
						<mm-link :to="{ name: 'Search' }">
							<i class="ico_search"></i><b class="mm_ir-blind">검색</b>
						</mm-link>
						<cart-link></cart-link>
					</div>
				</template>
			</header>

			<!-- 내용 -->
			<div
				id="mm_body"
				class="mm_page"
			>
				<div class="mm_scroller">
					<div class="mm_page-inner">
						<!-- 본문 -->
						<div class="mm_page-content">
							<slot></slot>
						</div>
					</div>
				</div>

				<!-- 하단고정버튼 -->
				<slot name="button"></slot>

				<scroll-top v-if="isMounted"></scroll-top>
			</div>

			<share v-if="shareStore.isShareOpen"></share>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useShareStore } from '$/stores/useShareStore';
	import { useAppBridge } from '$/composables/useAppBridge';
	import { useHead } from '$/composables/useHead';
	import ScrollTop from '@/component/ScrollTop.vue';
	import Share from '@/component/Share.vue';
	import CartLink from '@/component/link/CartLink.vue';

	defineOptions({
		inheritAttrs: false,
	});

	const prop = withDefaults(defineProps<{
		/** @prop { string } - @requires h1 */
		title: string;
		/** @prop { boolean } - `default: false` - h1 mm_ir-blind 적용 */
		hideTitle?: boolean;
		/** @prop { 'popup' | 'none' | null } `default: null` - none(오버레이), null(서브) */
		layout?: Nullable<'popup' | 'none'>;
		/** @prop { string | string[] | null } `default: null` - mm_view에 추가되는 class */
		class?: Nullable<string | string[]>;
		/** @prop { boolean } - `default: false` - 닫기시 새로운 웹뷰 닫힘 */
		closeView?: boolean;
		hideCloseButton?: boolean;
	}>(), {
		hideTitle: false,
		layout: null,
		class: null,
		closeView: false,
		hideCloseButton: false,
	});

	const shareStore = useShareStore();
	const router = useRouter();
	useHead({ title: prop.title });
	const layoutClass = computed(() => {
		let classes = ['mm_view'];

		if (prop.layout != null) classes.push(`L=${prop.layout}`);
		if (prop.class != null) classes = classes.concat(prop.class);

		return classes;
	});

	const { closeCurrentWebview } = useAppBridge();
	/** 브라우저 뒤로가기와, 자체 버튼 뒤로가기 처리를 위해 필요 * */
	const historyBack = () => {
		if (prop.closeView) {
			return closeCurrentWebview();
		}
		if (window.history.state.position === 0
			&& window.history.state.back == null
		) {
			return closeCurrentWebview();
		}

		router.go(-1);
	};

	const isMounted = ref<boolean>(false);
	onMounted(() => {
		isMounted.value = true;
	});
</script>