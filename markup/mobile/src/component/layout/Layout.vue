<template>
	<template v-if="prop.layout === 'none'">
		<slot></slot>
	</template>
	<template v-else>
		<div :class="layoutClass">
			<!-- 헤더 -->
			<header class="mm_header">
				<h1 :class="{ 'mm_ir-blind': prop.hideTitle }">
					<b>{{ prop.title }}</b>
				</h1>
				<slot name="afterTitle"></slot>

				<template v-if="prop.layout !== 'popup'">
					<div class="mm_lside">
						<a
							class="btn_back"
							href="#"
							@click.prevent="$router.go(-1)"
						>
							<i class="ico_history-back"></i><b class="mm_ir-blind">이전으로</b>
						</a>
					</div>
				</template>

				<template v-if="prop.layout === 'popup'">
					<div class="mm_rside">
						<button
							type="button"
							class="btn_popup-close"
							@click="$router.go(-1)"
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
						<mm-link :to="{ name: 'Cart' }">
							<i class="ico_cart"></i><strong class="text_badge">2</strong><b class="mm_ir-blind">장바구니</b>
						</mm-link>
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
	import { useShareStore } from '$/stores/useShareStore';
	import { useHead } from '$/composables/useHead';
	import ScrollTop from '@/component/ScrollTop.vue';
	import Share from '@/component/Share.vue';

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
	}>(), {
		hideTitle: false,
		layout: null,
		class: null,
	});

	const shareStore = useShareStore();

	useHead({ title: prop.title });
	const layoutClass = computed(() => {
		let classes = ['mm_view'];

		if (prop.layout != null) classes.push(`L=${prop.layout}`);
		if (prop.class != null) classes = classes.concat(prop.class);

		return classes;
	});

	const isMounted = ref<boolean>(false);
	onMounted(() => {
		isMounted.value = true;
	});
</script>