<template>
	<div class="m_page-move">
		<h1><i class="ico_logo"></i><b class="mm_ir-blind">KBHC</b></h1>
		<p>페이지 이동을 위해<strong>아래 확인 버튼을 눌러주세요</strong></p>
		<div class="mm_btn_box">
			<button
				type="button"
				class="mm_btn T=primary T=lg"
				@click="emit('complete')"
			>
				<b>확인</b>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits<{
		'complete': [];
	}>();
</script>