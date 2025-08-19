
<template>
	<div class="m_prodetail-foot">
		<div class="m_prodetail-info">
			<ul>
				<li>
					<dropdown tag="dl">
						<template #button>
							<p><b>일반 상품 정보</b></p>
						</template>
						<template #content>
							<table>
								<tbody>
									<tr>
										<th scope="row">
											<b>상품번호</b>
										</th>
										<td>{{ goodsDetail.id }}</td>
									</tr>
									<tr>
										<th scope="row">
											<b>상품상태</b>
										</th>
										<td>{{ information?.use_state_label }}</td>
									</tr>
									<tr>
										<th scope="row">
											<b>브랜드</b>
										</th>
										<td>{{ goodsDetail.brand_name }}</td>
									</tr>
									<tr>
										<th scope="row">
											<b>원산지</b>
										</th>
										<td>{{ information?.origin_label }}</td>
									</tr>
								</tbody>
							</table>
						</template>
					</dropdown>
				</li>
				<li>
					<dropdown tag="dl">
						<template #button>
							<p><b>상품정보고시</b></p>
						</template>
						<template #content>
							<table>
								<tbody>
									<tr
										v-for="mandatory in information?.mandatory"
										:key="mandatory.title"
									>
										<th scope="row">
											<b>{{ mandatory.title }}</b>
										</th>
										<td>{{ mandatory.content }}</td>
									</tr>
								</tbody>
							</table>
						</template>
					</dropdown>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang='ts'>
	import { computed } from 'vue';
	import Dropdown from '@/component/Dropdown.vue';

	const prop = defineProps<{
		/** @prop { GoodsDetail } - @requires */
		goodsDetail: GoodsDetail;
		/** @prop { string } `default: ''` - slot.#default가 없을 때 노출되는 내용 */
		information: GoodsInformation;
	}>();

	const goodsDetail = computed(() => prop.goodsDetail);
	const information = computed(() => prop.information);
</script>