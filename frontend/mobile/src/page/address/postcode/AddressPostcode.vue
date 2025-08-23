<template>
	<div class="mm_inner m_postcode">
		<form-text
			v-model="keyword"
			type="search"
			placeholder="도로명 또는 지번을 입력하세요"
			@keyup.enter="search"
		>
			<template #button>
				<button
					type="button"
					class="btn_search"
					@click="search"
				>
					<i class="ico_search T=lg"></i><b class="mm_ir-blind">검색하기</b>
				</button>
			</template>
		</form-text>
		<div
			v-if="!paginator"
			class="m_postcode-guide"
		>
			<dl>
				<dt><strong>TIP</strong>도로명, 건물명, 지번 중 선택하여<br>입력하세요</dt>
				<dd>도로명 + 건물번호<strong>예) 테헤란로 152</strong></dd>
				<dd>동/읍/면/리 + 번지<strong>예) 역삼동 737</strong></dd>
				<dd>건물명, 아파트명<strong>예) 삼성동 힐스테이트</strong></dd>
			</dl>
			<section>
				<h5 class="m_postcode-title">
					<b>예) ‘삼성동 힐스테이트’ 검색결과</b>
				</h5>
				<div class="m_postcode-item">
					<dl>
						<dt>도로명</dt>
						<dd>서울특별시 강남구 테헤란로 152 강남파이낸스센터</dd>
					</dl>
					<dl>
						<dt>지번</dt>
						<dd>서울특별시 강남구 역삼1동 737</dd>
					</dl>
					<strong class="text_postcode">06236</strong>
				</div>
			</section>
		</div>
		<template v-else>
			<!-- 우편번호 검색결과 -->
			<h5 class="m_postcode-title-result">
				<b>주소 검색결과 총 <strong>{{ paginator.total }}</strong>건</b>
			</h5>
			<p
				v-if="paginator.total < 1"
				class="mm_text-none T=sm"
			>
				<i class="ico_text-none"></i>검색 결과가 없습니다
			</p>

			<template v-else>
				<div class="m_postcode-list">
					<ul>
						<li
							v-for="item in paginator.data"
							:key="item.road_address"
						>
							<a @click.prevent="closer(item)">
								<div class="m_postcode-item">
									<dl>
										<dt>도로명</dt>
										<dd>{{ item.road_address }}</dd>
									</dl>
									<dl>
										<dt>지번</dt>
										<dd>{{ item.jibun_address }}</dd>
									</dl>
									<strong class="text_postcode">{{ item.zip_code }}</strong>
								</div>
							</a>
						</li>
					</ul>
				</div>

				<pagination
					:current-page="paginator.current_page"
					:items-per-page="paginator.per_page"
					:total-count="Number(paginator.total)"
					:replace-route="false"
					@move:page="fetch"
				></pagination>
			</template>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useAddress } from '$/composables/useAddress';
	import { useErrorAlert } from '$/composables/useErrorAlert';
	import { useGlobalPageContext } from '$/composables/useGlobalPageContext';
	import Pagination from '@/component/Pagination.vue';
	import FormText from '@/component/form/FormText.vue';

	defineProps<{
		/** @prop { 'none' } - layout 컴포넌트 사용 시 overlay 적용을 위해 'none' 타입 적용 필요 */
		layout: 'none';
		/** @prop { T } - LayoutOverlay의 closer 함수 */
		closer: <T>(context?: T) => void;
	}>();

	defineExpose<OverlayComponentExpose>({
		title: `우편번호 검색`,
	});

	const { loading, bom } = useGlobalPageContext();
	const { getAddressPaginator } = useAddress();

	const keyword = ref<string>('');
	const paginator = ref<Paginator<SearchAddress>>();

	async function fetch(page: number = 1) {
		loading.show();
		try {
			paginator.value = await getAddressPaginator(keyword.value, page);
		}
		catch (error) {
			useErrorAlert(error);
		}
		finally {
			loading.hide();
		}
	}

	function search() {
		if (keyword.value == '') {
			return bom.alert('검색어를 입력해주세요.');
		}

		if (keyword.value.length < 2) {
			return bom.alert('검색어는 2자 이상 입력해주세요.');
		}

		fetch();
	}
</script>