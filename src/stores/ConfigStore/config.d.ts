export interface Config {
    version: string
}

export interface ConfigStoreContext {
    config: Config | null,
    setConfig: (config: Config) => void
}
