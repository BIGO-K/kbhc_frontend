<template>
	<p
		v-if="brands.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>찜한 브랜드가 없습니다
	</p>

	<div
		v-else
		class="m_mylike-brand"
	>
		<ul>
			<li
				v-for="brand in brands"
				:key="brand.id"
			>
				<mm-link :to="{ name: 'BrandShop', params: { id: brand.id } }">
					<figure>
						<lazyload
							class="mm_bg-contain image_brand"
							:src="brand.logo_image_url"
							:is-ratio="true"
						></lazyload>
						<figcaption>{{ brand.name }}</figcaption>
					</figure>
				</mm-link>
				<button
					type="button"
					class="btn_remove"
				>
					<i class="ico_remove T=sm"></i><b class="mm_ir-blind">삭제</b>
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import Lazyload from '@/component/Lazyload.vue';

	type Brand = {
		id: number;
		logo_image_url: string;
		name: string;
	};

	const brandList: Brand[] = [
		{
			id: 1,
			logo_image_url: '/image/_sample/brand_logo_221.jpg',
			name: '1159스튜디오',
		},
		{
			id: 2,
			logo_image_url: '/image/_sample/brand_logo_2.jpg',
			name: '247서울',
		},
		{
			id: 3,
			logo_image_url: '/image/_sample/brand_logo_3.jpg',
			name: '이십삼점오',
		},
		{
			id: 4,
			logo_image_url: '/image/_sample/brand_logo_4.jpg',
			name: '에이티티',
		},
		{
			id: 5,
			logo_image_url: '/image/_sample/brand_logo_5.jpg',
			name: '올리비아로렌',
		},
	];

	const brands: Brand[] = brandList;
</script>