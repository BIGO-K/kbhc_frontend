<template>
	<div class="m_voucher-code">
		<h4><b>일련 번호</b></h4>
		<div class="mm_flex">
			<p><span>{{ '1234' }}</span>-<span>{{ '5678' }}</span>-<span>{{ '9012' }}</span>-<span>{{ '1234' }}</span></p>
			<button
				type="button"
				class="btn_copy"
			>
				<i class="ico_copy"></i>
				<b class="mm_ir-blind">복사하기</b>
			</button>
		</div>
		<!-- (D) 선물받기 외부 페이지일 경우 '바우처 사용' 버튼이 노출됩니다. -->
		<div class="mm_btn_box">
			<div class="mm_inline">
				<mm-link
					class="mm_btn T=xs T=primary"
					to="http://"
				>
					<b>바우처 사용</b>
				</mm-link>
			</div>
		</div>
		<p class="text_note">
			<i class="ico_caution"></i>일련 번호가 노출되면 도용될 수 있으니 주의하세요!
		</p>
	</div>
</template>

<script setup lang="ts">
	defineExpose<ModalComponentExpose>({
		title: `바우처 일련번호 확인`,
	});
</script>1