<template>
	<layout
		title="1:1 고객상담"
		layout="popup"
	>
		<div class="mm_inner m_inquiry">
			<form-select v-model="sortInquiry">
				<option>1차 문의 유형 선택</option>
				<option value="order">
					배송문의
				</option>
				<option value="order">
					반품/교환
				</option>
				<option value="order">
					취소/환불
				</option>
				<option value="order">
					주문/결제
				</option>
				<option>회원/이벤트</option>
				<option>기타</option>
			</form-select>
			<form-select v-model="sortInquirySec">
				<option>2차 문의 유형 선택</option>
			</form-select>
			<div
				class="m_inquiry-order"
				:class="{ 'S=on': useOrderSelect }"
			>
				<form-select v-model="sortOrder">
					<option>주문번호 선택</option>
				</form-select>
				<div class="mm_product-select">
					<form-select v-model="selectProduct">
						<option>문의 상품 선택</option>
					</form-select>

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
										<button
											type="button"
											class="btn_remove"
										>
											<i class="ico_remove T=sm"></i><b class="mm_ir-blind">삭제하기</b>
										</button>
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
										<button
											type="button"
											class="btn_remove"
										>
											<i class="ico_remove T=sm"></i><b class="mm_ir-blind">삭제하기</b>
										</button>
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
						<b>등록하기</b>
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
							<li>주민번호, 전화번호, 이메일 등 개인정보를 남기면 타인에 의해 도용될 수 있으니 문의하기 작성 시 주의해주세요.</li>
							<li>이메일/SMS 답변 수신은 주문, 회원 가입 시 작성한 정보를 기준으로 발송됩니다.</li>
						</ul>
					</template>
				</dropdown>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import Layout from '@/component/layout/Layout.vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import MyInquiryInput from '@/page/mypage/inquiry/component/MyInquiryInput.vue';

	const sortInquiry = ref('');
	const sortInquirySec = ref('');
	const sortOrder = ref('');
	const selectProduct = ref('');
	const useOrderSelect = computed(() => sortInquiry.value === 'order');
</script>