import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '$/stores/useAuthStore';
import { useLayerContextStore } from '$/stores/useLayerContextStore';
import mons from '$/utils/mons';

/** 페이지내 전역적으로 사용되는 항목들 */
export const useGlobalPageContext = () => {
	const member = computed(() => useAuthStore().member);
	const isMember = computed(() => member.value != null);
	// 라우트
	const route = useRoute();
	const router = useRouter();
	// 레이어 모달 composable
	const { bom, loading } = mons();
	const { openOverlay, openModal } = useLayerContextStore();

	return {
		member,
		isMember,
		route,
		router,
		bom,
		loading,
		openOverlay,
		openModal,
	};
};