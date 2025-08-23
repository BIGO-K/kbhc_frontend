<template>
	<div class="m_inquiry">
		<dl><dt>업체 정보</dt><dd>{{ qna.goods.seller_name }}/{{ qna.goods.seller_tel }}</dd></dl>
		<!--
			<p>
			결제/적립금/환불 관련문의
			(D) 자체 고객센터를 사용하지 않아 고객센터 바로가기 주석처리
			<mm-link :to="{ name: 'MyInquirySingleCreate' }">
			<b>고객센터 바로가기</b><i class="ico_link"></i>
			</mm-link>

			</p>
		-->
		<div class="mm_product-item T=single-sm">
			<a>
				<figure>
					<div class="mm_product-item-image">
						<lazyload
							class="mm_bg-cover image_product"
							:src="qna.goods.thumbnail_url"
						></lazyload>
					</div>
					<figcaption>
						<p class="text_brand">
							{{ qna.goods.brand_name }}
						</p>
						<p class="text_product">
							{{ qna.goods.name }}
						</p>
					</figcaption>
				</figure>
			</a>
		</div>
		<div class="mm_inner">
			<h6 class="mm_text-label">
				<b>문의 유형</b>
			</h6>
			<p class="text_readonly T=select">
				<b>{{ qna.type_label }}</b>
				<i class="ico_form-select"></i>
			</p>

			<my-inquiry-input
				v-model:title="qnaForm.title"
				v-model:contents="qnaForm.contents"
			></my-inquiry-input>

			<form-check
				v-model="qnaForm.is_private"
				label="비공개"
				icon-class="T=sm"
			></form-check>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="update"
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
	import mons from '$/utils/mons';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useInquiry } from '$/composables/useInquiry';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import MyInquiryInput from '@/page/mypage/inquiry/component/MyInquiryInput.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		qna: GoodsQnaDetail;
		sellerQnaTypes: SellerQnaType[];
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `상품 문의하기`,
	});

	const { updateGoodsQna } = useInquiry();

	/** form composable */
	const { form: qnaForm, validate } = useForm<GoodsQnaUpdateForm>(
		{
			title: props.qna.title,
			contents: props.qna.contents,
			is_private: props.qna.is_private,
		},
		{
			rule: {
				'title(문의 제목)': ['required', 'maxLength:50'],
				'contents(문의 내용)': ['required', 'minLength:10', 'maxLength:2000'],
			},
		}
	);

	const { loading, bom } = mons();
	async function update() {
		loading.show();
		try {
			await validate();
			await updateGoodsQna(props.qna.goods.id, props.qna.id, qnaForm.value);
			bom.alert('문의가 수정 되었습니다.', () => {
				props.closer();
			});
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}

	}
</script>