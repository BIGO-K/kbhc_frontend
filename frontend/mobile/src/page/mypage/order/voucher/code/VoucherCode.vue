<template>
	<div class="m_voucher-code">
		<h4><b>일련 번호</b></h4>
		<div class="mm_flex">
			<p
				ref="voucherEl"
				v-html="voucherCodeHtml"
			></p>
			<button
				type="button"
				class="btn_copy"
				@click.prevent="copy"
			>
				<i class="ico_copy"></i>
				<b class="mm_ir-blind">복사하기</b>
			</button>
		</div>
		<!-- (D) 선물받기 외부 페이지일 경우 '바우처 사용' 버튼이 노출됩니다. -->
		<div
			v-if="showVoucherUseButton"
			class="mm_btn_box"
		>
			<div class="mm_inline">
				<a
					class="mm_btn T=xs T=primary"
				>
					<b>바우처 사용</b>
				</a>
			</div>
		</div>
		<p class="text_note">
			<i class="ico_caution"></i>일련 번호가 노출되면 도용될 수 있으니 주의하세요!
		</p>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { chunk } from '$/utils/array';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';

	const props = withDefaults(defineProps<{
		voucherCode: string;
		showVoucherUseButton?: boolean;
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>(), {
		showVoucherUseButton: false,
	});

	defineExpose<ModalComponentExpose>({
		title: `바우처 일련번호 확인`,
	});

	const { bom } = useGlobalPageContext();
	const voucherEl = ref<Element | null>(null);
	const voucherCodeHtml = chunk(props.voucherCode.split(''), 4)
		.map(splitted => `<span>${splitted.join('')}</span>-`)
		.join('')
		.slice(0, -1);

	async function copy() {
		if (navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(props.voucherCode);
			}
			catch (e) {
				legacyCopy();
			}
		}
		else {
			legacyCopy();
		}
		bom.alert('복사되었습니다.');
	}

	function legacyCopy() {
		const textArea = document.createElement('textarea');
		textArea.value = props.voucherCode;
		textArea.style.position = 'absolute';
		textArea.style.zIndex = '-1';
		textArea.style.top = '-100%';
		textArea.style.left = '-100%';
		textArea.style.pointerEvents = 'none';

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		document.execCommand('copy');
		textArea.remove();
	}
</script>