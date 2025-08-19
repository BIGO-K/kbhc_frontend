<template>
	<p
		v-if="items.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>문의 내역이 없습니다
	</p>

	<template v-else>
		<div class="mm_qna m_myinquiry">
			<ul>
				<li>
					<dropdown
						tag="dl"
						group="my-inquiry"
					>
						<div class="mm_product-item T=single-sm">
							<figure>
								<div class="mm_product-item-image">
									<lazyload
										class="mm_bg-cover image_product"
										src="/image/_sample/prod_x1_1.png"
									></lazyload>
								</div>
								<figcaption>
									<p class="text_brand">
										{{ 'M.Monstar' }}
									</p>
									<p class="text_product">
										{{ '시스루스트라이프셔츠' }}
									</p>
								</figcaption>
							</figure>
						</div>
						<template #button>
							<strong class="mm_text-variable text_state">{{ '답변완료' }}</strong>
							<p>
								<span class="text_title">{{ '상품 관련 문의입니다.' }}</span>
								<span class="text_date">{{ '2020.07.10' }}</span>
							</p>
						</template>
						<template #content>
							<div class="mm_qna-qustion">
								<p>{{ '배송 문의입니다. 배송 내역 조회는 어디서 확인하면 되나요? 배송 내역 조회는 어디서 확인하면 되나요?' }}</p>
							</div>
							<div class="mm_qna-answer">
								<p>{{ '배송 내역 조회 방법: 마이페이지 &#62; 진행중인 주문에서 확인이 가능합니다' }}</p>
								<span class="text_date">답변일: {{ '2020.07.10' }}</span>
							</div>
						</template>
					</dropdown>
				</li>
				<li>
					<dropdown
						tag="dl"
						group="my-inquiry"
					>
						<div class="mm_product-item T=single-sm">
							<figure>
								<div class="mm_product-item-image">
									<lazyload
										class="mm_bg-cover image_product"
										src="/image/_sample/prod_x1_2.png"
									></lazyload>
								</div>
								<figcaption>
									<p class="text_brand">
										{{ '엠몬스타' }}
									</p>
									<p class="text_product">
										{{ '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
									</p>
								</figcaption>
							</figure>
						</div>
						<template #button>
							<strong class="text_state">{{ '답변대기' }}</strong>
							<p>
								<span class="text_title">{{ '상품 관련 환불 문의입니다.' }}</span>
								<span class="text_date">{{ '2020.07.10' }}</span>
								<!-- (D) 비밀글일 때 ico_secret을 노출합니다 -->
								<i class="ico_secret"></i>
							</p>
						</template>
						<template #content>
							<div class="mm_qna-qustion">
								<p>{{ '환불 관련 문의입니다. 환불은 언제 되나요?' }}</p>
								<div class="mm_btn_box">
									<div class="mm_inline">
										<button
											type="button"
											class="btn_remove"
										>
											<i class="ico_delete"></i>
											<b>삭제</b>
										</button>
										<a
											class="btn_modify"
											href="#"
											@click.prevent="overlayMyInquiryProductUpdate"
										>
											<i class="ico_modify"></i>
											<b>수정</b>
										</a>
									</div>
								</div>
							</div>
						</template>
					</dropdown>
				</li>
				<li>
					<dropdown
						tag="dl"
						group="my-inquiry"
					>
						<!-- (D) 상품 다중 선택 했을 때 -->
						<div class="mm_product-item T=single-sm">
							<figure>
								<div class="mm_product-item-image">
									<lazyload
										class="mm_bg-cover image_product"
										src="/image/_sample/prod_x1_3.png"
									></lazyload>
								</div>
								<figcaption>
									<p class="text_brand">
										{{ '엠몬스타' }}
									</p>
									<p class="text_product">
										{{ '[매긴나잇브릿지]플리츠 디테일 드레스_MJM1OP3140' }}
									</p>
									<span>외 <strong>{{ number(2) }}</strong>건</span>
									<!-- (D) 판매자 문의건에만 상품 옵션(.text_option)을 노출합니다 -->
									<p class="text_option">
										{{ '화이트 FREE / 1개' }}
									</p>
								</figcaption>
							</figure>
						</div>
						<template #button>
							<strong class="text_state">{{ '답변대기' }}</strong>
							<p>
								<span class="text_title">{{ '배송 문의입니다. 배송 내역 조회는 어디서 확인하면 되나요?' }}</span>
								<span class="text_date">{{ '2020.07.10' }}</span>
							</p>
						</template>
						<template #content>
							<div class="mm_qna-qustion">
								<p>{{ '적립금 관련 문의입니다. 적립금 내역 조회는 어디서 확인하면 되나요?' }}</p>
								<div class="mm_btn_box">
									<div class="mm_inline">
										<button
											type="button"
											class="btn_remove"
										>
											<i class="ico_delete"></i>
											<b>삭제</b>
										</button>
										<a
											class="btn_modify"
											href="#"
											@click.prevent="overlayMyInquirySellerUpdate"
										>
											<i class="ico_modify"></i>
											<b>수정</b>
										</a>
									</div>
								</div>
							</div>
						</template>
					</dropdown>
				</li>
			</ul>
		</div>

		<pagination></pagination>
	</template>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const { number } = useFormatter();
	const { openOverlay } = useGlobalPageContext();

	function overlayMyInquirySellerUpdate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/inquiry/seller/update/MyInquirySellerUpdate.vue'));

		return openOverlay(component);
	}

	function overlayMyInquiryProductUpdate() {
		const component = defineAsyncComponent(() => import('@/page/mypage/inquiry/product/update/MyInquiryProductUpdate.vue'));

		return openOverlay(component);
	}

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>