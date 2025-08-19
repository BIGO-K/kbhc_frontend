<template>
	<layout title="주문관리">
		<div class="m_myorder">
			<tab-router
				class="m_myorder-tab"
				:is-flex="false"
			></tab-router>
		</div>
	</layout>
</template>

<script setup lang="ts">
	import Layout from '@/component/layout/Layout.vue';
	import TabRouter from '@/component/TabRouter.vue';
</script>