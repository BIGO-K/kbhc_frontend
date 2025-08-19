<template>
	<div class="m_voucher-info">
		<div class="mm_note T=bg">
			<ul>
				<li>구매확정 된 바우처의 반품은 판매자에게 직접 문의해 주시기 바랍니다.</li>
			</ul>
		</div>
		<table>
			<tbody>
				<tr>
					<th scpoe="row">
						셀러명
					</th>
					<td>셀러A</td>
				</tr>
				<tr>
					<th scpoe="row">
						대표번호
					</th>
					<td>02-000-0000</td>
				</tr>
			</tbody>
		</table>
		<div class="mm_foot">
			<div class="mm_btn_box">
				<button
					type="button"
					class="mm_btn T=primary"
				>
					<b>확인</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineExpose<ModalComponentExpose>({
		title: `바우처 반품 정보`,
	});
</script>1