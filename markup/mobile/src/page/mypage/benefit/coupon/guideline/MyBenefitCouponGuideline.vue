<template>
	<!-- 상품목록 -->
	<div class="m_mycoupon">
		<!-- 모든 상품 -->
		<table v-if="props.couponType === 'all'">
			<thead>
				<tr>
					<th scope="col">
						<b>적용 제한사항</b>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="item in 8"
					:key="item"
				>
					<td>
						<p>최대 할인금액: <strong class="mm_text-variable">{{ number(1000) }}원</strong></p>
						<p>최저 금액조건: {{ number(30000) }}원</p>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- 상품 -->
		<table v-if="props.couponType === 'prod'">
			<colgroup>
				<col style="width:76px;">
				<col style="width:19.57186%;">
				<col style="width:19.57186%;">
				<col>
			</colgroup>
			<thead>
				<tr>
					<th scope="col">
						<b>상품</b>
					</th>
					<th scope="col">
						<b>브랜드명</b>
					</th>
					<th scope="col">
						<b>상품명</b>
					</th>
					<th scope="col">
						<b>적용 제한사항</b>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="item in 7"
					:key="item"
				>
					<td>
						<lazyload
							class="mm_bg-cover image_product"
							src="/image/_sample/prod_x1_1.png"
						></lazyload>
					</td>
					<td>KBHC오케어</td>
					<td>
						<p class="text_product">
							COLLEGE 스웻셔츠 Univ MTM 4COLOR
						</p>
					</td>
					<td>
						<p>최대 할인금액: <br><strong class="mm_text-variable">{{ number(1000) }}원</strong></p>
						<p>최저 금액조건: <br>{{ number(30000) }}원</p>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- 브랜드 -->
		<table v-if="props.couponType === 'brand'">
			<colgroup>
				<col style="width:37.92048%;">
				<col>
			</colgroup>
			<thead>
				<tr>
					<th scope="col">
						<b>브랜드명</b>
					</th>
					<th scope="col">
						<b>적용 제한사항</b>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="item in 8"
					:key="item"
				>
					<td>KBHC 오케어</td>
					<td>
						<p>최대 할인금액: <strong class="mm_text-variable">{{ number(1000) }}원</strong></p>
						<p>최저 금액조건: 30,000원</p>
					</td>
				</tr>
				<tr>
					<td>엠몬스타</td>
					<td>
						<p>최대 할인금액: <strong class="mm_text-variable">{{ number(1000) }}원</strong></p>
						<p>최저 금액조건: {{ number(0) }}원</p>
					</td>
				</tr>
				<tr>
					<td>엠몬스타</td>
					<td>
						<p>최대 할인금액: <strong class="mm_text-variable">{{ number(1000) }}원</strong></p>
						<p>최저 금액조건: {{ number(10000) }}원</p>
					</td>
				</tr>
				<tr>
					<td>엠몬스타</td>
					<td>
						<p>최대 할인금액: <strong class="mm_text-variable">{{ number(1000) }}원</strong></p>
						<p>최저 금액조건: {{ number(30000) }}원</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<pagination></pagination>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const props = defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		couponType: string;
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const { number } = useFormatter();

	defineExpose<OverlayComponentExpose>({
		title: `사용 조건`,
	});
</script>