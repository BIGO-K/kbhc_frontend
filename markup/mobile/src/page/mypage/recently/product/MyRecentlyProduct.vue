<template>
	<p
		v-if="recentViewGoods.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>최근 본 상품이 없습니다
	</p>

	<template v-else>
		<div class="mm_inner m_myrecent">
			<p class="m_myrecent-note">
				2주 후 자동 삭제
			</p>
			<div class="mm_product-list T=sm">
				<ul>
					<li
						v-for="goods in recentViewGoods"
						:key="goods.id"
					>
						<div
							class="mm_product-item"
							:class="{ 'S=soldout': goods.is_soldout }"
						>
							<mm-link :to="{ name: 'ProductDetail', params: { id: goods.id } }">
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											:src="goods.thumbnail_url"
										></lazyload>
										<p
											v-if="goods.is_soldout"
											class="text_soldout"
										>
											<b>품절</b>
										</p>
									</div>
									<figcaption>
										<p class="text_brand">
											{{ goods.brand_name }}
										</p>
										<p class="text_product">
											{{ goods.name }}
										</p>
										<p class="text_price">
											<strong>{{ number(goods.base_discounted_price) }}</strong>
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</template>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';

	type RecentViewGoods = Pick<
		Goods,
		'id' |
			'name' |
			'thumbnail_url' |
			'base_discounted_price' |
			'sale_rate'
	> & Required<Pick<Goods, 'is_soldout' | 'brand_name'>>;

	const { number } = useFormatter();

	const goodsList: RecentViewGoods[] = [
		{
			id: 1,
			name: '[유튜브PICK ] 2.64 SUMMER SHIRT _NAVY',
			thumbnail_url: '/image/_sample/prod_x1_1.png',
			base_discounted_price: 112000,
			sale_rate: 10,
			brand_name: 'M.Mon 엠몬스타',
			is_soldout: false,
		},
		{
			id: 3,
			name: '[유튜브PICK ] 2.64 SUMMER SHIRT _NAVY',
			thumbnail_url: '/image/_sample/prod_x1_2.png',
			base_discounted_price: 112000,
			sale_rate: 10,
			brand_name: 'M.Mon 엠몬스타',
			is_soldout: true,
		},
		{
			id: 2,
			name: '[유튜브PICK ] 2.64 SUMMER SHIRT _NAVY',
			thumbnail_url: '/image/_sample/prod_x1_3.png',
			base_discounted_price: 112000,
			sale_rate: 10,
			brand_name: 'M.Mon 엠몬스타',
			is_soldout: false,
		},
	];

	const recentViewGoods: RecentViewGoods[] = goodsList;
</script>