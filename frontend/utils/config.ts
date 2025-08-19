import { useSetupConfigStore } from '$/stores/useSetupConfigStore';

const config = <Path extends string | undefined = undefined>(
	key?: Path,
	defaultValue?: Path extends string
		? ValueOf<SetupConfig, Split<Path>>
		: undefined
): ConfigValue<Path> => useSetupConfigStore().config(key, defaultValue);

export default config;