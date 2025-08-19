<template>
	<div class="mm_inner m_inquiry">
		<p class="text_readonly T=select">
			<b>{{ qna.type_label }}</b>
			<i class="ico_form-select"></i>
		</p>
		<p class="text_readonly T=select">
			<b>{{ qna.sub_type_label }}</b>
			<i class="ico_form-select"></i>
		</p>
		<div
			v-if="qna.order_id && qna.goods_list"
			class="m_inquiry-order S=on"
		>
			<p class="text_readonly T=select">
				<b>{{ `${qna.order_id} (주문일: ${date(qna.ordered_at || '', 'YYYY.MM.DD')})` }}</b>
				<i class="ico_form-select"></i>
			</p>
			<div class="mm_product-select">
				<!-- 선택된 상품 -->
				<div class="mm_scroller">
					<div class="mm_product-list T=xs">
						<ul>
							<li
								v-for="goods in qna.goods_list"
								:key="goods.id"
							>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													:src="goods.thumbnail_url"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">{{ goods.name }}</p>
												<p class="text_option">{{ optionText(goods.option_name) }}</p>
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

		<my-inquiry-input
			v-model:title="form.title"
			v-model:contents="form.contents"
		></my-inquiry-input>

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
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useInquiry } from '$/composables/useInquiry';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import MyInquiryInput from '@/page/mypage/inquiry/component/MyInquiryInput.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		id: number;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `1:1 고객상담 수정`,
	});

	const { bom, loading } = useGlobalPageContext();
	const { date, optionText } = useFormatter();
	const { getQnaDetail, updateQna } = useInquiry();

	const qna = await getQnaDetail(props.id);

	const { form, validate } = useForm<QnaUpdateForm>(
		{
			title: qna.title,
			contents: qna.contents,
		},
		{
			rule: {
				'title(문의 제목)': ['required', 'maxLength:50'],
				'contents(문의 내용)': ['required', 'minLength:10', 'maxLength:2000'],
			},
		}
	);

	/** 문의 수정 */
	async function update() {
		loading.show();
		try {
			await validate();
			await updateQna(props.id, form.value);
			bom.alert('1:1 문의가 수정되었습니다.', () => {
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