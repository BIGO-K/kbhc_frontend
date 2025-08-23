<template>
	<div
		class="m_error"
		:class="{ 'T=renewal': $route.name === 'ErrorRenewal' }"
	>
		<article class="m_error-inner">
			<router-view></router-view>

			<div
				v-if="$route.name !== 'ErrorRenewal' && $route.name !== 'ErrorMaintenance'"
				class="mm_btn_box"
			>
				<div class="mm_flex T=equal">
					<a
						class="mm_btn T=lg T=support"
						href="#"
						@click.prevent="goMain()"
					>
						<b>메인으로 이동</b>
					</a>
					<button
						type="button"
						class="mm_btn T=lg T=primary"
						@click="historyBack"
					>
						<b>이전으로</b>
					</button>
				</div>
			</div>
		</article>
	</div>
</template>

<script setup lang="ts">
	import { useRouter } from 'vue-router';
	import { useAppBridge } from '$/composables/useAppBridge';

	const router = useRouter();
	const { closeCurrentWebview, goMain } = useAppBridge();

	/** 브라우저 뒤로가기와, 자체 버튼 뒤로가기 처리를 위해 필요 * */
	const historyBack = () => {
		if (window.history.state.position === 0
			&& window.history.state.back == null
		) {
			return closeCurrentWebview();
		}

		router.go(-1);
	};
</script>