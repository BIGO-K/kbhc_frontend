<template>
	<layout title="브랜드샵">
		<!-- 브랜드샵 상단 영역 -->
		<div class="m_brand-head">
			<h3 class="text_brand">
				<!-- (D) 어드민에서 브랜드 상단 이미지를 등록하지 않았을 경우 data-lazyload의 _src 경로에 'null'을 넣어주세요. 예) data-lazyload="{ '_src': 'null' }" -->
				<lazyload
					class="mm_bg-cover image_banner"
					src="/image/_sample/brand_wide_1.png"
					:is-error-image="false"
				></lazyload>
				<b>{{ "BRANDshop 엠몬스타" }}</b>
			</h3>
			<p class="text_main">
				{{ "감도 깊은 취향 셀렉트 브랜드" }}
			</p>
			<p class="text_sub">
				{{ "Exclusive 아이템부터 패션, 라이프스타일, 컬쳐까지 감도 깊은 디자인을 엠몬스타에서 만나보세요. 나를 위한 맞춤 셀렉트 브랜드 '엠몬스타'" }}
			</p>
			<div class="m_brand-head-private">
				<ul class="mm_flex T=equal">
					<li>
						<toggle class="btn_like">
							<i class="ico_like"></i><b>좋아요</b>
						</toggle>
					</li>
					<li>
						<button
							type="button"
							class="btn_sns-share"
							@click="shareStore.open"
						>
							<i class="ico_share"></i><b>공유하기</b>
						</button>
					</li>
				</ul>
			</div>
		</div>

		<showcase-brand v-if="useShowcase"></showcase-brand>

		<!-- 큐레이션 -->
		<section class="m_brand-curation">
			<h4><b>CURATION</b></h4>
			<product-item
				class="T=single"
				:goods="productItems[0]"
				:usable="{
					keys: ['review_count', 'price'],
					isReverse: true,
				}"
			></product-item>
			<div class="mm_product-list T=card">
				<ul>
					<li
						v-for="item in 3"
						:key="item"
					>
						<product-item
							class="T=pa"
							:goods="productItems[item]"
							:usable="{
								keys: ['brand_name', 'review_count', 'price', 'badges', 'icon'],
								isReverse: true,
							}"
						></product-item>
					</li>
				</ul>
			</div>
			<div class="mm_btn_box">
				<div class="mm_inline">
					<button
						type="button"
						class="mm_btn T=xs T=line"
					>
						<b>새로운 상품 더보기</b><i class="ico_more-load"></i>
					</button>
				</div>
			</div>
		</section>

		<!-- 상품리스트 -->
		<div class="mm_inner">
			<div class="mm_product-list">
				<div class="mm_product-list-head">
					<p class="text_total">
						전체 <strong>8,960</strong>개
					</p>
					<form-select v-model="sortProductFilter">
						<option>판매순</option>
						<option>신상품순</option>
						<option>낮은가격순</option>
						<option>높은가격순</option>
						<option>할인율 높은순</option>
						<option>리뷰 많은순</option>
					</form-select>
					<toggle
						class="btn_array"
						:is-active="true"
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
					<a
						href="#"
						class="btn_filter"
						@click.prevent="overlayCategoryFilter"
					>
						<b>필터</b><i class="ico_filter"></i>
					</a>
				</div>

				<p
					v-if="items.length < 1"
					class="mm_text-none T=sm"
				>
					<i class="ico_text-none"></i>등록된 상품이 없습니다
				</p>

				<ul v-else>
					<li
						v-for="item in productItems"
						:key="item.id"
					>
						<product-item
							class="T=pa"
							:goods="item"
						></product-item>
					</li>
				</ul>
			</div>

			<!-- 하단더보기 -->
			<div
				v-if="items.length > 5"
				class="mm_foot"
			>
				<div class="mm_btn_box">
					<div class="mm_inline">
						<button
							type="button"
							class="mm_btn T=xs T=line btn_more"
						>
							<b>상품 리스트 더보기</b><i class="ico_more"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref, computed } from 'vue';
	import { useShareStore } from '$/stores/useShareStore';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import ShowcaseBrand from '@/feature/showcase/component/ShowcaseBrand.vue';

	const shareStore = useShareStore();

	const productItems = useFakeCreator().goods(4);// XXX 상품 임시 생성

	const { openOverlay } = useGlobalPageContext();

	function overlayCategoryFilter() {
		const component = defineAsyncComponent(() => import('@/page/category/filter/CategoryFilter.vue'));

		return openOverlay(component);
	}

	const isSortCard = ref(true);
	const toggleStyleProduct = (_isActive: boolean) => {
		isSortCard.value = _isActive;
		console.log('상품정렬 토글', _isActive);
	};

	const sortProductFilter = ref('');
	const items: unknown[] = [''];// 내용없음 확인용 임시 변수

	const useShowcase = computed(() => Math.floor(Math.random() * 2) == 0 ? true : false);
</script>