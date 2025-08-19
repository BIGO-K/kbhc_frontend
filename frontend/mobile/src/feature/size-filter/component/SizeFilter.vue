<template>
	<!-- 슈즈 -->
	<div class="mm_tab-item">
		<div class="mm_filter-tab-shoes">
			<div class="mm_scroller">
				<div class="mm_check-list">
					<ul>
						<li
							v-for="shoes in prop.selectShoesSize"
							:key="shoes.size"
						>
							<form-check
								v-model="selectedShoes"
								:value="shoes.size"
								:hide-icon="false"
								:label="shoes.size"
							></form-check>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { toRefs } from 'vue';
	import FormCheck from '@/component/form/FormCheck.vue';

	const prop = defineProps<{
		selectShoesSize: { size: string }[];
		selectedShoes: string[];
	}>();

	const selectedShoes = toRefs(prop.selectedShoes);
</script>