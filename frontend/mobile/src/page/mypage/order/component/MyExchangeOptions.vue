<template>
	<p
		v-if="exchangeOptions || exchangedOptions"
		class="text_changed"
	>
		<strong class="mm_text-variable">변경된 옵션</strong>
		<span
			v-for="(option, key) in exchangeOptions"
			:key="key"
		>{{ `${option[0].label1} ${option[0].label2} / ${option.length}개` }}</span>
		<span
			v-for="option in exchangedOptions"
			:key="option[0]"
		>{{ `${optionText(option[0])} / ${option.length}개` }}</span>
	</p>
</template>
<script setup lang="ts">
	import { computed } from 'vue';
	import { defined, groupBy } from '$/utils/array';
	import { useFormatter } from '$/composables/useFormatter';

	const props = defineProps<{
		orderItem: OrderItemSet<ExchangeableOrderItem> | ExchangeDetailOrderItemSet;
	}>();

	const { optionText } = useFormatter();

	const exchangeOptions = computed(() => {
		const options = props.orderItem.items
			.map(exchangeItem => 'exchange_option' in exchangeItem ? exchangeItem.exchange_option : null)
			.filter(defined);

		const groupById = groupBy(options, 'id');

		return Object.values(groupById).find(group => group.length > 0) ? groupById : null;
	});
	const exchangedOptions = computed(() => {
		const options = props.orderItem.items
			.map(exchangeItem => 'exchanged_option_name' in exchangeItem ? exchangeItem.exchanged_option_name : null)
			.filter(defined);

		const groupById = groupBy(options, (item) => item);

		return Object.values(groupById).find(group => group.length > 0) ? groupById : null;
	});
</script>