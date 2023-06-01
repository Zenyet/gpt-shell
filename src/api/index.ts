interface Message {
    role: string
    content: string
}

const Completions_URL: string = import.meta.env.VITE_COMPLETIONS_PROXY;

export async function Completions(messages: Message[], signal: AbortSignal | null): Promise<Response> {
    console.log(Completions_URL);
    const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
            'test': 'test'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            temperature: 0.6,
            stream: true,
        }),
        signal
    }
    return fetch(Completions_URL, fetchOptions);
}

export function Chat() {

}