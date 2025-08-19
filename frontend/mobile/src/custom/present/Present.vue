<template>
	<present-success
		v-if="!gift.gift_acceptance_required"
		:gift="gift"
	></present-success>
	<layout
		v-else
		title="선물받기"
		layout="popup"
		class="L=present"
	>
		<div class="m_present">
			<div class="m_present-head">
				<div class="mm_inner">
					<h2 class="mm_title">
						<b>{{ gift.receiver_name }}님에게 보내신<br> 소중한 선물이 도착했어요!</b>
					</h2>
					<div
						v-if="gift.gift_info"
						class="m_present-message"
					>
						<lazyload
							class="image_card mm_bg-cover"
							:src="gift.gift_info.background_image_url"
						></lazyload>
						<p class="text_readonly T=teatarea">
							<b>{{ gift.gift_info.message }}</b>
						</p>
					</div>
				</div>
			</div>

			<!-- 선물 정보 -->
			<section>
				<div class="mm_inner">
					<h4><b>선물 정보</b></h4>
					<div class="mm_product-list T=sm">
						<ul>
							<li
								v-for="item in gift.order_items"
								:key="item.id"
							>
								<my-order-item
									:order-item="item"
									disable-link
								></my-order-item>
								<div class="mm_product-unit">
									<present-option-change
										v-model:option-id="item.goods.option_id"
										:goods-id="item.goods.id"
										@change="(_id, _name) => {
											updateOptionForm(item.id, _id);
											item.goods.option_name = _name;
										}"
									></present-option-change>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<!-- 배송지 정보 -->
			<section>
				<div class="mm_inner">
					<h4><b>배송지 정보</b></h4>
					<div class="mm_form_mix-address">
						<h6><b>주소</b></h6>
						<div class="mm_form_mix-linked">
							<form-text
								v-model="form.shipping_address.zip_code"
								readonly
								placeholder="우편번호"
								label-on-blind
							></form-text>
							<button
								type="button"
								class="mm_btn T=lg T=support"
								@click="overlayAddressPostcode"
							>
								<b>우편번호 찾기</b>
							</button>
						</div>
						<form-text
							v-model="form.shipping_address.base_address"
							readonly
							label-on-blind
							placeholder="검색주소"
						></form-text>
						<form-text
							v-model="form.shipping_address.detail_address"
							placeholder="상세 주소를 입력하세요(필수입력)"
						></form-text>
					</div>
					<h6><b>배송메모</b></h6>
					<form-select
						v-model="selectedShippingMessageTemplate"
						title="배송메모"
						use-overlay
					>
						<option
							v-for="template in shippingMessageTemplates"
							:key="template"
							:value="template"
						>
							{{ template }}
						</option>
					</form-select>
					<div
						v-if="selectedShippingMessageTemplate.trim() === '직접 입력'"
						class="m_address_note"
					>
						<form-text
							v-model="shippingMessage"
							maxlength="20"
							placeholder="배송메모를 입력하세요"
						></form-text>
					</div>
					<template v-if="gift.personal_clearance_code_required">
						<h6><b>해외배송 개인통관고유부호</b></h6>
						<form-text
							v-model="form.personal_clearance_code"
							maxlength="13"
							placeholder="P로 시작하는 정보를 입력하세요"
						></form-text>
						<div class="mm_note T=bg">
							<ul>
								<li>해외배송 상품은 관세청 통관을 위해 구매 고객의 고유식별정보를 판매자에게 제공합니다.</li>
								<li>개인통관고유부호는 통관 시 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
							</ul>
						</div>
						<div class="mm_check-list">
							<ul>
								<li>
									<div class="mm_flex">
										<form-check
											v-model="form.is_agree_collect_personal_clearance_code"
											icon-class="T=sm"
										>
											<span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 수집에 동의합니다.</span>
										</form-check>
										<a
											class="btn_detail"
											href="#"
											@click.prevent="overlayOrderUnipass"
										>
											<b>자세히</b>
										</a>
									</div>
								</li>
								<li>
									<div class="mm_flex">
										<form-check
											v-model="form.is_agree_provide_personal_clearance_code"
											icon-class="T=sm"
										>
											<span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 판매자 제공 동의합니다.</span>
										</form-check>
										<button
											type="button"
											class="btn_detail"
											@click="overlayOrderUnipass"
										>
											<b>자세히</b>
										</button>
									</div>
								</li>
							</ul>
						</div>
					</template>
				</div>
			</section>
			<div class="mm_inner">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="acceptGift"
					>
						<b>선물받기</b>
					</button>
				</div>
				<div class="mm_note T=bg">
					<ul>
						<li>주소를 입력하지 않고 선물받은 다음날부터 7일이 소요되면 주문은 자동으로 취소됩니다. (취소 시, 구매자분에게 환불됩니다.)</li>
						<li>배송지 주소는 필수 입력 사항입니다.</li>
						<li>주소 입력 이후 변경이 필요하시면 고객센터에 문의해주세요. (고객센터: 1234-5678, 운영시간: 월~금 09시~18시, 점심시간: 12시~13시)</li>
					</ul>
				</div>
			</div>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import { ref, defineAsyncComponent, computed } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
	import { useGift } from '$/composables/useGift';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Layout from '@/component/layout/Layout.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormCheck from '@/component/form/FormCheck.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';
	import PresentOptionChange from '@/custom/present/component/PresentOptionChange.vue';
	import PresentSuccess from '@/custom/present/success/PresentSuccess.vue';

	const props = defineProps<{
		giftCode: string;
	}>();

	const { loading, router, openOverlay } = useGlobalPageContext();
	const { get, accept } = useGift();
	const gift = ref<Gift>({
		gift_code: '',
		order_id: '',
		receiver_name: '',
		sender_name: '',
		gift_acceptance_required: false,
		personal_clearance_code_required: false,
		gift_info: null,
		order_items: [],
		shipping_address: null,
		personal_clearance_code: null,
	});

	await getGift();


	/** 배송 메세지 템플릿 */
	const shippingMessageTemplates = [
		'배송메모를 선택하세요',
		'부재 시 경비실에 맡겨주세요',
		'빠른 배송 부탁드립니다',
		'부재 시 핸드폰으로 연락 바랍니다',
		'배송 전 연락 바랍니다',
		'직접 입력',
	];
	const shippingMessage = ref('');
	const selectedShippingMessageTemplate = ref('배송메모를 선택하세요');

	const legacyOptions = computed(() => Object.fromEntries(
		gift.value.order_items
			.map(orderItem => [orderItem.id, orderItem.goods.option_id])
	));

	const { form, validate } = useForm<GiftAcceptForm & {
		personal_clearance_code_required: boolean;
		is_agree_collect_personal_clearance_code: boolean;
		is_agree_provide_personal_clearance_code: boolean;
	}>(
		{
			order_id: gift.value.order_id,
			shipping_address: {
				zip_code: '',
				base_address: '',
				detail_address: '',
				message: '',
			},
			personal_clearance_code: null,
			options: [],
			personal_clearance_code_required: gift.value.personal_clearance_code_required,
			is_agree_collect_personal_clearance_code: false,
			is_agree_provide_personal_clearance_code: false,
		},
		{
			rule: {
				'order_id': ['required'],
				'shipping_address.zip_code(우편번호)': ['required'],
				'shipping_address.base_address(주소)': ['required'],
				'shipping_address.detail_address(상세주소)': ['required'],
				'personal_clearance_code(개인통관 고유부호)': ['requiredIf:personal_clearance_code_required,true', 'validCode'],
				'is_agree_collect_personal_clearance_code(개인통관고유부호 수집에 동의)': ['validIsAgree'],
				'is_agree_provide_personal_clearance_code(개인통관고유부호 판매자 제공에 동의)': ['validIsAgree'],
			},
			message: {

			},
			testers: [
				{
					name: 'validCode',
					defaultMessageOnFailure: ':param(을/를) 확인해주세요',
					handler: (): boolean => {
						if (!gift.value.personal_clearance_code_required || !form.value.personal_clearance_code) {
							return true;
						}

						return form.value.personal_clearance_code !== '' && /^[Pp][0-9]{12}$/g.test(form.value.personal_clearance_code);
					},
				},
				{
					name: 'validIsAgree',
					defaultMessageOnFailure: ':param(을/를) 동의해주세요',
					handler: (value): boolean => {
						return form.value.personal_clearance_code_required ? `${value}` == 'true' : true;
					},
				},
			],
		}
	);

	const overlayAddressPostcode = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/address/postcode/AddressPostcode.vue')), {
			clickElement: _e.currentTarget,
			onClose: (address: SearchAddress) => {
				form.value.shipping_address.zip_code = address.zip_code;
				form.value.shipping_address.base_address = address.road_address;
			},
		});
	};

	const overlayOrderUnipass = (_e: MouseEvent) => {
		openOverlay(defineAsyncComponent(() => import('@/page/order/unipass/OrderUnipass.vue')), {
			clickElement: _e.currentTarget,
		});
	};

	async function getGift() {
		try {
			gift.value = await get(props.giftCode);
		}
		catch (e) {
			useErrorAlert(e, {
				alertCallback: () => {
					router.go(-1);
				},
			});
		}
	}

	async function updateOptionForm(orderItemId: number, optionId: number) {
		form.value.options = form.value.options
			.filter(option => option.order_item_id != orderItemId)
			.concat(
				legacyOptions.value[orderItemId] == optionId
					? []
					: [{
						order_item_id: orderItemId,
						option_id: optionId,
					}]
			);
	}

	async function acceptGift() {
		loading.show();
		try {

			switch (selectedShippingMessageTemplate.value.trim()) {
				case '직접 입력':
					form.value.shipping_address.message = shippingMessage.value;
					break;
				case '배송메모를 선택하세요':
					form.value.shipping_address.message = '';
					break;
				default:
					form.value.shipping_address.message = selectedShippingMessageTemplate.value;
			}
			await validate();

			const {
				is_agree_collect_personal_clearance_code,
				is_agree_provide_personal_clearance_code,
				personal_clearance_code_required,
				...acceptForm
			} = form.value;

			await accept(acceptForm);
			await getGift();
		}
		catch (e) {
			useErrorAlert(e);
		}
		finally {
			loading.hide();
		}
	}
</script>