
<template>
	<i class="image_error T=lg">
		<img
			src="/image/common/error.svg"
			alt="오류"
		>
	</i>
	<h1><b>{{ errorMessage ? errorMessage : '불편을 드려 죄송합니다' }}</b></h1>
	<template v-if="!errorMessage">
		<p>찾고 계시는 페이지가 삭제 또는 변경되어<br> 일시적인 오류로 표시할 수 없습니다</p>
	</template>
</template>

<script setup lang="ts">
	import { useRouteQueryCast } from '$/composables/useRouteQueryCast';
	const { queryToString } = useRouteQueryCast();

	const errorMessage = queryToString('message', '');
</script>