<template>
	<div class="mm_inner m_inquiry">
		<p class="text_readonly T=select">
			<b>{{ '배송문의' }}</b>
			<i class="ico_form-select"></i>
		</p>
		<p class="text_readonly T=select">
			<b>{{ '내용내용' }}</b>
			<i class="ico_form-select"></i>
		</p>
		<div
			class="m_inquiry-order"
			:class="{ 'S=on': useOrderSelect }"
		>
			<p class="text_readonly T=select">
				<b>{{ '123456789' }}</b>
				<i class="ico_form-select"></i>
			</p>
			<div class="mm_product-select">
				<!-- 선택된 상품 -->
				<div class="mm_scroller">
					<div class="mm_product-list T=xs">
						<ul>
							<li>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_2.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">{{ '시스루스트라이프셔츠' }}</p>
												<p class="text_option">{{ '화이트 FREE' }}</p>
											</figcaption>
										</figure>
									</a>
								</div>
							</li>
							<li>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_2.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">{{ '시스루스트라이프셔츠' }}</p>
												<p class="text_option">{{ '화이트 FREE' }}</p>
											</figcaption>
										</figure>
									</a>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<my-inquiry-input></my-inquiry-input>

		<div class="mm_foot">
			<div class="mm_btn_box">
				<button
					type="button"
					class="mm_btn T=primary"
				>
					<b>수정하기</b>
				</button>
			</div>
		</div>
		<div class="mm_note">
			<dropdown
				:is-active="true"
				icon-class="T=sm"
			>
				<template #button>
					<i class="ico_info"></i><b>1:1 고객상담 문의 시 유의사항</b>
				</template>
				<template #content>
					<ul>
						<li>주민등록번호, 전화번호, 이메일 등 개인정보를 남기면 타인에 의해 도용될 수 있으니 문의하기 작성 시 주의해 주세요.</li>
						<li>이메일/SMS 답변 수신은 주문, 회원가입 시 작성한 정보를 기준으로 발송됩니다.</li>
					</ul>
				</template>
			</dropdown>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import MyInquiryInput from '@/page/mypage/inquiry/component/MyInquiryInput.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	// const sortInquiry = ref('배송문의');
	// const sortInquirySec = ref('내용내용');
	// const sortOrder = ref('123456789');
	const useOrderSelect = computed(() => true);

	defineExpose<OverlayComponentExpose>({
		title: `1:1 고객상담 수정`,
	});
</script>