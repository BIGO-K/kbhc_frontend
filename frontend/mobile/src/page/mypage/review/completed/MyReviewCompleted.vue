<template>
	<div class="m_myreview">
		<p
			v-if="paginator.total < 1"
			class="mm_text-none"
		>
			<i class="ico_text-none"></i>작성한 리뷰가 없습니다
		</p>

		<template v-else>
			<!-- 리뷰목록 -->
			<div class="m_myreview-written">
				<ul>
					<li
						v-for="review in paginator.data"
						:key="review.id"
					>
						<div class="mm_product-item T=single-sm">
							<mm-link :to="{ name: 'ProductDetail', params: { id: review.order_item.goods.id } }">
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											:src="review.order_item.goods.thumbnail_url"
										></lazyload>
									</div>
									<figcaption>
										<p class="text_brand">
											{{ review.order_item.goods.brand_name }}
										</p>
										<p class="text_product">
											{{ review.order_item.goods.name }}
										</p>
										<p class="text_option">
											{{ `${optionText(review.order_item.option_name)} / ${review.order_item.ea}개` }}
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</div>
						<div class="mm_review">
							<div class="mm_review-head">
								<p class="text_star">
									<i class="ico_star-fill"></i><span>{{ review.rate }}</span>
								</p>
							</div>
							<!-- (D) 리뷰 내용이 3줄 이하인 경우는 리뷰 내용이 아래와 같이 노출됩니다 -->
							<p class="text_review">
								<b v-html="newLineToBr(review.contents)"></b>
							</p>
							<ul class="mm_review-image">
								<li
									v-for="imageUrl in review.image_urls"
									:key="imageUrl"
								>
									<a
										href="#"
										@click.prevent="_e => overlayProductReviewPhoto(_e, review.image_urls)"
									>
										<i class="image_review">
											<lazyload
												tag="img"
												:src="imageUrl"
												:is-ratio="true"
											></lazyload>
										</i>
									</a>
								</li>
							</ul>
							<p class="text_date">
								{{ date(review.created_at, 'YYYY.MM.DD') }}
							</p>

							<review-template-satisfy
								v-if="review.templates"
								:templates="review.templates"
							></review-template-satisfy>

							<div class="mm_review-foot">
								<!-- (D) 등록 리뷰의 사진 미등록시에만 '.m_myreview-tooltip' 요소를 노출합니다. -->
								<p
									v-if="!review.is_photo_review"
									class="m_myreview-tooltip"
								>
									포토 등록 시 <strong class="mm_text-primary">{{ number(myReviewPointSetting.photoReviewPoint) }}원</strong> 추가
								</p>
								<a
									class="btn_modify"
									href="#"
									@click.prevent="_e => overlayMyReviewUpdate(_e, review)"
								>
									<i class="ico_review-write"></i><b>리뷰 수정하기</b>
								</a>
							</div>
						</div>
					</li>
				</ul>
			</div>

			<pagination
				v-bind="{
					currentPage: paginator.current_page,
					itemsPerPage: paginator.per_page,
					totalCount: paginator.total
				}"
				@move:page="fetch"
			></pagination>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useReview } from '$/composables/useReview';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';
	import ReviewTemplateSatisfy from '@/feature/review-template/component/ReviewTemplateSatisfy.vue';

	const { date, number, optionText, newLineToBr } = useFormatter();
	const { route, openOverlay } = useGlobalPageContext();
	const { myReviewPointSetting, aggregateEventBus, getMyReviewPaginator } = useReview();

	const paginator = ref<Paginator<MyReview>>({
		total: 0,
		current_page: 1,
		per_page: 20,
		data: [],
	});

	const fetch = async (pageNumber: number = 1) => {
		try {
			paginator.value = await getMyReviewPaginator(pageNumber);
		}
		catch (e) {
			useErrorAlert(e);
		}
	};
	await fetch(route.query.page ? Number(route.query.page) : 1);

	const overlayMyReviewUpdate = (_e: MouseEvent, review: MyReview) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/review/update/MyReviewUpdate.vue')), {
			props: { originReview: review },
			clickElement: _e.currentTarget,
			onClose: () => {
				Promise.all([
					fetch(paginator.value.current_page),
					aggregateEventBus.emit(),
				]);
			},
		});
	};

	const overlayProductReviewPhoto = (_e: MouseEvent, imageUrls: string[]) => {
		openOverlay(defineAsyncComponent(() => import('@/page/product/review/photo/ProductReviewPhoto.vue')), {
			props: { imageUrls },
			clickElement: _e.currentTarget,
		});
	};
</script>