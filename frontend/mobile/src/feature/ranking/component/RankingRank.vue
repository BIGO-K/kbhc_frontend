<template>
	<p class="text_rank">
		<template v-if="isChangedRank">
			<span :class="`text_${changedState.class}`">
				<i
					:class="`ico_${changedState.class}`"
					:title="changedState.label"
				></i>{{ prop.change_value }}
			</span>
		</template>
		<template v-else>
			<i
				:class="`ico_${changedState.class}`"
				:title="changedState.label"
			></i>
		</template>
	</p>
</template>

<script setup lang="ts">
	import { computed } from 'vue';

	const prop = defineProps<{
		rank: HasRank['rank'];
		change_type: HasRank['change_type'];
		change_value: HasRank['change_value'];
	}>();

	const isChangedRank = computed(() => prop.change_type === 'U' || prop.change_type === 'D');
	const changedStateMap: Record<HasRank['rank' | 'change_type'], Record<'class' | 'label', string>> = {
		U: { class: 'rank-up', label: '상승' },
		D: { class: 'rank-down', label: '하락' },
		N: { class: 'rank-new', label: '신규' },
		S: { class: 'rank-unchanged', label: '변동없음' },
	};

	const changedState = computed(() => changedStateMap[prop.change_type]);
</script>