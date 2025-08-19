<template>
	<div class="m_inquiry">
		<dl><dt>판매자 정보</dt><dd>{{ seller.tel ? `${seller.name}/${phone(seller.tel)}` : seller.name }}</dd></dl>
		<div class="mm_inner">
			<div class="mm_product-select">
				<form-select
					v-model.number="selectedOrderItem"
					title="문의상품"
					use-overlay
					fixed-label="문의 상품 선택"
					@update:model-value="selectOrderItem"
				>
					<option :value="null">
						문의 상품 선택
					</option>
					<option
						v-for="orderItem in orderItems"
						:key="orderItem.id"
						:value="orderItem.id"
					>
						<b class="m...overlay-product">
							<i
								class="mm_bg-cover image_product"
								:style="`background-image:url(${orderItem.thumbnail_url})`"
							></i>
							<span class="text_product">
								{{ orderItem.goods_name }}
							</span>
							<span class="text_option">
								{{ optionText(orderItem.option_name) }}
							</span>
						</b>
					</option>
				</form-select>

				<!-- 선택된 상품 -->
				<div
					v-if="selectedOrderItems.length"
					class="mm_scroller"
				>
					<div class="mm_product-list T=xs">
						<ul>
							<li
								v-for="orderItem in selectedOrderItems"
								:key="orderItem.id"
							>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													:src="orderItem.thumbnail_url"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">{{ orderItem.goods_name }}</p>
												<p class="text_option">{{ optionText(orderItem.option_name) }}</p>
											</figcaption>
										</figure>
									</a>
									<button
										type="button"
										class="btn_remove"
										@click="unselectOrderItem(orderItem.id)"
									>
										<i class="ico_remove T=sm"></i><b class="mm_ir-blind">삭제하기</b>
									</button>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<form-select
				v-model.number="form.type"
				use-overlay
				title="문의 유형"
			>
				<option :value="null">
					문의 유형 선택
				</option>
				<option
					v-for="qnaType in qnaTypes"
					:key="qnaType.code"
					:value="qnaType.code"
				>
					{{ qnaType.label }}
				</option>
			</form-select>

			<my-inquiry-input
				v-model:title="form.title"
				v-model:contents="form.contents"
			></my-inquiry-input>

			<div class="mm_note T=bg">
				<ul>
					<li>결제, 적립금, 환불 관련 문의는 고객센터 &#62; 1:1 고객 상담를 통해 문의하세요.</li>
					<li>상품, 배송, 기타를 선택한 문의는 해당 상품의 상세 페이지 &#62; Q&#38;A 영역에 노출됩니다.</li>
				</ul>
			</div>
			<form-check
				v-model="form.is_private"
				label="비공개"
				icon-class="T=sm"
			></form-check>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="store"
					>
						<b>문의하기</b>
					</button>
				</div>
			</div>
			<div class="mm_note">
				<dropdown
					:is-active="true"
					icon-class="T=sm"
				>
					<template #button>
						<i class="ico_info"></i><b>판매자 문의 시 유의사항</b>
					</template>
					<template #content>
						<ul>
							<li>알림톡/SMS 답변 수신은 주문, 회원가입 시 작성한 정보를 기준으로 발송됩니다.</li>
							<li>주민등록번호, 전화번호, 이메일 등 개인 정보를 남기면 타인에 의해 도용될 수 있습니다.</li>
						</ul>
					</template>
				</dropdown>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useInquiry } from '$/composables/useInquiry';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import MyInquiryInput from '@/page/mypage/inquiry/component/MyInquiryInput.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
		orderId: string;
		seller: QnaSeller;
	}>();

	const selectedOrderItem = ref();

	defineExpose<OverlayComponentExpose>({
		title: `판매자 문의하기`,
	});

	const { bom, loading } = useGlobalPageContext();
	const { optionText, phone } = useFormatter();
	const { getSellerQnaTypes, getSellerQnaOrderItems, storeSellerQna } = useInquiry();

	/** 문의유형 및 문의가능 주문상품 조회 */
	const [qnaTypes, orderItems] = await Promise.all([
		getSellerQnaTypes(),
		getSellerQnaOrderItems(props.orderId, props.seller.id),
	]);

	const { form, validate } = useForm<SellerQnaStoreForm>(
		{
			order_id: props.orderId,
			order_item_ids: [],
			type: null,
			title: '',
			contents: '',
			is_private: false,
		},
		{
			rule: {
				'order_id(주문번호)': ['required'],
				'order_item_ids(주문상품)': ['required'],
				'type(문의 유형)': ['required'],
				'title(문의 제목)': ['required', 'maxLength:50'],
				'contents(문의 내용)': ['required', 'minLength:10', 'maxLength:2000'],
			},
			message: {
				'order_id.required': ':param(을/를) 선택해주세요.',
				'order_item_ids.required': ':param(을/를) 선택해주세요.',
				'type.required': ':param(을/를) 선택해주세요.',
			},
		}
	);


	/** 선택된 주문상품 */
	const selectedOrderItems = computed(() => orderItems.filter(item => form.value.order_item_ids.includes(item.id)));

	/** 주문상품 선택 처리 */
	function selectOrderItem(orderItemId: number) {
		form.value.order_item_ids = form.value.order_item_ids
			.filter(itemId => orderItemId != itemId && itemId != null)
			.concat(orderItemId != null ? [orderItemId] : []);
		selectedOrderItem.value = null;
	}
	/** 주문상품 선택취소 처리 */
	function unselectOrderItem(orderItemId: number) {
		form.value.order_item_ids = form.value.order_item_ids.filter(itemId => orderItemId != itemId);
		selectedOrderItem.value = null;
	}


	/** 문의 등록 */
	async function store() {
		loading.show();
		try {
			await validate();
			await storeSellerQna(form.value);
			bom.alert('판매자 문의가 등록되었습니다.', props.closer);
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}
</script>