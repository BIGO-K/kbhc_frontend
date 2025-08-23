<template>
	<div class="m_inquiry">
		<dl><dt>업체 정보</dt><dd>{{ '주식회사 해리슨' }}/{{ '02-1234-5678' }}</dd></dl>
		<p>
			결제/적립금/환불 관련문의
			<!-- (D) 자체 고객센터를 사용하지 않아 고객센터 바로가기 주석처리 -->
			<!--
				<mm-link :to="{ name: 'MyInquirySingleCreate' }">
				<b>고객센터 바로가기</b><i class="ico_link"></i>
				</mm-link>
			-->
		</p>
		<div class="mm_product-item T=single-sm">
			<mm-link :to="{ name: 'ProductDetail', params: { id: 123 } }">
				<figure>
					<div class="mm_product-item-image">
						<lazyload
							class="mm_bg-cover image_product"
							src="/image/_sample/prod_x1_1.png"
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
			</mm-link>
		</div>
		<div class="mm_inner">
			<h6 class="mm_text-label">
				<b>문의 유형</b>
			</h6>
			<p class="text_readonly T=select">
				<b>{{ '환불' }}</b>
				<i class="ico_form-select"></i>
			</p>

			<my-inquiry-input></my-inquiry-input>

			<form-check
				v-model="myInquryHide"
				label="비공개"
				icon-class="T=sm"
			></form-check>
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
						<i class="ico_info"></i><b>상품문의 시 주의사항</b>
					</template>
					<template #content>
						<ul>
							<li>주문내역의 변경(확인)에 대한 내용, 주민등록번호, 연락처 등의 정보는 노출되지 않도록 주의해주세요.</li>
							<li>비방, 음란 등 제반 법령에 저촉되거나 광고성 등 게시글은 사전 고지 없이 삭제될 수 있습니다.</li>
						</ul>
					</template>
				</dropdown>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import MyInquiryInput from '@/page/mypage/inquiry/component/MyInquiryInput.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	// const sortInquiry = ref('환불');
	const myInquryHide = ref(false);

	defineExpose<OverlayComponentExpose>({
		title: `상품 문의하기`,
	});
</script>