<template>
	<template v-if="recordsByRecent.length === 0">
		<p class="mm_text-none">
			<i class="ico_text-none"></i>최근 본 상품이 없습니다
		</p>
	</template>
	<template v-else>
		<div class="mm_inner m_myrecent">
			<p class="m_myrecent-note">
				2주 후 자동 삭제
			</p>
			<div class="mm_product-list T=sm">
				<ul>
					<li
						v-for="recent in recordsByRecent"
						:key="recent.goods.id"
					>
						<product-item
							:goods="(recent.goods as Goods)"
							:usable="{
								keys: ['brand_name', 'base_discounted_price', 'is_soldout'],
							}"
							:use-wish="false"
						></product-item>
					</li>
				</ul>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { useRecentViewGoodsStore } from '$/stores/useRecentViewGoodsStore';
	import ProductItem from '@/component/ProductItem.vue';

	const { recordsByRecent } = useRecentViewGoodsStore();
</script>