<template>
	<div
		v-if="showTitle"
		:class="['mui_title', designClassName ]"
	>
		<h3
			v-if="title1"
			class="title_main"
		>
			<b>{{ title1 }}</b>
		</h3>
		<h4
			v-if="title2"
			class="title_sub"
		>
			<b>{{ title2 }}</b>
		</h4>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';

	const props = defineProps<{
		title1: Block['title_1'];
		title2: Block['title_2'];
		designClassName?: Block['design_title_class_name'];
	}>();

	const showTitle = computed(() => props.title1 || props.title2);
</script>
