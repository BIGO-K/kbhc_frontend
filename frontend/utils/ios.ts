declare global {
	interface Window {
		webkit?: {
			messageHandlers: {
				ios: {
					postMessage: (...args: unknown[]) => void;
				};
			};
		};
	}
}

const ios = {
    // iOS 네이티브 함수 호출
	run: (...args: unknown[]) => {
		window.webkit?.messageHandlers.ios.postMessage({
			function: args[0],
			arguments: Array.prototype.slice.call(args, 1),
		});
	},
};

export default ios;