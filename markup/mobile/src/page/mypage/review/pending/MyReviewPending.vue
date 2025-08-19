<template>
	<div class="m_myreview">
		<template v-if="items.length < 1">
			<p class="mm_text-none">
				<i class="ico_text-none"></i>작성 가능한 리뷰가 없습니다
			</p>
			<!-- 유의사항 -->
			<div class="mm_note T=bg">
				<ul>
					<li>리뷰는 구매확정 시점부터 작성하실 수 있습니다.</li>
					<li>구매확정 후 30일 경과 시 리뷰를 작성할 수 없습니다.</li>
				</ul>
			</div>
		</template>

		<template v-else>
			<p class="m_myreview-note">
				{{ number(3) }}건의 리뷰를 작성하시면<br><strong class="mm_text-variable">최대 {{ number(3000) }}원</strong>을 드립니다
			</p>
			<!-- 리뷰목록 -->
			<div class="m_myreview-list">
				<ul>
					<li
						v-for="item in reviewableList"
						:key="item.orderId"
					>
						<p class="text_date">
							{{ '2023.05.14' }}
						</p>
						<div class="mm_product-item T=single-sm">
							<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
								<figure>
									<div class="mm_product-item-image">
										<lazyload
											class="mm_bg-cover image_product"
											:src="item.goods.thumbnailUrl"
										></lazyload>
									</div>
									<figcaption>
										<p class="text_brand">
											{{ item.goods.brandName }}
										</p>
										<p class="text_product">
											{{ item.goods.name }}
										</p>
										<p class="text_option">
											{{ item.goods.optionName }}
										</p>
									</figcaption>
								</figure>
							</mm-link>
						</div>
						<p class="m_myreview-tooltip">
							최대 <strong class="mm_text-primary">{{ number(1000) }}원</strong> 적립
						</p>
						<a
							class="mm_btn T=xs T=light"
							href="#"
							@click.prevent="overlayMyReviewCreate"
						>
							<b>리뷰 쓰기</b>
						</a>
					</li>
				</ul>
			</div>
			<!-- 유의사항 -->
			<div class="mm_note T=bg">
				<ul>
					<li>리뷰는 구매확정 시점부터 작성하실 수 있습니다.</li>
					<li>구매확정 후 30일 경과 시 리뷰를 작성할 수 없습니다.</li>
				</ul>
			</div>
			<pagination></pagination>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';
	const { openOverlay } = useGlobalPageContext();
	const { number } = useFormatter();

	interface ReviewableOrderItem {
		orderId: string;
		optionId: number;
		orderedAt: string;
		goods: {
			id: number;
			name: string;
			brandName: string;
			thumbnailUrl: string;
			optionName?: string;
			optionId?: number;
			ea?: number;
			isSoldout?: boolean;
		};
	}

	function overlayMyReviewCreate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/review/create/MyReviewCreate.vue'));

		return openOverlay(component);
	}

	const reviewableList = ref<ReviewableOrderItem[]>([
		{
			orderId: '123',
			optionId: 123,
			orderedAt: '2023-04-27T02:02:37.000000Z',
			goods: {
				id: 123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_1.png',
				optionName: '블루 / 66',
				optionId: 0,
				ea: 0,
				isSoldout: false,
			},
		},
		{
			orderId: '456',
			optionId: 123,
			orderedAt: '2023-04-27T02:02:37.000000Z',
			goods: {
				id: 123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_2.png',
				optionName: '레드 / 66',
				optionId: 0,
				ea: 0,
				isSoldout: false,
			},
		},
		{
			orderId: '789',
			optionId: 123,
			orderedAt: '2023-04-27T02:02:37.000000Z',
			goods: {
				id: 123,
				name: '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140',
				brandName: '엠몬스타',
				thumbnailUrl: '/image/_sample/prod_x1_3.png',
				optionName: '블루 / 44',
				optionId: 0,
				ea: 0,
				isSoldout: false,
			},
		},
	]);

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>