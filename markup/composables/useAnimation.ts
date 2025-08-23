import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/all';

export const useAnimation = () => {
	return {
		set: (target: AnimationTarget, options?: AnimationOption) => {
			gsap.set(
				target,
				options ? options : {}
			);
		},
		to: (target: AnimationTarget, options?: AnimationOption) => {
			if (options?.scrollTo != null) gsap.registerPlugin(ScrollToPlugin);

			const tween = gsap.to(
				target,
				options ? options : {}
			);

			return () => {
				tween.kill();
			};
		},
		fromTo: (target: AnimationTarget, fromOptions?: AnimationOption, toOptions?: AnimationOption) => {
			if (toOptions?.scrollTo != null) gsap.registerPlugin(ScrollToPlugin);

			const tween = gsap.fromTo(
				target,
				fromOptions ? fromOptions : {},
				toOptions ? toOptions : {}
			);

			return () => {
				tween.kill();
			};
		},
		kill: (target: AnimationTarget) => {
			gsap.killTweensOf(target);
		},
		isAnimated: (target: AnimationTarget): boolean => gsap.isTweening(target),
		timeLine: (options?: gsap.TimelineVars): gsap.core.Timeline => gsap.timeline(options),
	};
};