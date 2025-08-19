<template>
	<layout title="쇼케이스">
		<div class="m_showcase-detail">
			<!-- 쇼케이스 상단 -->
			<div
				:key="showcase.id"
				class="m_showcase-detail-head"
			>
				<i class="image_banner">
					<lazyload
						tag="img"
						class="mm_bg-cover image_banner"
						:src="showcase.mobile_banner_url"
					></lazyload>
				</i>
				<div class="mm_inner">
					<p class="text_title">
						<b>{{ showcase.title }}</b>
					</p>
					<p class="text_date">
						{{ date(showcase.created_at, 'YYYY.MM.dd') }}
					</p>
					<p class="text_detail">
						{{ showcase.details }}
					</p>
				</div>
			</div>

			<!-- 동영상 -->
			<div
				v-if="showcase.is_video"
				class="m_showcase-detail-media"
				v-html="showcase.video_url"
			>
			</div>

			<!-- 상품그룹1 -->
			<div
				v-for="group in showcase.groups"
				:key="group.id"
				class="m_showcase-detail-product"
			>
				<i class="image_banner">
					<lazyload
						tag="img"
						:src="group.mobile_image_url"
					></lazyload>
				</i>
				<div class="mm_scroller T=x">
					<div class="mm_product-list T=card">
						<ul>
							<li
								v-for="goods in group.goods_list"
								:key="goods.id"
							>
								<product-item
									class="T=pa"
									:goods="goods"
									:usable="{
										keys: ['review_count', 'price'],
										isReverse: true,
									}"
								></product-item>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- 브랜드샵 -->
			<div class="m_showcase-detail-brand">
				<toggle
					class="btn_like"
					:is-active="isWishedBrand"
					is-lazy
					@click="toggleLikeBrand"
				>
					<i
						ref="$brandLikeIcon"
						class="ico_like-brand"
					></i>
					<b class="mm_ir-blind">찜한 브랜드에 추가하기</b>
				</toggle>
				<p class="text_brand">
					{{ showcase.brand_name }}
				</p>
				<mm-link
					class="mm_btn T=xs T=secondary btn_shop"
					:to="{ name: 'BrandShop', params: { id: showcase.brand_id } }"
				>
					<b>SHOP NOW</b><i class="ico_link"></i>
				</mm-link>
			</div>

			<!-- View More -->
			<section
				v-if="anotherShowcases.length"
				class="mm_inner m_showcase-detail-more"
			>
				<h5><b>View More</b></h5>
				<carousel
					:items="anotherShowcases"
					:group-size="4"
					:use-pagination="true"
					:is-auto-height="true"
				>
					<template #default="{ item: anotherShowcase }">
						<mm-link :to="{ name: 'ShowcaseDetail', params: { id: anotherShowcase.id } }">
							<figure>
								<lazyload
									class="mm_bg-cover image_banner"
									:src="anotherShowcase.thumbnail_url"
								></lazyload>
								<figcaption>
									<p class="text_category">
										{{ anotherShowcase.sort_name }}
									</p>
									<p class="text_title">
										{{ anotherShowcase.title }}
									</p>
								</figcaption>
							</figure>
						</mm-link>
					</template>
				</carousel>
			</section>

			<!-- 하단 버튼 -->
			<div class="mm_foot">
				<div class="mm_btn_box">
					<mm-link
						class="mm_btn T=line"
						:to="{ name: 'Showcase' }"
					>
						<b>쇼케이스 메인으로 이동</b><i class="ico_link"></i>
					</mm-link>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import { useAnimation } from '$/composables/useAnimation';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useShowcase } from '$/composables/useShowcase';
	import { useWishedBrand } from '$/composables/useWishedBrand';
	import Layout from '@/component/layout/Layout.vue';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';

	const props = defineProps<{
		showcaseId: number;
	}>();

	const { date } = useFormatter();
	const { loading } = useGlobalPageContext();
	const { getDetail, getAnothers } = useShowcase();
	const { add, check, remove } = useWishedBrand();
	const animation = useAnimation();

	const showcaseId = computed(() => props.showcaseId);
	const { pShowCase, pAnotherShowcases } = await initShowcaseDetail();
	const showcase = ref<ShowcaseDetail>(pShowCase);
	const anotherShowcases = ref<OtherShowcase[]>(pAnotherShowcases);
	const isWishedBrand = ref<boolean>(false);
	checkWishedBrand();
	const $brandLikeIcon = ref<HTMLElement>();

	async function initShowcaseDetail() {
		const [pShowCase, pAnotherShowcases] = await Promise.all([
			getDetail(showcaseId.value),
			getAnothers(showcaseId.value),
		]);

		return {
			pShowCase,
			pAnotherShowcases,
		};
	}

	async function checkWishedBrand() {
		check([showcase.value.brand_id]).then(rel => isWishedBrand.value = rel.some(rel => rel.brand_id == showcase.value.brand_id && rel.liked));
	}

	async function toggleLikeBrand() {
		loading.show();
		try {
			if (isWishedBrand.value) {
				await remove(showcase.value.brand_id);
				isWishedBrand.value = false;

				return;
			}

			await add(showcase.value.brand_id);
			isWishedBrand.value = true;
			if ($brandLikeIcon.value) {
				animation.to(
					$brandLikeIcon.value,
					{
						alpha: 0.5,
						scale: 0.5,
						duration: 0.15,
						ease: 'sine.out',
						onComplete: function() {
							if (!$brandLikeIcon.value) return;
							animation.set($brandLikeIcon.value, { scale: 2 });
							animation.to($brandLikeIcon.value, { alpha: 1, scale: 1, duration: 0.2, ease: 'cubic.out' });
						},
					}
				);
			}
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}

	watch(showcaseId, async (to) => {
		if (!to) {
			return;
		}

		const { pShowCase, pAnotherShowcases } = await initShowcaseDetail();
		document.querySelector('.mm_scroller')?.scrollTo(0, 0);
		showcase.value = pShowCase;
		anotherShowcases.value = pAnotherShowcases;
		checkWishedBrand();
	});
</script>

<style src="./_showcase.scss" lang="scss"></style>