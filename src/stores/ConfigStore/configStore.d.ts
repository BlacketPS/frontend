import { Config } from "@blacket/types";

export interface ConfigStore {
    config: Config | null;
    setConfig: (config: Config) => void;
    loading: boolean;
    error: string | boolean;
    fetchConfig: () => void;
}
