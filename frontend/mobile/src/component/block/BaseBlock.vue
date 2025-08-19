<template>
	<div :data-mui="block.mui_code">
		<block-title
			:title1="block.title_1"
			:title2="block.title_2"
			:design-class-name="block.design_title_class_name"
		></block-title>
		<slot :context="context"></slot>
	</div>
</template>

<script setup lang="ts">
	import { useBlock } from '$/composables/useBlock';
	import BlockTitle from '@/component/block/BlockTitle.vue';

	const props = defineProps<{ block: Block }>();
	const { applyContext, getContext, getBannerContext, applyBannerContext } = useBlock();

	const context = {
		get: <Path extends keyof BlockContext> (
			key: Path,
			defaultValue: Path extends keyof BlockContext ? BlockContext[Path] : undefined
			): BlockContext[Path] => {
			const result = getContext(props.block)?.[key];

			return result || defaultValue;
		},
		set: (_context: BlockContext) => applyContext(props.block, _context),
		banner: {
			get: <Path extends keyof BlockContext> (
				banner: BlockBanner,
				key: Path,
				defaultValue: Path extends keyof BlockContext ? BlockContext[Path] : undefined
				): BlockContext[Path] => {
				const result = getBannerContext(props.block, banner)?.[key];

				return result || defaultValue;
			},
			set: (banner: BlockBanner, _context: BlockContext) => applyBannerContext(props.block, banner, _context),
		},
	};
</script>
