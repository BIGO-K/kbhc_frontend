<template>
	<p
		v-if="items.length < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>집계된 상품이 없습니다
	</p>

	<!-- VIEW 랭킹 -->
	<div
		v-else
		class="mm_inner m_ranking-view"
	>
		<!-- 랭킹 상단 -->
		<div class="m_ranking-head">
			<div class="m_ranking-head-update">
				<p class="text_update">
					<span>2023.00.00</span>기준
				</p>
				<toggle
					v-model:is-active="isTooltipActive"
					class="btn_help"
					parent-selector=".m_ranking-head-update"
				>
					<i class="ico_tooltip-notice"></i>
				</toggle>
				<div class="m...update-tooltip">
					<p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)산정기간: 2021.12.26. 00:00~23:59</p>
					<button
						type="button"
						class="btn_close"
						@click="isTooltipActive = false"
					>
						<i class="ico_tooltip-close"></i><b class="mm_ir-blind">닫기</b>
					</button>
				</div>
			</div>
			<form-select
				v-model="sortDate"
			>
				<option>일간</option>
				<option>주간</option>
				<option>월간</option>
			</form-select>
		</div>

		<!-- 상품리스트 -->
		<div class="mm_product-list T=card">
			<ol>
				<li
					v-for="(item, i) in testItems"
					:key="item.id"
				>
					<p class="text_rank">
						<span
							v-if="item.change_type === 'U' || item.change_type === 'D'"
							:class="item.change_type === 'U' ? 'text_rank-up' : 'text_rank-down'"
						>
							<i
								:class="item.change_type === 'U' ? 'ico_rank-up' : 'ico_rank-down'"
								:title="item.change_type === 'U' ? '상승' : '하락'"
							></i>{{ item.change_value }}
						</span>
						<i
							v-else
							:class="item.change_type === 'N' ? 'ico_rank-new' : 'ico_rank-unchanged'"
							:title="item.change_type === 'N' ? '신규' : '변동없음'"
						></i>
					</p>
					<product-item
						v-if="i < 7"
						class="T=pa"
						:goods="item"
						:usable="{
							keys: ['review_count', 'price', 'badges', 'base_discounted_price', 'sale_rate', 'brand_name', 'is_soldout', 'is_use_stock_notify'],
							isReverse: true
						}"
						:use-wish="false"
					></product-item>

					<product-item
						v-else
						class="T=pa"
						:goods="item"
						:usable="{
							keys: ['review_count', 'price', 'badges'],
							isReverse: true,
						}"
					></product-item>
				</li>
			</ol>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useFakeCreator } from '$/composables/useFakeCreator';
	import ProductItem from '@/component/ProductItem.vue';
	import Toggle from '@/component/Toggle.vue';
	import FormSelect from '@/component/form/FormSelect.vue';

	const isTooltipActive = ref(false);

	const sortDate = ref('');

	type change_type = 'U' | 'D' | 'N' | '';// TODO 타입 불러오기 확인
	const changeTypes = ['U', 'D', 'N', ''];

	const testItems = (useFakeCreator().goods(11) as unknown[] as (Goods & HasRank)[]).map((_item, _i) => {
		_item.rank = _i;
		_item.change_type = (changeTypes[Math.floor(Math.random() * changeTypes.length)]) as change_type;
		_item.change_value = Math.floor(Math.random() * 10);

		return _item;
	});

	const items: unknown[] = [''];// 내용없음 확인용 임시 변수
</script>