<template>
	<span class="text_foreword">
		[{{ headline }}]
	</span>
</template>

<script setup lang="ts">
	defineProps<{ headline: string }>();
</script>
