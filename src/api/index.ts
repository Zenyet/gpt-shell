import {APIConfig, ChatConfig} from "../types";

interface Message {
    role: string
    content: string
}

const Completions_URL: string = import.meta.env.VITE_COMPLETIONS_PROXY;

export async function Completions(
    messages: Message[],
    signal: AbortSignal | null,
    apiConfig: APIConfig
): Promise<Response> {
    const {model, temperature, max_tokens, useProxy, proxyAddress, apiKey} = apiConfig;
    const apiURL = useProxy ? proxyAddress + '/v1/chat/completions' : Completions_URL;
    const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'test': 'test'
        },
        body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens,
            stream: true,
        }),
        signal
    }
    return fetch(apiURL, fetchOptions);
}

export async function Chat(
    messages: [{
        id: string,
        author: {
            role: 'user'
        },
        content: {
            content_type: 'text',
            parts: string[]
        }
    }],
    parent_message_id: string,
    signal: AbortSignal | null,
    chatConfig: ChatConfig,
    conversation_id?: string
): Promise<Response> {
    const {model, useProxy, access_token, proxyAddress} = chatConfig;
    const apiURL = useProxy ? proxyAddress : 'https://ai.fakeopen.com/api/conversation';
    const a_t = access_token || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJyYW5kb21tYWlsMjAyM0Bwcm90b25tYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLXNUNm1NZXluZVdPUkMwT3RMaVpDMUxoaCJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiYXV0aDB8NjQ0MjA5OGI3MTNhZDRlNTgxZDI2ZmMwIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NjIxNjY4MiwiZXhwIjoxNjg3NDI2MjgyLCJhenAiOiJwZGxMSVgyWTcyTUlsMnJoTGhURTlWVjliTjkwNWtCaCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0.oRYAuQcrujuGWi3fYTVLNB_B-VbERj76_wYJKEy5JebUAC77FSLYir94v_XhIzyHOPKq66OfvWIVQuESej6HY31qLyo8KOHgPnT3Q-9VKiTucHOsaqRvoH4_3gJLR4OXhgrApDlEZe95mNI3uK08MdwiJPy_jwp52IwB45-XRiU7tcObZqUFf_liUSXD5JJfKkEqvaXYxGUzqL2sKhCZoLSmt63xMxa5IQxeTMmKZIHkwpVnaxzgfrycHKN0ld576KTcZUEKXMqnT21qcPtJ2LjXI7ZXgo2kQ2er0SaT7S4ce7Oj5CTzybyXPsRlPuNsXi9kDzM3mDLDTjvTQI5R0A';
    const o = {
        "action": "next",
        messages,
        parent_message_id,
        model,
        "timezone_offset_min": -480,
        "history_and_training_disabled": false
    }

    if (conversation_id) {
        o['conversation_id'] = conversation_id;
    }

    const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${a_t}`
        },
        body: JSON.stringify(o),
        signal
    }
    return fetch(apiURL, fetchOptions);
}