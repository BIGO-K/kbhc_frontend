<template>
	<div class="m_inquiry">
		<dl><dt>업체 정보</dt>-<dd></dd></dl>
		<div class="mm_inner">
			<div class="mm_product-select">
				<form-select
					v-model="selectProduct"
					title="문의상품"
					use-overlay
				>
					<option :value="null">
						문의 상품 선택
					</option>
					<option
						v-for="goods in bundleChildGoods"
						:key="goods.id"
						:value="goods"
					>
						<b class="m...overlay-product">
							<i
								class="mm_bg-cover image_product"
								:style="`background-image:url(${goods.thumbnail_url})`"
							></i>
							<span class="text_product">
								{{ goods.name }}
							</span>
						</b>
					</option>
				</form-select>

				<!-- 선택된 상품 -->
				<div
					v-if="selectProduct"
					class="mm_scroller"
				>
					<div class="mm_product-list T=xs">
						<ul>
							<li>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													:src="selectProduct.thumbnail_url"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">{{ selectProduct.name }}</p>
											</figcaption>
										</figure>
									</a>
									<button
										type="button"
										class="btn_remove"
										@click="clearSelectedProduct"
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
				v-model.number="qnaForm.sub_type"
				use-overlay
				title="문의 유형"
			>
				<option :value="null">
					문의 유형 선택
				</option>
				<option
					v-for="qnaType in sellerQnaTypes"
					:key="qnaType.code"
					:value="qnaType.code"
				>
					{{ qnaType.label }}
				</option>
			</form-select>

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
						@click="store"
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
	import mons from '$/utils/mons';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useForm } from '$/composables/useForm';
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
		bundleGoodsId: number;
		bundleChildGoods: BundleChildGoods[];
	}>();

	const selectProduct = ref<Nullable<BundleChildGoods>>(null);
	const { storeGoodsQna, getSellerQnaTypes } = useInquiry();
	const sellerQnaTypes = ref<SellerQnaType[]>([]);
	getSellerQnaTypes(true).then(pQnaTypes => sellerQnaTypes.value = pQnaTypes);
	/** form composable */
	const { form: qnaForm, validate } = useForm<GoodsQnaStoreForm>(
		{
			bundle_goods_id: props.bundleGoodsId,
			title: '',
			sub_type: null,
			contents: '',
			is_private: false,
		},
		{
			rule: {
				'sub_type(문의 유형)': ['required'],
				'title(문의 제목)': ['required', 'maxLength:50'],
				'contents(문의 내용)': ['required', 'minLength:10', 'maxLength:2000'],
			},
			message: {
				'sub_type.required': ':param(을/를) 선택해주세요.',
			},
		}
	);


	defineExpose<OverlayComponentExpose>({
		title: `상품 문의하기`,
	});

	const { loading, bom } = mons();

	async function store() {
		if (!selectProduct.value) {
			return bom.alert('상품을 선택해주세요.');
		}

		loading.show();
		try {
			await validate();
			await storeGoodsQna(selectProduct.value.id, qnaForm.value);
			bom.alert('문의가 등록되었습니다.', () => {
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

	const clearQnaForm = () => {
		qnaForm.value = {
			title: '',
			sub_type: null,
			contents: '',
			is_private: false,
		};
	};

	function clearSelectedProduct() {
		bom.confirm('선택된 상품을 삭제하시겠습니까?\n 작성하신 문의 내용도 초기화 됩니다.', _f => {
			if (_f) {
				clearQnaForm();
				selectProduct.value = null;
			}
		});
	}
</script>