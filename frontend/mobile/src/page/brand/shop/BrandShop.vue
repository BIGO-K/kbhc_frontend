<template>
	<layout title="브랜드샵">
		<template v-if="information">
			<!-- 브랜드샵 상단 영역 -->
			<div class="m_brand-head">
				<h3 class="text_brand">
					<!-- (D) 어드민에서 브랜드 상단 이미지를 등록하지 않았을 경우 data-lazyload의 _src 경로에 'null'을 넣어주세요. 예) data-lazyload="{ '_src': 'null' }" -->
					<lazyload
						class="mm_bg-cover image_banner"
						:src="information.top_mobile_image_url"
						:is-error-image="false"
					></lazyload>
					<b>{{ information.brand_name }}</b>
				</h3>
				<p class="text_main">
					{{ information.main_text }}
				</p>
				<p class="text_sub">
					{{ information.sub_text }}
				</p>
				<div class="m_brand-head-private">
					<ul class="mm_flex T=equal">
						<li>
							<toggle
								:is-active="isWishedBrand"
								:is-lazy="true"
								class="btn_like"
								@click="toggleWishBrand"
							>
								<i class="ico_like"></i><b>좋아요</b>
							</toggle>
						</li>
						<li>
							<button
								type="button"
								class="btn_sns-share"
								@click="_e => shareStore.open(_e, information.brand_name, `#${information.brand_name}`, information.top_mobile_image_url)"
							>
								<i class="ico_share"></i><b>공유하기</b>
							</button>
						</li>
					</ul>
				</div>
			</div>

			<showcase-brand
				v-if="information.brand_contents.length > 0"
				:items="information.brand_contents"
			></showcase-brand>
		</template>

		<!-- 큐레이션 -->
		<section
			v-if="curationActiveItem.mainCuration"
			class="m_brand-curation"
		>
			<h4><b>CURATION</b></h4>
			<product-item
				class="T=single"
				:goods="curationActiveItem.mainCuration"
				:usable="{
					keys: ['review_count', 'price'],
					isReverse: true,
				}"
			></product-item>

			<div
				v-if="curationActiveItem.remain.length > 0"
				class="mm_product-list T=card"
			>
				<ul>
					<li
						v-for="item in curationActiveItem.remain"
						:key="item.id"
					>
						<product-item
							class="T=pa"
							:goods="item"
							:usable="{
								keys: ['base_discounted_price', 'sale_rate', 'is_soldout']
							}"
						></product-item>
					</li>
				</ul>
			</div>
			<div
				v-if="curationItemGroups.length > 1"
				class="mm_btn_box"
			>
				<div class="mm_inline">
					<button
						type="button"
						class="mm_btn T=xs T=line"
						@click="curationIndex = curationIndex === curationItemGroups.length - 1 ? 0 : curationIndex + 1"
					>
						<b>새로운 상품 더보기</b><i class="ico_more-load"></i>
					</button>
				</div>
			</div>
		</section>

		<!-- 상품리스트 -->
		<filter-goods-infinite-list
			:total-count="totalCount"
			:filterable="filterable"
			:goods-list-by-page="goodsListByPage"
			:init-params-for-command="paramsForCommand"
			:fetch-count="fetchCount"
			:fetch-list="fetchList"
		></filter-goods-infinite-list>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useShareStore } from '$/stores/useShareStore';
	import { chunk } from '$/utils/array';
	import { useBrandShop } from '$/composables/useBrandShop';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFilterable } from '$/composables/useFilterable';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useWishedBrand } from '$/composables/useWishedBrand';
	import NotFoundError from '$/errors/NotFoundError';
	import Layout from '@/component/layout/Layout.vue';
	import FilterGoodsInfiniteList from '@/component/FilterGoodsInfiniteList.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import ShowcaseBrand from '@/feature/showcase/component/ShowcaseBrand.vue';

	const shareStore = useShareStore();
	const { route, loading } = useGlobalPageContext();

	const brandId = Number(route.params.id);
	const {
		information,
		fetchFilterable,
		fetchCount,
		fetchList,
	} = await useBrandShop(brandId);

	if (information == null) new NotFoundError('존재하지 않는 브랜드입니다.');

	// 브랜드 좋아요
	const wished = useWishedBrand();
	const isWishedBrand = ref(false);
	wished.check([brandId]).then(_res => isWishedBrand.value = _res.some(_entry => _entry.brand_id === brandId && _entry.liked));// 후 적용으로 await 사용 안함

	const toggleWishBrand = async () => {
		loading.show();

		try {
			await wished[isWishedBrand.value ? 'remove' : 'add'](brandId);
			isWishedBrand.value = !isWishedBrand.value;
		}
		catch (_e) {
			useErrorAlert(_e);
		}
		finally {
			loading.hide();
		}
	};

	// 큐레이션
	const curationIndex = ref(0);
	const curationItemGroups = computed(() => {
		if (information == null) return [];

		return chunk(information.curations, 4);
	});
	const curationActiveItem = computed(() => {
		const activeGroup = [...curationItemGroups.value[curationIndex.value]];

		return {
			mainCuration: activeGroup[0],
			remain: activeGroup.splice(1),
		};
	});

	// 상품리스트
	const {
		filterable, // XXX filterable을 startContext, changContext에서 리턴받으면?
		goodsListByPage,
		paramsForCommand,
		totalCount,
		startContext,
	} = useFilterable(fetchFilterable, fetchCount, fetchList);

	await startContext();
</script>