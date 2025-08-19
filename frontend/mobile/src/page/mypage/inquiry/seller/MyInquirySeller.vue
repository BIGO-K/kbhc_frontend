<template>
	<p
		v-if="paginator.total < 1"
		class="mm_text-none"
	>
		<i class="ico_text-none"></i>문의 내역이 없습니다
	</p>

	<template v-else>
		<div class="mm_qna m_myinquiry">
			<ul>
				<li
					v-for="qna in paginator.data"
					:key="qna.id"
				>
					<dropdown
						tag="dl"
						group="my-inquiry"
					>
						<div
							v-if="qna.top_goods"
							class="mm_product-item T=single-sm"
						>
							<figure>
								<div class="mm_product-item-image">
									<lazyload
										class="mm_bg-cover image_product"
										:src="qna.top_goods.thumbnail_url"
									></lazyload>
								</div>
								<figcaption>
									<p class="text_brand">
										{{ qna.top_goods.brand_name }}
									</p>
									<p class="text_product">
										{{ qna.top_goods.name }}
									</p>
									<span v-if="qna.goods_count > 1">외 <strong>{{ qna.goods_count - 1 }}</strong>건</span>
									<!-- (D) 판매자 문의건에만 상품 옵션(.text_option)을 노출합니다 -->
									<p
										v-if="qna.top_goods.option_name"
										class="text_option"
									>
										{{ optionText(qna.top_goods.option_name) }}
									</p>
								</figcaption>
							</figure>
						</div>
						<template #button>
							<strong
								:class="['text_state', { 'mm_text-variable': qna.answer }]"
							>{{ qna.answer ? '답변완료' : '답변대기' }}</strong>
							<p>
								<span class="text_title">{{ qna.title }}</span>
								<span class="text_date">{{ date(qna.created_at, 'YYYY.MM.DD') }}</span>
								<!-- (D) 비밀글일 때 ico_secret을 노출합니다 -->
								<i
									v-if="qna.is_private"
									class="ico_secret"
								></i>
							</p>
						</template>
						<template #content>
							<div class="mm_qna-qustion">
								<p v-html="newLineToBr(qna.contents)"></p>
								<div
									v-if="!qna.answer"
									class="mm_btn_box"
								>
									<div class="mm_inline">
										<button
											type="button"
											class="btn_remove"
											@click="remove(qna.id)"
										>
											<i class="ico_delete"></i>
											<b>삭제</b>
										</button>
										<button
											type="button"
											class="btn_modify"
											href="#"
											@click.prevent="_e => overlayMyInquirySellerUpdate(_e, qna.id)"
										>
											<i class="ico_modify"></i>
											<b>수정</b>
										</button>
									</div>
								</div>
							</div>
							<div
								v-if="qna.answer"
								class="mm_qna-answer"
							>
								<p v-html="newLineToBr(qna.answer.contents)"></p>
								<span class="text_date">답변일: {{ date(qna.answer.created_at, 'YYYY.MM.DD') }}</span>
							</div>
						</template>
					</dropdown>
				</li>
			</ul>
		</div>

		<pagination
			v-bind="{
				currentPage: paginator.current_page,
				itemsPerPage: paginator.per_page,
				totalCount: paginator.total
			}"
			@move:page="fetch"
		></pagination>
	</template>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, ref } from 'vue';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useFormatter } from '$/composables/useFormatter';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import { useInquiry } from '$/composables/useInquiry';
	import Dropdown from '@/component/Dropdown.vue';
	import Lazyload from '@/component/Lazyload.vue';
	import Pagination from '@/component/Pagination.vue';

	const { newLineToBr, date, optionText } = useFormatter();
	const { bom, loading, route, openOverlay } = useGlobalPageContext();
	const { getSellerQnaPaginator, destroySellerQna } = useInquiry();

	const paginator = ref<Paginator<SellerQna>>({
		total: 0,
		current_page: 1,
		per_page: 20,
		data: [],
	});

	await fetch(route.query.page ? Number(route.query.page) : 1);

	/** [판매자 문의] 조회 */
	async function fetch(pageNumber: number = 1) {
		try {
			paginator.value = await getSellerQnaPaginator(pageNumber);
		}
		catch (e) {
			useErrorAlert(e);
		}
	}

	/** [판매자 문의] 삭제 */
	async function remove(id: number) {
		bom.confirm('판매자 문의를 삭제하시겠습니까?', async (flag) => {
			if (!flag) {
				return;
			}

			loading.show();
			try {
				await destroySellerQna(id);
				bom.alert('판매자 문의가 삭제되었습니다.', async () => {
					await fetch(paginator.value?.current_page);
				});
			}
			catch (e) {
				useErrorAlert(e);
			}
			finally {
				loading.hide();
			}
		});
	}

	const overlayMyInquirySellerUpdate = (_e: MouseEvent, id: number) => {
		openOverlay(defineAsyncComponent(() => import('@/page/mypage/inquiry/seller/update/MyInquirySellerUpdate.vue')), {
			props: { id },
			clickElement: _e.currentTarget,
			onClose: () => fetch(paginator.value.current_page),
		});
	};
</script>