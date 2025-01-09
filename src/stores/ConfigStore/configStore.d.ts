export interface Config {
    version: string
    type: string
}

export interface ConfigStoreContext {
    config: Config | null,
    setConfig: (config: Config) => void
}
