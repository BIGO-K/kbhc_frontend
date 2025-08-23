import { Component, ref, shallowRef, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { uuid } from '$/utils/string';

export const useLayerContextStore = defineStore('layer-context', () => {
	const layerContexts = ref<Layer[]>([]);
	const removedOverlayContext = ref<Nullable<Layer>>(null);

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
			props: options?.props ?? {},
			clickElement: options?.clickElement ?? null,
			component: shallowRef(component),
			isActive: true,
			onClose: options?.onClose,
			onCancelClose: options?.onCancelClose,
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

			nextTick().then(() => {
				layerContexts.value = layerContexts.value.concat(target);
			});
		}
		else layerContexts.value = layerContexts.value.concat(target);
	};

	return {
		layerContexts,
		removedOverlayContext,
		removeLayer: (targetUniqueId: string) => {
			layerContexts.value = layerContexts.value.filter(_layer => {
				const isRemoveLayer = _layer.uuid === targetUniqueId;
				if (isRemoveLayer) {
					// modal
					if (_layer.type === 'modal') (_layer.clickElement as Nullable<HTMLElement>)?.focus();// (접근성) 닫으면 이전 포커스로 이동
					// overlay
					else removedOverlayContext.value = _layer;// transition 때문에 app에서 처리
				}

				return !isRemoveLayer;
			});
		},
		openOverlay: <Props extends object, LayerCloseContext extends object | string | undefined>(
			component: Component,
			options?: LayerOpenOptions<Props, LayerCloseContext>
		) => open(component, 'overlay', options),
		openModal: <Props extends object, LayerCloseContext extends object | string | undefined>(
			component: Component,
			options?: LayerOpenOptions<Props, LayerCloseContext>
		) => open(component, 'modal', options),
		clearLayer: () => {
			layerContexts.value = [];
		},
	};
}, {
	persist: false,
});
