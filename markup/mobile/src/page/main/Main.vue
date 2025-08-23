<template>
	<div class="mm_view L=main">
		<div
			id="mm_body"
			class="mm_page"
		>
			<div class="mm_scroller">
				<div class="mm_page-inner">
					<div class="mm_page-content">
						<div class="m_main">
							<main-skeleton></main-skeleton>

							<div class="mm_mui T=full">
								<block-bcw6xh7></block-bcw6xh7>
							</div>
							<div class="mm_mui T=full">
								<block-bcw6xh8></block-bcw6xh8>
							</div>
							<div class="mm_mui T=full">
								<block-bpnsw6xh16></block-bpnsw6xh16>
							</div>
							<div class="mm_mui T=full">
								<block-pcw6xh11></block-pcw6xh11>
							</div>
							<div class="mm_mui T=full">
								<block-pcw6xh12></block-pcw6xh12>
							</div>
							<div class="mm_mui T=full">
								<block-bcw6xh3></block-bcw6xh3>
							</div>
							<div class="mm_mui T=full">
								<block-pcw6xh12></block-pcw6xh12>
							</div>
							<div class="mm_mui T=full">
								<block-bpnsw6xh16></block-bpnsw6xh16>
							</div>
							<div class="mm_mui T=full">
								<block-bpnsw6xh16></block-bpnsw6xh16>
							</div>
							<div class="mm_mui T=full">
								<block-bpnsw6xh16></block-bpnsw6xh16>
							</div>
						</div>
					</div>
				</div>
			</div>

			<timedeal-toast-popup></timedeal-toast-popup>
		</div>
	</div>

	<main-popup></main-popup>
</template>

<script setup lang="ts">
	import TimedealToastPopup from '@/feature/timedeal/component/TimedealToastPopup.vue';
	import MainPopup from '@/page/main/component/MainPopup.vue';
	import MainSkeleton from '@/page/main/component/MainSkeleton.vue';
	import BlockBcw6xh3 from '@/page/main/component/b_c=w6Xh3_s1_6.vue';
	import BlockBcw6xh8 from '@/page/main/component/b_c=w6Xh5_s8.vue';
	import BlockBcw6xh7 from '@/page/main/component/b_c=w6Xh7_s1_2.vue';
	import BlockBpnsw6xh16 from '@/page/main/component/bp_ns=w6Xh16_s6.vue';
	import BlockPcw6xh11 from '@/page/main/component/p_c=w6Xh11_s3.vue';
	import BlockPcw6xh12 from '@/page/main/component/p_c=w6Xh12_s4.vue';
</script>

<style src="./_option.scss" lang="scss"></style>
<style src="./_product.scss" lang="scss"></style>