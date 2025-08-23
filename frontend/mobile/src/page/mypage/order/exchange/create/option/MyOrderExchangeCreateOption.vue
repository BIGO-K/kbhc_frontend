<template>
	<div class="m_myorder-option">
		<div class="mm_order-item">
			<div class="mm_order-item-seller">
				<div class="mm_order...seller-head">
					<h5><i class="ico_shop"></i><b>{{ sellerName }}</b></h5>
				</div>
				<div class="mm_product-list T=sm">
					<ul>
						<li
							v-for="orderItem in orderItems"
							:key="orderItem.id"
						>
							<my-order-item :order-item="orderItem"></my-order-item>
							<div class="mm_product-unit">
								<div class="m_myorder-option-change">
									<form-select
										v-model.number="selected[orderItem.id]"
										title="옵션"
										use-overlay
										need-overlay-hide-first-option
									>
										<option :value="null">
											옵션을 선택하세요
										</option>
										<option
											v-for="option in orderItem.exchangeable_options"
											:key="option.id"
											:value="option.id"
											:disabled="!isExchangeableOption(option, orderItem.goods.option_id)"
										>
											{{ `${option.label1}/${option.label2}` }}
										</option>
									</form-select>
								</div>
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
	import FormSelect from '@/component/form/FormSelect.vue';
	import MyOrderItem from '@/page/mypage/order/component/MyOrderItem.vue';

	type ExchangeableOption = ExchangeableOrderItem['exchangeable_options'][number];

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		orderItems: ExchangeableOrderItem[];
		isSameOptionSelectable: boolean;
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `옵션 변경`,
	});

	const { bom } = useGlobalPageContext();
	const selected = ref<Record<string, number>>({});
	const sellerName = computed(() => props.orderItems[0].seller_name);

	/** 적용 */
	function apply() {
		if (
			Object.keys(selected.value).length < 1
			|| Object.values(selected.value).some(optionId => [null, undefined, 0].includes(optionId))
		) {
			return bom.alert('옵션을 설정해주세요.');
		}

		bom.alert('옵션이 선택되었습니다.', () => {
			props.closer({ selected: selected.value });
		});
	}

	function isExchangeableOption(option: ExchangeableOption, legacyOptionId: number) {
		if (option.stock < 1) {
			return false;
		}

		if (!props.isSameOptionSelectable && option.id == legacyOptionId) {
			return false;
		}

		return true;
	}

	// 기존 선택 옵션 선택처리
	props.orderItems.forEach(item => {
		if (item.exchange_option) {
			const key = `${item.id}`;
			selected.value[key] = item.exchange_option.id;
		}
	});
</script>
