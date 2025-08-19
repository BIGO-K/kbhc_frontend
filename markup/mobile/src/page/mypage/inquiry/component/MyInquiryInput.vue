<template>
	<h6 class="mm_text-label">
		<b>문의 제목</b>
	</h6>
	<form-text
		v-model="inquiryTitle"
		maxlength="30"
		placeholder="문의 제목을 30자 이하로 입력하세요"
	></form-text>
	<h6 class="mm_text-label">
		<b>문의 내용</b>
	</h6>
	<form-textarea
		v-model="inquiryContent"
		placeholder="최소 10자 이상 입력하세요"
		:byte="2000"
	></form-textarea>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import FormText from '@/component/form/FormText.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';

	const inquiryTitle = ref('');
	const inquiryContent = ref('');
</script>