<template>
	<div
		ref="$container"
		:style="{ minHeight: `${minHeight}px`}"
	>
		<slot name="tab"></slot>
		<slot
			v-if="!pending && paginator.total < 1"
			name="none"
		></slot>
		<ul
			v-else
			ref="$itemContainer"
			:class="itemContainerClass"
			:style="{
				paddingTop: `${paddingTop}px`,
				paddingBottom: `${paddingBottom}px`,
			}"
		>
			<template
				v-for="itemWrapper in itemWrappersForDisplay"
				:key="itemWrapper._index"
			>
				<slot
					v-if="itemWrapper.item"
					name="item"
					:item="itemWrapper.item"
					:index="itemWrapper._index"
				></slot>
			</template>
		</ul>
		<template v-if="pending">
			<ul :class="`${itemContainerClass} T=skeleton`">
				<template
					v-for="_i in paginator.per_page"
					:key="_i"
				>
					<slot name="skeleton"></slot>
				</template>
			</ul>
		</template>
		<div
			v-if="!infiniteScrollStarted && paginator.total > paginator.per_page"
			class="mm_inner"
		>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=line btn_more"
						@click="startInfiniteScroll"
					>
						<b>더보기</b><i class="ico_more"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { ref, computed, watch, onMounted } from 'vue';
	import { useScroll } from '@vueuse/core';
	import { usePageContextStore } from '$/stores/usePageContextStore';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	interface ItemWrapper {
		_index: number;
		_isEmptyItem: boolean;
		item: Showcase;
	}

	const props = withDefaults(defineProps<{
		paginator: Paginator<Showcase>;
		pending: boolean;
		initPage: number;
		resetPage?: boolean;
		itemContainerClass?: string;
		betweenItemMarginPx?: number;
		initHeightPxPerItem?: number;
		padCount?: number;
	}>(), {
		pending: true,
		resetPage: false,
		initPage: 1,
		itemContainerClass: '',
		betweenItemMarginPx: 67,
		initHeightPxPerItem: 520,
		padCount: 2,
	});

	const emit = defineEmits<(e: 'pageRequired', value: number) => void>();

	const pageContextStore = usePageContextStore();
	const { route, router } = useGlobalPageContext();

	const $scroller = ref<HTMLElement | null>(null);
	const $container = ref<HTMLElement | null>(null);
	const $itemContainer = ref<HTMLElement | null>(null);
	const $item = ref<HTMLElement | null>(null);
	const { y, directions } = useScroll($scroller);

	const paginator = computed(() => props.paginator);
	const pageOnView = ref<number>(props.initPage);
	const itemsByPage = ref<Nullable<Showcase>[][]>([]);
	const displayItems = computed(() => itemsByPage.value.flatMap(itemsInPage => itemsInPage));
	const itemWrappersForDisplay = computed<ItemWrapper[]>(() => {
		return displayItems.value
			.map((item, index) => {
				return ({
					_index: index,
					_isEmptyItem: item == null || item == undefined,
					item,
				}) as ItemWrapper;
			})
			.slice(paddedStartIndex.value, paddedEndIndex.value);
	});

	const resetPage = computed(() => props.resetPage);
	const infiniteScrollStarted = ref(props.initPage > 1);
	const currentPageContextTop = computed(() => pageContextStore.getCurrentPageContext(route.path)?.scrollTop || 0);

	const heightPxPerItem = computed(() => $item.value ? $item.value.getBoundingClientRect().height + props.betweenItemMarginPx : props.initHeightPxPerItem);
	const offsetTopToItemContainer = ref(608);
	const minHeight = ref(currentPageContextTop.value + window.innerHeight);
	const endOfView = computed(() => y.value + window.innerHeight);

	// 화면에 보여질 시작/종료 인덱스
	const displayStartIndex = computed(() => Math.floor(Math.max(y.value - offsetTopToItemContainer.value, 0) / heightPxPerItem.value));
	const displayEndIndex = computed(() => Math.ceil(Math.max(endOfView.value - offsetTopToItemContainer.value, 0) / heightPxPerItem.value));
	// 쿠션 반영된 시작/종료 인덱스
	const paddedStartIndex = computed(() => Math.max(displayStartIndex.value - props.padCount, 0));
	const paddedEndIndex = computed(() => Math.min(displayEndIndex.value + props.padCount, displayItems.value.length));

	// 쿠션 픽셀값
	const paddingTop = computed(() => heightPxPerItem.value * paddedStartIndex.value);
	const paddingBottom = computed(() => heightPxPerItem.value * (displayItems.value.length - paddedEndIndex.value));

	function startInfiniteScroll() {
		pageOnView.value = 2;
		infiniteScrollStarted.value = true;
	}

	function getOffsetFromParent(el: Element | null): number {
		if (!el || !(el instanceof HTMLElement)) {
			return 0;
		}

		return getOffsetFromParent(el.offsetParent) + el.offsetTop;
	}

	watch(y, (to) => {
		if (!infiniteScrollStarted.value) {
			return;
		}

		const viewBorderline = directions.top ? to : to + window.innerHeight;
		const pxPerPage = (heightPxPerItem.value * paginator.value.per_page);
		pageOnView.value = Math.max(1, Math.ceil((viewBorderline - offsetTopToItemContainer.value) / pxPerPage));
	}, {
		immediate: true,
	});

	watch(pageOnView, (to) => {
		if (!itemsByPage.value[to] || !itemsByPage.value[to][0]) {
			emit('pageRequired', to);
		}
		router.replace({
			query: {
				...router.currentRoute.value.query,
				page: to,
			},
		});
	});

	watch(paginator, (to) => {
		if (!infiniteScrollStarted.value && to.current_page > 1) {
			infiniteScrollStarted.value = true;
		}
		itemsByPage.value[to.current_page] = to.data;
	}, {
		deep: true,
		immediate: true,
	});

	watch($container, (to) => {
		if (!to) {
			return;
		}

		$scroller.value = to.closest('.mm_scroller');
		if (!$scroller.value) {
			return;
		}

		// 하단 데이터 조회 필요여부
		if (infiniteScrollStarted.value && window.innerHeight + $scroller.value.scrollTop + (window.visualViewport?.height || 0) >= $scroller.value.scrollHeight) {
			emit('pageRequired', props.initPage + 1);
		}
	});

	watch($itemContainer, (to) => {
		if (to) {
			offsetTopToItemContainer.value = getOffsetFromParent(to);
			$item.value = to.querySelector('li');
		}
	});

	watch(resetPage, (to) => {
		if (!to) {
			return;
		}

		// 무한스크롤 초기화
		itemsByPage.value = [];
		infiniteScrollStarted.value = false;
		pageOnView.value = 1;
		minHeight.value = 0;
		if ($scroller.value) {
			$scroller.value.scrollTop = 0;
		}
	});

	watch(itemWrappersForDisplay, (displayList) => {
		// 노출대상 래퍼 중에 빈 래퍼가 포함되어있으면 요청
		const emptyItemWrapper = displayList.find((itemWrapper) => itemWrapper._isEmptyItem);
		if (emptyItemWrapper) {
			emit(
				'pageRequired',
				Math.floor(emptyItemWrapper._index / paginator.value.per_page + 1)
			);
		}
	});

	onMounted(() => {
		// 이전페이지만큼 빈값 할당
		if (infiniteScrollStarted.value && props.initPage > 1) {
			for (let page = 1; page <= props.initPage - 1; page++) {
				itemsByPage.value[page] = [];
				for (let itemIndex = 0; itemIndex < paginator.value.per_page; itemIndex++) {
					itemsByPage.value[page][itemIndex] = null;
				}
			}
		}
	});
</script>