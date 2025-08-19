<template>
	<div
		ref="$tab"
		class="m_prodetail-tab"
	>
		<div
			class="mm_tab_menu"
			:class="props.class"
		>
			<ul class="mm_flex T=equal">
				<li
					v-for="(tab, _index) in tabs"
					:key="tab.id"
				>
					<a
						class="btn_tab"
						:class="{ 'S=tab-on': _index === currentTabIndex }"
						active-class="S=tab-on"
						:href="`#${tab.id}`"
						@click.prevent="toTabId = tab.id"
					>
						<template v-if="tab.useCount">
							<span>{{ tab.name }}</span>
							<small>{{ tab.getCount() }}</small>
						</template>
						<template v-else>
							<b>{{ tab.name }}</b>
						</template>
					</a>
				</li>
			</ul>
		</div>
		<template v-if="currentTab">
			<component
				:is="currentTab.component"
				v-bind="currentTab.getProps()"
			></component>
		</template>
	</div>
</template>

<script setup lang="ts" generic="T">
	import { defineAsyncComponent, ref, computed, watch } from 'vue';
	import { usePageScroller } from '$/composables/usePageScroller';
	import ProductDetailInfo from '@/page/product/detail/component/ProductDetailInfo.vue';
	import ProductDetailReview from '@/page/product/detail/component/ProductDetailReview.vue';

	const props = withDefaults(defineProps<{
		/** @prop { boolean } `default: true` */
		isKeep?: boolean;
		/** @prop { string | Record<string, boolean> | (string | Record<string, boolean>)[] } `default: ''` */
		class?: string | Record<string, boolean> | (string | Record<string, boolean>)[];
		toTabId?: string;
		needTabFocusChange: boolean;
		data: {
			goodsDetail: GoodsDetail;
			information?: GoodsInformation;
			shoppingAggregate: GoodsReactionAggregate;
			reviewWritable: boolean;
		};
	}>(), {
		isKeep: false,
		toTabId: '',
		class: '',
	});


	const emit = defineEmits<(e: 'update:toTabId', value: string) => void>();

	const { scrollTo } = usePageScroller();
	/** 현재 탭 id */
	const toTabId = computed({
		get: () => props.toTabId,
		set: (value) => {
			emit('update:toTabId', value);
		},
	});
	const currentTabIndex = ref(0);
	const currentTab = computed(() => {
		const tab = tabs[currentTabIndex.value];

		return tab?.id == 'info' && !props.data.information ? null : tab;
	});
	const $tab = ref<HTMLElement>();
	const tabs = [
		{
			id: 'info',
			name: '상세정보',
			useCount: false,
			component: ProductDetailInfo,
			getProps: () => {
				return {
					goodsId: props.data.goodsDetail.id,
					goodsProvider: props.data.goodsDetail.provider,
					information: props.data.information,
				};
			},
			getCount: () => 0,
		},
		{
			id: 'review',
			name: `리뷰`,
			useCount: true,
			component: ProductDetailReview,
			getProps: () => {
				return {
					goodsId: props.data.goodsDetail.id,
					shoppingAggregate: props.data.shoppingAggregate,
					reviewWritable: props.data.reviewWritable,
				};
			},
			getCount: () => props.data.shoppingAggregate.total_review_count,
		},
		{

			id: 'qna',
			name: `상품 Q&A`,
			useCount: true,
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailQna.vue`)),
			getProps: () => {
				return {
					goodsId: props.data.goodsDetail.id,
				};
			},
			getCount: () => props.data.shoppingAggregate.total_qna_count,
		},
		{
			id: 'seller',
			name: '판매자 정보',
			useCount: false,
			component: defineAsyncComponent(() => import(`@/page/product/detail/component/ProductDetailSeller.vue`)),
			getProps: () => {
				return {
					goodsDetail: props.data.goodsDetail,
				};
			},
			getCount: () => 0,
		},
	];

	const needTabFocusChange = computed(() => props.needTabFocusChange);

	if (toTabId.value && toTabId.value != 'info') {
		currentTabIndex.value = tabs.findIndex(tab => tab.id == toTabId.value) || 0;
	}

	watch(toTabId, (_toTabId) => {
		if (!_toTabId) return;

		const toTabIndex = tabs.findIndex(tab => tab.id == _toTabId);

		// 탭 변경처리
		if (toTabIndex < 0) return;
		currentTabIndex.value = toTabIndex;
		toTabId.value = '';

		// 탭 상단으로 스크롤 처리
		if (!$tab.value || !needTabFocusChange.value) return;
		scrollTo($tab.value, { margin: 0 });
	});
</script>