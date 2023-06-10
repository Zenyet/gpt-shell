export type ChatConfig = {
    model: string,
    proxyAddress: string,
    useProxy: boolean,
    access_token?: string
    keep_session?: boolean
}

export type APIConfig = {
    model?: string
    max_tokens?: number
    temperature?: number
    history?: number
    useProxy?: boolean
    apiKey?: string
    proxyAddress?: string
}

export type Config = {
    mode: string,
    api: APIConfig,
    'chatgpt-reverse': ChatConfig
}

export type Operation = {
    updateMode: (mode: string) => void,
    updateAPIConfig: (config: APIConfig) => void,
    updateChatConfig: (config: ChatConfig) => void
}