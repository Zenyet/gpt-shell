import {TerminalBox} from "./components/TerminalBox";
import {useEffect, useRef, useState} from "react";
import {SetupModal} from "./components/SetupModal.tsx";
import {useModal} from "./hooks/useModal.ts";

function App() {

    const [reply, setReply] = useState('');

    const apiUrl = 'https://ai.fakeopen.com/api/conversation';
    const fetchOptions = {
        method: 'POST',
        headers: {
            Accept: 'text/event-stream',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJyYW5kb21tYWlsMjAyM0Bwcm90b25tYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLXNUNm1NZXluZVdPUkMwT3RMaVpDMUxoaCJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiYXV0aDB8NjQ0MjA5OGI3MTNhZDRlNTgxZDI2ZmMwIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NDU3MTExMiwiZXhwIjoxNjg1NzgwNzEyLCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9yZ2FuaXphdGlvbi53cml0ZSJ9.XoeQIxdHCkib8aDJ9aPavox9p_CQsGqFs0mqlqJJUWxjDNrIiF9jMWGksKE0WJfptDrP3ni3qFkS5p0OgN6itJEVG9vbqyzN8wFc1FgoFMXi5gtkNlFMyXF-wU-or8gsogAk7k5Il1FH1HYF25UztEcxhyJqI1C5QSQ9OU6HyXrJ9LyufJkd9UeFTW6HoH-dIWvOrnEGjKt2afHqvY7hbAPJ2RDJlj6bEjz8W8ISvaJMsa9v2MVt9QEaSt-X2MUfVYsF6aK0iqsUVL_kBb_Y-en2Kxw-NCXVNaQQqFXBWH0esY6hV_mqGJzOFPTyYRdaw_6rJdYH6ujlCtfFhqUasA`,
        },
        body: JSON.stringify({
            "action": "next",
            "messages": [
                {
                    "id": "aaa29e76-3028-4f7b-b58c-220e2a29258c",
                    "author": {
                        "role": "user"
                    },
                    "content": {
                        "content_type": "text",
                        "parts": [
                            "你是谁？"
                        ]
                    }
                }
            ],
            "parent_message_id": "aaa1fbfb-5137-44f0-b434-355a02cbc2d2",
            "model": "text-davinci-002-render-sha-mobile",
        }),
    };

    const [bingUrl, setURL] = useState<string>('');

    useEffect(() => {
        fetch('https://thoughtflow.org/bing-wallpaper', {
            method: 'GET',
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            }
        }).then(resp => resp.json()).then(json => {
            const baseURL = "https://www.bing.com";
            const {images: [{url}]} = json;
            setURL(baseURL + url);
        })
    }, []);

    async function handleClick() {
        try {
            const {body} = await fetch(apiUrl, {...fetchOptions});
            const d = new TextDecoder('utf8');
            const reader = await body.getReader();
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            let fullText = ''

            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    console.log(fullText);
                    break;
                } else {
                    const decodedString = d.decode(value);
                    try {
                        //fixes string not json-parseable otherwise
                        // console.log(decodedString);
                        let splits: string[] = decodedString.split('data: ');
                        splits = splits.filter(_ => _ !== '');
                        // console.log(splits);
                        splits.forEach(_ => {
                            // const text: string = JSON.parse(_).choices[0].delta.content || '';
                            // fullText += text;
                            const rawText = JSON.parse(_)?.message?.content?.parts[0];
                            const text = decoder.decode(encoder.encode(rawText));
                            setReply(text);
                        })
                    } catch (e) {
                        // the last line is data: [DONE] which is not parseable either, so we catch that.
                        console.log('done');
                    }
                }
            }
        } catch (e) {
            console.log(e.message);
        }
        return null;
    }

    const [Provider, isOpen, openModal, closeModal] = useModal();

    const themeConfig = JSON.parse(localStorage.getItem('theme-config')) || {};

    const [opacity, setOP] = useState<string>(themeConfig.opacity || '50%');
    const [blur, setBlur] = useState<number>(themeConfig.blur || 0);
    const timer = useRef<{ timer1: number | null, timer2: number | null }>({
        timer1: null,
        timer2: null
    })

    const changeOpacity = (opacity: string) => {
        timer.current.timer1 && clearTimeout(timer.current.timer1);
        setOP(opacity);
        if (!timer.current.timer2) {
            timer.current.timer1 = setTimeout(() => {
                localStorage.setItem('theme-config', JSON.stringify({
                    opacity,
                    blur
                }))
            }, 300);
        }
    }

    const changeBlur = (blur: number) => {
        clearTimeout(timer.current.timer2);
        setBlur(blur);
        if (!timer.current.timer1) {
            timer.current.timer2 = setTimeout(() => {
                localStorage.setItem('theme-config', JSON.stringify({
                    opacity,
                    blur
                }))
            }, 300);
        }
    }


    return (
        <div style={{backgroundImage: `url(${bingUrl})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}
             className="flex items-center justify-center h-[100vh]">
            <Provider value={{openModal, closeModal}}>
                <TerminalBox opacity={opacity} blur={blur}/>
                <SetupModal isOpen={isOpen} defaultOpacity={parseInt(themeConfig.opacity)} defaultBlur={blur / 0.32}
                            changeBlur={changeBlur}
                            changeOpacity={changeOpacity}/>
            </Provider>
            {/*    <button onClick={() => handleClick()} className='bg-blue-500 px-1 py-0.5 rounded-md text-white'>test*/}
            {/*    </button>*/}
            {/*    <main>*/}
            {/*        {reply}*/}
            {/*    </main>*/}
        </div>
    )
}

export default App
