import { Component, ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { uuid } from '$/utils/string';

export const useLayerContextStore = defineStore('layer-context', () => {
	const layerContexts = ref<Layer[]>([]);

	/**
     * 레이어 여는 함수
     * @param component
     * @param options
    */
	const open = async <Props extends object, LayerCloseContext extends object | string | undefined>(
		component: Component,
		type: 'modal' | 'overlay',
		options?: LayerOpenOptions<Props, LayerCloseContext>
	) => {
		if (typeof options?.props === 'function') options.props = await options.props();

		addLayer({
			uuid: uuid(),
			type: type,
			props: options?.props || {},
			component: shallowRef(component),
			isActive: true,
			onClose: options?.onClose,
		});
	};

	const addLayer = (target: Layer) => {
		// 이전 모달 비활성화 처리
		const legacyLayer = layerContexts.value.find(_layer => _layer.isActive && _layer.type === target.type);
		if (legacyLayer) legacyLayer.isActive = false;

		const sameLayer = layerContexts.value.find(_layer => _layer.uuid === target.uuid && _layer.type === target.type);
		// 동일한 모달인 경우 현재꺼 제외 처리 후 재할당
		if (sameLayer) {
			layerContexts.value = layerContexts.value.filter(_layer => _layer.uuid !== target.uuid);

			// BUG nextTick 대체 필요 - 없이 바로 적용? watch? onMounted?
			nextTick().then(() => {
				layerContexts.value = layerContexts.value.concat(target);
			});
		}
		else layerContexts.value = layerContexts.value.concat(target);
	};

	return {
		layerContexts,
		removeLayer: (targetUniqueId: string) => {
			layerContexts.value = layerContexts.value.filter((layer) => layer.uuid !== targetUniqueId);
		},
		openOverlay: <Props extends object, LayerCloseContext extends object | string | undefined>(
			component: Component,
			options?: LayerOpenOptions<Props, LayerCloseContext>
		) => open(component, 'overlay', options),
		openModal: <Props extends object, LayerCloseContext extends object | string | undefined>(
			component: Component,
			options?: LayerOpenOptions<Props, LayerCloseContext>
		) => open(component, 'modal', options),
	};
}, {
	persist: false,
});
