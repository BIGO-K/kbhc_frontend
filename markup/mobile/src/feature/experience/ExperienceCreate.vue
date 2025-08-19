<template>
	<div class="m_review-write m_experience-write">
		<div class="m_review-write-product">
			<div class="mm_product-select">
				<form-select v-model="selectProduct">
					<option>상품을 선택하세요</option>
				</form-select>

				<!-- 선택된 상품 -->
				<div class="mm_scroller">
					<div class="mm_product-list T=xs">
						<ul>
							<li>
								<div class="mm_product-item">
									<a>
										<figure>
											<div class="mm_product-item-image">
												<lazyload
													class="mm_bg-cover image_product"
													src="/image/_sample/prod_x1_2.png"
												></lazyload>
											</div>
											<figcaption>
												<p class="text_product">시스루스트라이프셔츠</p>
												<p class="text_option">화이트 FREE</p>
											</figcaption>
										</figure>
									</a>
									<button
										type="button"
										class="btn_remove"
									>
										<i class="ico_remove T=sm"></i><b class="mm_ir-blind">삭제하기</b>
									</button>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- 별점 -->
		<section>
			<h6><b>상품은 만족하셨나요?</b></h6>
			<!--
				(D) 별점이 선택된 상태일 때는 m_experience-starscore 태그에 'S=starscore-choice' 클래스가 추가됩니다.
				선택된 별점의 li에 'S=starscore-on' 클래스와 button에 '선택됨' 타이틀이 추가되며, input hidden의 value값에 점수가 입력됩니다. (0 선택안됨)
			-->
			<div class="m_review-write-starscore S=starscore-choice">
				<ul>
					<li class="S=starscore-on">
						<button
							type="button"
							title="선택됨"
						>
							<i class="ico_star-fill"></i><b class="mm_ir-blind">5점 만점에 1점</b>
						</button>
					</li>
					<li class="S=starscore-on">
						<button
							type="button"
							title="선택됨"
						>
							<i class="ico_star-fill"></i><b class="mm_ir-blind">5점 만점에 2점</b>
						</button>
					</li>
					<li class="S=starscore-on">
						<button
							type="button"
							title="선택됨"
						>
							<i class="ico_star-fill"></i><b class="mm_ir-blind">5점 만점에 3점</b>
						</button>
					</li>
					<li>
						<button type="button">
							<i class="ico_star-fill"></i><b class="mm_ir-blind">5점 만점에 4점</b>
						</button>
					</li>
					<li>
						<button type="button">
							<i class="ico_star-fill"></i><b class="mm_ir-blind">5점 만점에 5점</b>
						</button>
					</li>
				</ul>
				<input
					type="hidden"
					value="3"
				>
			</div>
		</section>

		<review-template-satisfy-setting></review-template-satisfy-setting>

		<div class="mm_inner">
			<review-template-body></review-template-body>

			<h6 class="mm_text-label">
				<b>체험단 후기 제목</b>
			</h6>
			<form-text
				maxlength="40"
				placeholder="띄어쓰기 포함 최대 40자까지 입력 가능합니다."
			></form-text>
			<h6 class="mm_text-label">
				<b>리뷰 내용</b>
			</h6>
			<form-textarea
				model-value=""
				:byte="2000"
				placeholder="최소 10자 이상 입력하세요"
			></form-textarea>
			<div class="mm_form-multiple">
				<ul class="mm_flex">
					<li>
						<div class="mm_form-image">
							<button
								type="button"
								class="btn_remove-file"
							>
								<i class="ico_remove T=sm"></i><b class="mm_ir-blind">파일삭제</b>
							</button>
							<div class="mm_form-image-preview"></div>
							<label>
								<input
									type="file"
									accept="image/*"
									data-file="{ '_imageSize': 'cover' }"
								>
								<b class="mm_form-image-box"><i class="ico_upload"></i><span class="mm_ir-blind">사진 첨부하기</span></b>
							</label>
						</div>
					</li>
				</ul>
				<label class="mm_btn T=support btn_select-multiple">
					<input
						type="file"
						accept="image/*"
						data-multiple="{ '_max': 10, '_isMax': true, '_isAuto': false }"
						multiple
					>
					<b>한번에 여러장 선택하기</b>
				</label>
			</div>
			<div class="mm_note T=bg">
				<ul>
					<li>사진은 jpg, png 파일로 10개까지 업로드 가능합니다.</li>
					<li>첫번째 등록한 사진이 리뷰 대표 이미지로 설정됩니다.</li>
					<li>입력하신 리뷰 위에 등록한 이미지가 노출됩니다.</li>
					<li>동일한 문자 또는 자음/모음은 4회 이상 연속 입력할 수 없습니다.</li>
					<li>소중한 고객님의 개인 정보 보호를 위해 주민번호, 전화번호 등 개 인 정보는 절대 입력하지 않도록 주의해주세요.</li>
					<li>저작권 침해/음란/욕설/비방 글, 개인 정보 유출(전화번호, 주민 번호, 이름, 아이디 등), 판매/광고/홍보성 글을 등록한 경우 임의 로 삭제될 수 있습니다.</li>
				</ul>
			</div>
			<div class="mm_foot">
				<div class="mm_btn_box">
					<button
						type="button"
						class="mm_btn T=primary"
					>
						<b>등록하기</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import Lazyload from '@/component/Lazyload.vue';
	import FormSelect from '@/component/form/FormSelect.vue';
	import FormText from '@/component/form/FormText.vue';
	import FormTextarea from '@/component/form/FormTextarea.vue';
	import ReviewTemplateBody from '@/feature/review-template/component/ReviewTemplateBody.vue';
	import ReviewTemplateSatisfySetting from '@/feature/review-template/component/ReviewTemplateSatisfySetting.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	const selectProduct = ref('');

	defineExpose<OverlayComponentExpose>({
		title: `체험단 후기 쓰기`,
	});
</script>

<style src="./_experience.scss" lang="scss"></style>