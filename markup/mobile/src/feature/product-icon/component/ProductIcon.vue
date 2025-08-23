<template>
	<!-- 상품아이콘 -->
	<p
		class="text_tag"
		:style="{ backgroundColor: icon.background_color_code, color: icon.font_color_code }"
	>
		{{ icon.label }}
	</p>
</template>

<script setup lang="ts">
	defineProps<{
		icon: NonNullable<Goods['icon']>;
	}>();
</script>