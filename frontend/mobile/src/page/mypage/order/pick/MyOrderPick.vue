<template>
	<div class="m_myorder-option">
		<div class="mm_order-item">
			<form-check
				v-model="checkedAll"
				label="전체선택"
			></form-check>
			<div class="mm_order-item-seller">
				<div class="mm_order...seller-head">
					<h5><i class="ico_shop"></i><b>{{ orderItemSet.seller_name }}</b></h5>
				</div>
				<div class="mm_product-list T=sm">
					<ul>
						<li
							v-for="orderItem in orderItemSet.items"
							:key="orderItem.id"
						>
							<form-check
								v-model="selected"
								:value="orderItem[valueName]"
								label="상품 선택"
								label-on-blind
							></form-check>
							<my-order-item :order-item="orderItem"></my-order-item>
							<div
								v-if="orderItem.used_coupon_title"
								class="mm_product-unit"
							>
								<p class="text_readonly T=select">
									<b>{{ orderItem.used_coupon_title }}</b>
									<i class="ico_form-select"></i>
								</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="mm_foot">
			<div class="mm_inner">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
						@click="apply"
					>
						<b>적용하기</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import FormCheck from '@/component/form/FormCheck.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	const props = withDefaults(defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		orderItemSet: CancelableOrderItemSet | ExchangeableOrderItemSet;
		valueName?: keyof (CancelableOrderItemSet | ExchangeableOrderItemSet)['items'][number];
		legacySelected: number[];
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>(), {
		valueName: 'id',
	});

	defineExpose<OverlayComponentExpose>({
		title: `부분 선택`,
	});

	const { bom } = useGlobalPageContext();

	/** 전체선택 여부 */
	const checkedAll = computed({
		get: () => props.orderItemSet.items.length == selected.value.length,
		set: (val: boolean) => {
			selected.value = val
				? props.orderItemSet.items.map(orderItem => Number(orderItem[props.valueName]))
				: [];
		},
	});

	/** 선택된 주문상품 */
	const selected = ref<number[]>(props.legacySelected);

	/** 적용 */
	function apply() {
		if (selected.value.length < 1) {
			return bom.alert('상품을 선택해주세요.');
		}

		bom.alert('수량에 적용되었습니다.', () => {
			props.closer({ selected: selected.value });
		});
	}
</script>