<template>
	<div class="skeleton-screen">
		<div class="section1">
			<span class="bar"></span>
			<span class="bar"></span>
			<span class="circle"></span>
		</div>
		<div class="section2">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
		<div class="section3"></div>
		<div class="section4"></div>
		<div class="section5">
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onBeforeUnmount } from 'vue';

	onMounted(() => {
		if (document.children[0]) {
			(document.children[0] as HTMLElement).style.setProperty('font-size', `16px`);
		}
	});

	onBeforeUnmount(() => {
		if (document.children[0]) {
			(document.children[0] as HTMLElement).style.removeProperty('font-size');
		}
	});
</script>

<style lang="scss">
	.skeleton-screen {
		--bar-color: #f8f8f8;
		--gradient-color: #fff;
		margin-inline: 1.5rem;
		padding-top: 1rem;

		&[class*='section'],
		&[class*='section'] > span {
			overflow:hidden;
			position:relative
		}

		.section5 span::before,
		.section4::before,
		.section3::before,
		.section2 span::before,
		.section1::before {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(to right, transparent, var(--gradient-color), transparent);
			transform: translate(-100%);
			animation: skeletone-loading 1.5s infinite forwards;
			content: '';
		}

		.section1 {
			padding: 1.25rem 1rem;
			border-radius: 16px;
			background-color: var(--bar-color);

			&::before {
				--gradient-color: #f8f8f8;
			}

			> span {
				background-color: #fff;
			}

			.bar {
				display: block;
				border-radius: 50px;

				&:first-child {
					width: 40vw;
					height: 1.125rem;
				}

				&:nth-child(2) {
					margin-top: .75rem;
					width: 53.334vw;
					height: .875rem;
				}
			}

			.circle {
				position: absolute;
				top: 50%;
				right: 1rem;
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				transform: translateY(-50%);
			}
		}

		.section2 {
			margin-top: 2rem;

			> span {
				display: block;
				overflow: hidden;
				margin-top: .5rem;
				height: 1.25rem;
				border-radius: 16px;
				background-color: var(--bar-color);

				&:first-child{
					margin-bottom: 1rem;
					width: 24vw;
					height: 1rem;
				}
			}
		}

		.section3 {
			margin-top: 2.5rem;
			height: 3rem;
			border-radius: 8px;
			background-color: var(--bar-color);
		}

		.section4 {
			margin-top: 3rem;
			height: 1.25rem;
			border-radius: 20px;
			background-color: var(--bar-color);
		}

		.section5 {
			display: flex;
			column-gap: 6px;
			margin-inline-end: -1.5rem;
			margin-top: 3rem;

			> span {
				flex: 0 0 9.375rem;
				margin-top: .5rem;
				width:9.375rem;
				height: 9.375rem;
				border-radius: 16px;
				background-color: var(--bar-color);
			}
		}
	}

	@keyframes skeletone-loading{
		to {
			transform: translate(100%);
		}
	}
</style>