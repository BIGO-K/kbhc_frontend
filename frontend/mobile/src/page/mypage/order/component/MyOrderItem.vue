<template>
	<div :class="['mm_product-item', { 'S=soldout': goods.is_soldout }]">
		<component
			:is="disableLink ? 'a' : 'mm-link'"
			:to="disableLink ? null : { name: 'ProductDetail', params: { id: goods.bundle_goods_id ?? goods.id } }"
		>
			<figure>
				<div class="mm_product-item-image">
					<lazyload
						class="mm_bg-cover image_product"
						:src="goods.thumbnail_url"
					></lazyload>
					<p
						v-if="goods.is_soldout"
						class="text_soldout"
					>
						<b>품절</b>
					</p>
					<p
						v-if="orderItem.is_intangible_product_used"
						class="text_voucher"
					>
						<b>사용 완료</b>
					</p>
					<p
						v-if="orderItem.is_intangible_product_expired"
						class="text_voucher"
					>
						<b>사용 종료</b>
					</p>
				</div>
				<figcaption>
					<p
						v-if="orderItem.order_status_label"
						class="text_status"
					>
						{{ orderItem.order_status_label }}
						<b
							v-if="orderItem.refund_status_label"
							class="mm_tag T=bg T=gray"
						>{{ orderItem.refund_status_label }}</b>
					</p>
					<p class="text_brand">
						{{ goods.brand_name }}
					</p>
					<p class="text_product">
						{{ goods.name }}
					</p>
					<p
						v-if="price > 0"
						class="text_price"
					>
						<strong>{{ number(price) }}</strong>
					</p>
					<p class="text_option">
						{{ `${optionText(goods.option_name)} / ${goods.ea}개` }}
					</p>
				</figcaption>
			</figure>
		</component>
	</div>
</template>
<script setup lang="ts">
	import { computed } from 'vue';
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';

	const props = withDefaults(defineProps<{
		orderItem: OptionalOrderItem;
		disableLink?: boolean;
	}>(), {
		disableLink: false,
	});

	const { number, optionText } = useFormatter();
	const goods = computed(() => {
		return Object.assign({}, props.orderItem.goods, {
			ea: Math.max(props.orderItem.goods.ea || 0, 1),
		});
	});
	const price = computed(() => {
		return (props.orderItem.paid_price || 0)
			+ (props.orderItem.star_point_used || 0)
			+ (props.orderItem.reward_point_used || 0);
	});
</script>