<template>
	<layout
		title="문의 관리"
		layout="popup"
	>
		<tab-router
			class="m_my-tab T=lg"
			:is-keep="false"
		></tab-router>
	</layout>
</template>

<script setup lang="ts">
	import Layout from '@/component/layout/Layout.vue';
	import TabRouter from '@/component/TabRouter.vue';
</script>