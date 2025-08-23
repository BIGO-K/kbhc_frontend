<template>
	<!-- 상품리스트 -->
	<div
		ref="container$"
		class="mm_inner"
	>
		<div
			class="mm_product-list T=card"
			:class="{ ' T=skeleton' : needSkeleton }"
		>
			<div class="mm_product-list-head">
				<p class="text_total">
					전체 <strong>{{ number(paginator.total) }}</strong>개
				</p>
				<form-select
					v-model="sorting"
					title="정렬방식"
					:use-overlay="true"
				>
					<option
						v-for="sort in sorts"
						:key="sort.value"
						:value="sort.value"
					>
						{{ sort.label }}
					</option>
				</form-select>
				<toggle
					v-model:is-active="isSortCard"
					class="btn_array"
					active-class="T=card"
					title="리스트형"
					active-title="카드형"
					parent-selector=".mm_product-list"
					@toggle="toggleStyleProduct"
				>
					<i
						class="ico_array"
						:class="isSortCard ? 'T=wide' : 'T=card'"
					></i>
					<b class="mm_ir-blind">상품 정렬 변경</b>
				</toggle>
				<!-- (D) 필터에 선택된 사항이 있을 경우 'btn_filter'에 'S=filter-on' 클래스를 추가합니다 -->
				<button
					type="button"
					class="btn_filter"
					@click="_e => overlayCategoryFilter(_e)"
				>
					<b>필터</b><i class="ico_filter"></i>
				</button>
			</div>

			<template v-if="paginator.total < 1 && !needSkeleton">
				<p class="mm_text-none">
					<i class="ico_text-none"></i>등록된 상품이 없습니다
				</p>
			</template>
			<template v-else>
				<ul
					ref="itemContainer$"
					:style="{
						paddingTop: `${paddingTop}px`,
						paddingBottom: `${paddingBottom}px`,
					}"
				>
					<li
						v-for="itemWrapper in itemWrappersForDisplay"
						:key="itemWrapper._index"
					>
						<template v-if="itemWrapper.item">
							<product-item
								class="T=pa"
								:goods="itemWrapper.item"
							></product-item>
						</template>
					</li>
					<template v-if="needSkeleton">
						<li
							v-for="i in 10"
							:key="i"
						>
							<div class="mm_product-item">
								<i class="image_product"></i>
								<div class="mm_product-item-info">
									<p class="text_brand"></p>
									<p class="text_product"></p>
									<p class="text_price"></p>
								</div>
							</div>
						</li>
					</template>
				</ul>
			</template>
		</div>

		<!-- 하단더보기 -->
		<div
			v-if="paginator.total > 0"
			class="mm_foot"
		>
			<div class="mm_btn_box">
				<div class="mm_inline">
					<button
						v-if="!startVirtual && paginator.total > paginator.per_page"
						type="button"
						class="mm_btn T=xs T=line btn_more"
						@click="activeVirtualScroll"
					>
						<b>상품 리스트 더보기</b><i class="ico_more"></i>
					</button>
					<p
						v-if="displayItems.length === paginator.total"
						id="text_last"
						class="mm_btn T=xs T=line"
					>
						<b>마지막 상품입니다</b>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { defineAsyncComponent, ref, computed, onMounted, watch } from 'vue';
	import { useRouter } from 'vue-router';
	import { useScroll } from '@vueuse/core';
	import { useLayerContextStore } from '$/stores/useLayerContextStore';
	import { usePageContextStore } from '$/stores/usePageContextStore';
	import { useFilteringGoods } from '$/composables/useFilteringGoods';
	import { useFormatter } from '$/composables/useFormatter';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	type ItemWrapper = {
		_index: number;
		_isEmptyItem: boolean;
		item: Goods | null;
	};

	const props = withDefaults(defineProps<{
		totalCount: number;
		filterable: GoodsFilterable;
		goodsListByPage: (Goods | null)[][];
		initParamsForCommand: GoodsFilterParamForCommand;
		isGeneralGoods?: boolean;
		isPending?: boolean;
		fetchList: (paramForCommand: GoodsFilterParamForCommand) => Promise<Goods[] | SearchedResult>;
		fetchCount?: (paramForCommand: GoodsFilterParamForCommand) => Promise<number>;
	}>(), {
		isPending: false,
		isGeneralGoods: true,
		fetchCount: undefined,
	});

	const pageContextStore = usePageContextStore();
	const currentPageContextTop = computed(() => pageContextStore.getCurrentPageContext(router.currentRoute.value.path)?.scrollTop || 0);
	const { number } = useFormatter();
	const router = useRouter();
	const isSortCard = ref(router.currentRoute.value.query.dp_c === 'Y' || !router.currentRoute.value.query.dp_c ? true : false);

	const {
		sorting,
		sorts,
		goodsListByPage,
		paginator,
		applyPage,
		filterable,
		pending,
		paramsForCommand,
		applySelected,
	} = useFilteringGoods(
		props.totalCount,
		props.filterable,
		props.goodsListByPage,
		props.initParamsForCommand,
		props.isGeneralGoods,
		props.fetchList,
		props.fetchCount
	);
	const needSkeleton = computed(() => props.isPending || pending.value);
	const displayItems = computed(() => goodsListByPage.value.flatMap(itemsInPage => itemsInPage));
	const itemWrappersForDisplay = computed<ItemWrapper[]>(() => {
		return displayItems.value
			.map((item, index) => {
				return ({
					_index: index,
					_isEmptyItem: item == null || item == undefined,
					item,
				}) as ItemWrapper;
			})
			.slice(itemIndexStartPadded.value, itemIndexEndPadded.value);
	});

	/** 무한 스크롤 * */
	const scroller = ref<HTMLElement | null>(null);
	const container$ = ref<HTMLElement | null>(null);
	// 컨테이너 돔
	const itemContainer$ = ref<HTMLUListElement | null>(null);
	watch([itemContainer$, isSortCard], () => {
		setHeightPxPerItem();
	}, {
		flush: 'post',
		immediate: true,
	});


	function setHeightPxPerItem() {
		const itemElement = document.querySelector('.mm_inner li div.mm_product-item:not([data-skeleton])');
		if (!itemElement) {
			return;
		}
		heightPxPerItem.value = itemElement.getBoundingClientRect().height;
	}

	const startVirtual = ref<boolean>(false);
	const offsetTopToItemContainer = ref(202);
	const heightPxPerItem = ref<number>(341.1875);
	// 앞뒤로 쿠션을 채울 아이템 수
	const padItemCount = ref(6);
	// 아이템 높이 + 뱃지 아이콘의 여백
	const heightPxPerItemWithSpace = computed(() => {
		return (heightPxPerItem.value) + (isSortCard.value ? 25 : 8);
	});

	const pageOnView = ref(props.initParamsForCommand.page);

	// 뷰 영역의 종료 Y축 값
	const viewEnd = computed(() => {
		return scrollYPosition.value + window.innerHeight;
	});

	// 앞 쿠션을 반영한 시작 아이템 인덱스
	const itemIndexStartPadded = computed(() => {
		return Math.max(itemIndexStartDisplay.value - padItemCount.value, 0);
	});
	// 뒤 쿠션을 반영한 종료 아이템 인덱스
	const itemIndexEndPadded = computed(() => {
		return Math.min(itemIndexEndDisplay.value + padItemCount.value, displayItems.value.length);
	});

	// 쿠션이 반영되지 않은 시작 아이템 인덱스(순수 뷰 화면에 보여질 대상)
	const itemIndexStartDisplay = computed(() => {
		const rawIndex = Math.floor(
			Math.max(scrollYPosition.value - offsetTopToItemContainer.value, 0) / heightPxPerItemWithSpace.value * (isSortCard.value ? 2 : 1)
		);

		const calcIndex = rawIndex - (isSortCard.value ? rawIndex % 2 : 0);

		return calcIndex - (calcIndex % 10);
	});
	// 쿠션이 반영되지 않은 종료 아이템 인덱스(순수 뷰 화면에 보여질 대상)
	const itemIndexEndDisplay = computed(() => {
		const rawIndex = Math.round(
			Math.max(viewEnd.value - offsetTopToItemContainer.value, 0) / heightPxPerItemWithSpace.value * (isSortCard.value ? 2 : 1)
		);
		const calcIndex = rawIndex + (isSortCard.value ? rawIndex % 2 : 0);

		return calcIndex + (10 - (calcIndex % 10));
	});
	// 쿠션 픽셀값
	const paddingTop = computed(() => {
		return heightPxPerItemWithSpace.value * Math.floor(
			(
				itemIndexStartPadded.value
			) / (isSortCard.value ? 2 : 1)
		);
	});

	const paddingBottom = computed(() => {
		return heightPxPerItemWithSpace.value * Math.floor(
			(displayItems.value.length - itemIndexEndPadded.value) / (isSortCard.value ? 2 : 1)
		);
	});

	watch(itemContainer$, (to) => {
		if (to) {
			offsetTopToItemContainer.value = getOffsetFromParent(to);
		}

	});

	function getOffsetFromParent(el: Element | null): number {
		if (!el || !(el instanceof HTMLElement) || el.id == 'mm_body') {
			return 0;
		}

		return getOffsetFromParent(el.offsetParent) + el.offsetTop;
	}
	const { y: scrollYPosition } = useScroll(scroller);

	watch(pageOnView, async (to) => {

		if (!startVirtual.value) {
			return;
		}
		await applyPage(to);
	});
	/** 스크롤 처리 * */
	watch(scrollYPosition, async (to) => {

		pageOnView.value = Math.max(
			Math.ceil(
				(to - offsetTopToItemContainer.value + window.innerHeight) / (heightPxPerItemWithSpace.value * paginator.value.per_page / (isSortCard.value ? 2 : 1))
			),
			1
		);

		if (!scroller.value || startVirtual.value === false) {
			return;
		}
	});
	const getTopToItemContainer = () => {
		if (!itemContainer$.value) {
			return;
		}
		offsetTopToItemContainer.value = getOffsetFromParent(itemContainer$.value);
	};



	async function activeVirtualScroll() {
		startVirtual.value = true;
		pageOnView.value++;
	}
	/** // 무한 스크롤 * */
	const toggleStyleProduct = (_isActive: boolean) => {
		isSortCard.value = _isActive;
		router.replace({
			query: {
				...router.currentRoute.value.query,
				...paramsForCommand.value,
				dp_c: _isActive ? 'Y' : 'N',
			},
		});
	};

	const layerContextStore = useLayerContextStore();
	const overlayCategoryFilter = (_e: MouseEvent) => {
		layerContextStore.openOverlay(defineAsyncComponent(() => import('@/page/category/filter/CategoryFilter.vue')), {
			props: {
				filterable: filterable.value,
				initParamsForCommand: props.initParamsForCommand,
			},
			clickElement: _e.currentTarget,
			onClose: (selected?: GoodsFilterSelected) => {
				if (selected) {
					applySelected(selected);
				}
			},
		});
	};

	// onMounted(() => {

	// });
	watch(itemContainer$, () => {
		getTopToItemContainer();
		if (container$.value) {
			scroller.value = container$.value.closest('.mm_scroller');
		}
	}, {
		flush: 'post',
	});

	/** 1페이지인 경우는 스크롤 보정 처리 안해줌. */
	if (paginator.value.current_page > 1) {
		startVirtual.value = true;
		scrollYPosition.value = currentPageContextTop.value;
	}
</script>