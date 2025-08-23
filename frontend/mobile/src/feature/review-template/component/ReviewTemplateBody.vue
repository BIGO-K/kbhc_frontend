<template>
	<h6 class="mm_text-label">
		<b>신체 정보 입력</b><strong class="mm_text-variable">(선택)</strong>
	</h6>
	<div class="mm_flex T=equal">
		<div class="mm_form_mix-linked">
			<form-text
				v-model.number="height"
				type="number"
				:max="999"
				placeholder="키"
			></form-text>
			<span class="text_linked">cm</span>
		</div>
		<div class="mm_form_mix-linked">
			<form-text
				v-model.number="weight"
				type="number"
				:max="999"
				placeholder="몸무게"
			></form-text>
			<span class="text_linked">kg</span>
		</div>
		<div class="mm_form_mix-linked">
			<form-select
				v-model.number="shoesSize"
				title="발사이즈"
				:use-overlay="true"
			>
				<option :value="null">
					발 사이즈
				</option>
				<option
					v-for="size in shoesSizeList"
					:key="size.id"
					:value="size.value"
				>
					{{ size.label }}
				</option>
			</form-select>
			<span class="text_linked">mm</span>
		</div>
	</div>
	<div class="mm_note T=bg">
		<ul>
			<li>해당 정보는 다른 분들의 사이즈 참고용으로만 사용되고 개인식별정보는 공개되지 않습니다</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { usePersonalization } from '$/composables/usePersonalization';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';

	const props = withDefaults(defineProps<{
		height: Nullable<number>;
		weight: Nullable<number>;
		shoesSize: Nullable<number>;
	}>(), {
		height: null,
		weight: null,
		shoesSize: null,
	});

	const emit = defineEmits<{
		(e: 'update:height', value: Nullable<number>): void;
		(e: 'update:weight', value: Nullable<number>): void;
		(e: 'update:shoesSize', value: Nullable<number>): void;
	}>();

	const { getShoesSizes } = usePersonalization();
	const shoesSizeList = ref<ShoesSize[]>(await getShoesSizes());

	const height = computed({
		get: () => props.height,
		set: (value) => emit('update:height', value),
	});

	const weight = computed({
		get: () => props.weight,
		set: (value) => emit('update:weight', value),
	});

	const shoesSize = computed({
		get: () => props.shoesSize,
		set: (value) => emit('update:shoesSize', value),
	});
</script>

<style lang="scss">
	@use '../../../asset/scss/helper/mixin';

	/** 리뷰 관리/체험단 */
	// 리뷰 쓰기
	.m_review-write {
		> .mm_inner {
			.mm_note + .mm_text-label {
				margin-top: 11px;
				padding-top: 20px;
			}

			// 신체정보입력
			> .mm_flex {
				flex-wrap: wrap;
				margin-top: -8px;

				> .mm_form_mix-linked {
					margin-top: 8px;
					min-width: 130px;
					max-width: 50%;

					.text_linked {
						margin-right: 0;
						margin-left: 8px;
						width: 35px;
						@include mixin.font('1.6rem/5rem');
					}
				}

				+ .mm_note {
					margin-top: 16px;
				}
			}
		}
	}
</style>