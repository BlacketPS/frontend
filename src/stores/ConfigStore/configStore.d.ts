import { Config } from "@blacket/types";

export interface ConfigStoreContext {
    config: Config | null,
    setConfig: (config: Config) => void
}
