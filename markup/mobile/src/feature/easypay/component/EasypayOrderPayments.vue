<template>
	<li
		v-for="item in paymentItems"
		:key="item.key"
	>
		<form-radio
			v-model="paymentMethod"
			name="dev_radio-payment"
			:value="item.key"
			@update:model-value="_value => emit('update:payment-method', _value as string)"
		>
			<b class="text_label">{{ item.name }}</b>
		</form-radio>
	</li>
</template>

<script setup lang="ts">
	import { toRefs } from 'vue';
	import FormRadio from '@/component/form/FormRadio.vue';

	const prop = withDefaults(defineProps<{
		paymentMethod: string;
	}>(), {
	});

	const emit = defineEmits<{
		'update:payment-method': [value: string];
	}>();

	const { paymentMethod } = toRefs(prop);
	const paymentItems = [
		{
			key: 'naver',
			name: '네이버페이',
		},
		{
			key: 'kakao',
			name: '카카오페이',
		},
		{
			key: 'payco',
			name: '페이코',
		},
		{
			key: 'toss',
			name: '토스페이',
		},
	];
</script>