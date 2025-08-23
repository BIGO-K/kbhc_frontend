<template>
	<div class="m_review-detail">
		<carousel
			:items="reviews"
			:use-control="true"
			:is-auto-height="true"
			:control-icon-class="controlButtonClass"
			@complete="reviewAutoHide"
		>
			<template #default="{ item }">
				<div class="mm_scroller">
					<div class="mm_review">
						<div class="mm_review-head">
							<p class="text_user">
								<experience-review-tag v-if="item.is_experience_group"></experience-review-tag>
								<lazyload
									class="mm_bg-contain image_grade"
									:src="item.writer_grade_image_url"
									:is-error-image="false"
								></lazyload>
								<span class="mm_ir-blind">{{ item.writer_grade_label }}</span>
								{{ item.writer_masking_id }}
							</p>
							<p class="text_star">
								<i class="ico_star-fill"></i><span>{{ item.rate }}</span>
							</p>
						</div>
						<ul class="m...detail-image">
							<li
								v-for="image in item.image_urls"
								:key="image"
							>
								<i class="image_review">
									<lazyload
										tag="img"
										:src="image"
									></lazyload>
								</i>
							</li>
						</ul>
						<p class="text_info">
							{{ optionText(item.option_name) }}
						</p>
						<p class="text_review">
							<b v-html="newLineToBr(item.contents)"></b>
						</p>

						<review-template-satisfy
							v-if="(item.templates || []).length > 0"
							:templates="item.templates"
						></review-template-satisfy>

						<p class="text_date">
							{{ date(item.created_at, 'YYYY.MM.DD') }}
						</p>
					</div>
				</div>
			</template>
		</carousel>
	</div>
</template>

<script setup lang="ts">
	import { useFormatter } from '$/composables/useFormatter';
	import Carousel from '@/component/Carousel.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import ExperienceReviewTag from '@/feature/experience/component/ExperienceReviewTag.vue';
	import ReviewTemplateSatisfy from '@/feature/review-template/component/ReviewTemplateSatisfy.vue';
import { ref } from 'vue';

	withDefaults(defineProps<{
		reviews: (BestReviewDetail|PhotoReviewDetail)[],
	}>(), {
		reviews: () => [],
	});


	const emit = defineEmits<{
		'complete': [activeIndex: number, realIndex: number, isBack: boolean | undefined, $ui: HTMLElement];
	}>();


	const { newLineToBr, optionText, date } = useFormatter();

	const controlClass = 'S=control-on';
	const controlButtonClass = ref('');

	function reviewAutoHide(param: { activeIndex: number, realIndex: number, isBack?: boolean}, $ui: HTMLElement) {
		emit('complete', param.activeIndex, param.realIndex, param.isBack, $ui);
		controlButtonClass.value = controlClass;
		setTimeout(() => {
			controlButtonClass.value = '';
		}, 3000);
	}
</script>