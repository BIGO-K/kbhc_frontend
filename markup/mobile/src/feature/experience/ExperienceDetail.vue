<template>
	<layout
		title="체험단 후기 상세"
		layout="popup"
	>
		<div class="m_experience-detail">
			<!-- 체험단 후기 상단 -->
			<div class="m...detail-head">
				<h3 class="text_title">
					{{ '브랜드 하이커 에어 백팩 WHITE 후기 하이커 에어 백팩 WHITE 후기입니다' }}
				</h3>
				<b class="text_user">{{ '박효*' }}</b>
				<b class="text_date">{{ '2022.07.10' }}</b>
				<b class="text_view"><i class="ico_view T=line"></i> 조회수 <strong>{{ number(9999) }}</strong></b>
			</div>
			<hr class="mm_line">
			<!-- 체험단 후기 상품 -->
			<product-item
				class="T=single-sm"
				:goods="productItems[0]"
				:usable="{
					keys: ['review_count', 'price', 'badges', 'icon', 'sale_rate'],
					isReverse: true,
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
						></i><span>{{ '4.5' }}</span>
					</b>
					<b class="text_size">{{ '155cm/44kg/230mm' }}</b>
					<p class="text_review">
						{{ '가방이나 반팔티는 여러개 있는데,트레이닝 집업은 처음이라 기대도 되고 이상하면 어쩌지?걱정도 살짝 했었는데 역시 믿고보는 브랜드👍💛원래 치수보다 한치수 작게 선택했는데도 꽤 낙낙하고 너무 이쁩니다ㅠ 특히 모자 뒷부분에도 작게 로고가 있어서 심심하지 않으면서도 과하지 않게 포인트 되어서 좋은 것 같아요!원단도 좋고 막 실밥이나 마감도 제대로 된거 같아서 200%만족 합니다. 기장도 어정쩡하지않고 딱 이쁜 핏보장🥰정말 10대,20대뿐 아니라 남녀노소 핫한 인기 브랜드인데에는 그만한 이유가 있는 것 같아요!' }}
					</p>
				</div>
				<!-- 체험단 후기 사진 -->
				<div class="m...detail-photo">
					<ul>
						<li>
							<i class="image_review">
								<lazyload
									tag="img"
									src="/image/_sample/experience_review1.png"
								></lazyload>
							</i>
						</li>
						<li>
							<i class="image_review">
								<lazyload
									tag="img"
									src="/image/_sample/experience_review2.png"
								></lazyload>
							</i>
						</li>
						<li>
							<i class="image_review">
								<lazyload
									tag="img"
									src="/image/_sample/experience_review3.png"
								></lazyload>
							</i>
						</li>
					</ul>
				</div>
				<review-template-satisfy v-if="true"></review-template-satisfy>
				<hr class="mm_line">
				<p class="text_thumb">
					이 리뷰가<br>도움이 되었다면 <strong>클릭!</strong>
				</p>
				<toggle
					class="btn_thumb"
					:is-active="true"
				>
					<i class="ico_thumb"></i><b>{{ number(1000) }}</b>
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
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import { useFormatter } from '$/composables/useFormatter';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import ReviewTemplateSatisfy from '@/feature/review-template/component/ReviewTemplateSatisfy.vue';

	const { number } = useFormatter();
	const productItems = useFakeCreator().goods(1);// XXX 상품 임시 생성
</script>

<style src="./_experience.scss" lang="scss"></style>