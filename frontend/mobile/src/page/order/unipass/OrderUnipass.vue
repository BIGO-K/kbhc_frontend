<template>
	<div class="m_unipass">
		<ul>
			<li>
				<dl>
					<dt>1. 개인통관 고유부호 수집</dt>
					<dd>개인통관고유부호는 수입 통관 업무 처리를 위해 수집하며, 서비스 이용 기간 동안 보관합니다.</dd>
				</dl>
			</li>
			<li>
				<dl>
					<dt>2. 개인통관 고유부호 수집</dt>
					<dd>수입 통관 업무 처리를 위해 본 상품 판매자에게 개인통관고유부호를 제공하며, 해당 업무 처리 후 파기합니다.</dd>
				</dl>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `개인통관고유부호 수집 및 제공`,
	});
</script>