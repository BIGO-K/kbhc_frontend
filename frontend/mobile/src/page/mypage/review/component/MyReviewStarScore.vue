<template>
	<section>
		<h6><b>상품은 만족하셨나요?</b></h6>
		<!--
			(D) 별점이 선택된 상태일 때는 m_experience-starscore 태그에 'S=starscore-choice' 클래스가 추가됩니다.
			선택된 별점의 li에 'S=starscore-on' 클래스와 button에 '선택됨' 타이틀이 추가되며, input hidden의 value값에 점수가 입력됩니다. (0 선택안됨)
		-->
		<div :class="['m_review-write-starscore', {'S=starscore-choice': rate > 0}]">
			<ul>
				<li
					v-for="score in 5"
					:key="score"
					:class="{ 'S=starscore-on': (rate || 0) >= score }"
				>
					<button
						type="button"
						:title="rate === score ? '선택됨' : ''"
						@click="rate = score"
					>
						<i class="ico_star-fill"></i><b class="mm_ir-blind">5점 만점에 {{ score }}점</b>
					</button>
				</li>
			</ul>
			<input
				type="hidden"
				:value="rate"
			>
		</div>
	</section>
</template>
<script setup lang="ts">
	import { computed } from 'vue';
	const props = withDefaults(defineProps<{
		rate: Nullable<number>;
	}>(), {
		rate: 0,
	});

	const emit = defineEmits<(e: 'update:rate', value: number) => void>();

	const rate = computed({
		get: () => props.rate || 0,
		set: (value) => emit('update:rate', value || 0),
	});
</script>