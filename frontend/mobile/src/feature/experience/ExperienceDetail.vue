<template>
	<layout
		title="체험단 후기 상세"
		layout="popup"
	>
		<div class="m_experience-detail">
			<!-- 체험단 후기 상단 -->
			<div class="m...detail-head">
				<h3 class="text_title">
					{{ review.title }}
				</h3>
				<b class="text_user">{{ review.writer }}</b>
				<b class="text_date">{{ date(review.created_at, 'YYYY.MM.DD') }}</b>
				<b class="text_view"><i class="ico_view T=line"></i> 조회수 <strong>{{ number(review.view_count) }}</strong></b>
			</div>
			<hr class="mm_line">
			<!-- 체험단 후기 상품 -->
			<product-item
				class="T=single-sm"
				:goods="{
					id: review.goods_id,
					name: review.goods_name,
					thumbnail_url: review.goods_thumbnail_url,
					brand_name: review.brand_name,
					base_discounted_price: review.base_discounted_price,
					headline: null
				}"
				:usable="{
					keys: ['brand_name', 'base_discounted_price'],
				}"
				:use-wish="false"
			></product-item>
			<div class="mm_inner">
				<!-- 체험단 후기 -->
				<div class="m...detail-content">
					<b class="text_star">
						<i
							class="ico_star-fill"
							title="별점"
						></i><span>{{ review.grade }}</span>
					</b>
					<b class="text_size">{{ physicalInfo }}</b>
					<p
						class="text_review"
						v-html="newLineToBr(review.contents)"
					>
					</p>
				</div>
				<!-- 체험단 후기 사진 -->
				<div class="m...detail-photo">
					<ul>
						<li
							v-for="image in review.image_url_list"
							:key="image"
						>
							<i class="image_review">
								<lazyload
									tag="img"
									:src="image"
								></lazyload>
							</i>
						</li>
					</ul>
				</div>
				<review-template-satisfy
					v-if="review.templates.length"
					:templates="review.templates"
				></review-template-satisfy>
				<hr class="mm_line">
				<p class="text_thumb">
					이 리뷰가<br>도움이 되었다면 <strong>클릭!</strong>
				</p>
				<toggle
					v-model:is-active="isRecommended"
					is-lazy
					class="btn_thumb"
					@click="changeRecommend"
				>
					<i class="ico_thumb"></i><b>{{ number(review.recommendation_count) }}</b>
				</toggle>
				<!-- 하단버튼 -->
				<div class="mm_foot">
					<div class="mm_btn_box">
						<a
							class="mm_btn T=support"
							href="#"
							@click.prevent="$router.go(-1)"
						>
							<b>목록으로</b>
						</a>
					</div>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useExperienceReview } from '$/composables/useExperienceReview';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import ReviewTemplateSatisfy from '@/feature/review-template/component/ReviewTemplateSatisfy.vue';

	const props = defineProps<{
		experienceId: number;
	}>();

	const { loading } = useGlobalPageContext();
	const { date, number, newLineToBr } = useFormatter();
	const { getDetail, getRecommended, recommend, cancelRecommend } = useExperienceReview();

	const review = await getDetail(props.experienceId);
	const isRecommended = ref((await getRecommended([props.experienceId]))[0].is_recommendation);
	const physicalInfo = computed(() => {
		const physicalLabels = [];
		if (review.height) {
			physicalLabels.push(`${review.height}cm`);
		}

		if (review.weight) {
			physicalLabels.push(`${review.weight}kg`);
		}

		if (review.shoes_size) {
			physicalLabels.push(`${review.shoes_size}mm`);
		}

		return physicalLabels.join('/');
	});

	async function changeRecommend() {
		loading.show();
		try {
			if (!isRecommended.value) {
				await recommend(props.experienceId);
				isRecommended.value = true;
				review.recommendation_count++;
			}
			else {
				await cancelRecommend(props.experienceId);
				isRecommended.value = false;
				review.recommendation_count = Math.max(review.recommendation_count - 1, 0);
			}
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}
</script>

<style src="./_experience.scss" lang="scss"></style>