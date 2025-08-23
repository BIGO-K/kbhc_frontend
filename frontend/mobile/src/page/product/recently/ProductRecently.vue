<template>
	<div class="m_recent">
		<template v-if="recentViewGoodsRecords.length > 0">
			<div class="mm_product-list T=sm">
				<ul>
					<li
						v-for="recent in displayedGoods"
						:key="recent.goods.id"
					>
						<product-item
							class="T=pa"
							:goods="(recent.goods as OptianalGoods)"
							:usable="{
								keys: ['brand_name', 'base_discounted_price', 'is_soldout'],
							}"
							:use-wish="false"
						></product-item>
					</li>
				</ul>
			</div>
		</template>
		<template v-else>
			<p class="mm_text-none">
				<i class="ico_text-none"></i>최근 본 상품이 없습니다
			</p>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { useRecentViewGoodsStore } from '$/stores/useRecentViewGoodsStore';
	import ProductItem from '@/component/ProductItem.vue';

	const props = withDefaults(defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		hideCurrentGoods?: boolean;
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>(), {
		hideCurrentGoods: false,
	});

	const { recordsByRecent: recentViewGoodsRecords } = useRecentViewGoodsStore();

	const displayedGoods = computed(() => {
		if (recentViewGoodsRecords.length < 1) {
			return [];
		}

		if (props.hideCurrentGoods) {
			return [...recentViewGoodsRecords].splice(1);
		}

		return recentViewGoodsRecords;
	});

	defineExpose<OverlayComponentExpose>({
		title: `최근 본 상품`,
	});
</script>