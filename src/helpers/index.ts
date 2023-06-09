type DebounceFn<T extends unknown[]> = (...args: T) => void;

export function debounce<T extends any[]>(func: DebounceFn<T>, wait: number, immediate?: boolean): DebounceFn<T> {
    let timeout: ReturnType<typeof setTimeout> | null;
    return function (...args: T) {
        const context = this;
        clearTimeout(timeout as number);
        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    }
}


export function dateF(date: Date): string {
    const year = date.getFullYear();
    let month: number | string = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day: number | string = date.getDate();
    day = day < 10 ? '0' + day : day;
    let hours: number | string = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes: number | string = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let seconds: number | string = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

export function genL_L(date: Date): string {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = weekdays[date.getDay()];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `Last login: ${dayOfWeek} ${month} ${day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} on Chrome`;
}


export async function parse(
    body: ReadableStream<Uint8Array>,
    onParse: (piece: string) => void,
    onDone: (fullText: string, reply?: { message_id: string, conversation_id: string }) => void,
    mode?: string
) {
    const d = new TextDecoder('utf8');
    const e = new TextEncoder();
    const reader = await body.getReader();
    let fullText = '';
    let message_id = '';
    let conversation_id = '';
    while (true) {
        const {value, done} = await reader.read();
        if (done) { // stream end
            onDone(fullText, {message_id, conversation_id});
            break;
        } else {
            const decodedString = d.decode(value);
            try {
                if (mode === 'api') {
                    //fixes string not json-parseable otherwise
                    let splits: string[] = decodedString.split('data: ');
                    splits = splits.filter(_ => _ !== '');
                    splits.forEach(_ => {
                        const text: string = JSON.parse(_).choices[0].delta?.content || '';
                        fullText += text;
                        onParse(fullText);
                    })
                } else if (mode === 'chatgpt-reverse') {
                    //fixes string not json-parseable otherwise
                    let splits: string[] = decodedString.split('data:');
                    splits = splits.filter(_ => _ !== '');
                    splits.forEach(_ => {
                        const o = JSON.parse(_);
                        const rawText = o?.message?.content?.parts[0];
                        if (!message_id || !conversation_id) {
                            message_id = o?.message?.id;
                            conversation_id = o?.conversation_id;
                        }
                        const text = d.decode(e.encode(rawText));
                        fullText = text;
                        onParse(text);
                    })
                }
            } catch { /* empty */
            }
        }
    }
}