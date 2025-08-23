<template>
	<div class="mm_inner m_raffle-winner">
		<table>
			<thead>
				<tr>
					<th scope="col">
						<b>이름</b>
					</th>
					<th scope="col">
						<b>아이디</b>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="winner in raffleWinner"
					:key="winner.login_id"
				>
					<td>{{ winner.name }}</td>
					<td>{{ winner.login_id }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `당첨자 전체보기`,
	});

	const raffleWinner = ref<Winner[]>([
		{
			login_id: 'abcde***',
			name: '**호',
		},
		{
			login_id: 'fghij***@naver.com',
			name: '**진',
		},
		{
			login_id: 'abc***@naver.com',
			name: '**희',
		},
		{
			login_id: 'fghij***@naver.com',
			name: '**호',
		},
		{
			login_id: 'abcde***',
			name: '**진',
		},
		{
			login_id: 'fghij***@naver.com',
			name: '**희',
		},
		{
			login_id: 'fghij***@naver.com',
			name: '**호',
		},
		{
			login_id: 'abc***@naver.com',
			name: '**진',
		},
		{
			login_id: 'abcde***',
			name: '**희',
		},
		{
			login_id: 'abc***@naver.com',
			name: '**호',
		},
	]);
</script>

<style src="./_raffle.scss" lang="scss"></style>