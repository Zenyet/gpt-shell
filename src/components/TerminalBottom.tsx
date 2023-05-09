import type {FormEvent, KeyboardEvent} from "react";
import TextareaAutosize from 'react-textarea-autosize';
import {debounce} from "../helpers";
import {OpenAIApi, Configuration} from "openai";
import {useEffect, useRef, useState} from "react";

type DialogProp = {
    'command': string
    'content': boolean
}

const commands: string[] = ["clear", "history", "exit", "help"];

export function TerminalBottom() {
    const [text, setText] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [histories, setHistories] = useState<DialogProp[]>([]);
    const [processing, setProc] = useState<boolean>(false);
    const [tokens, setTokens] = useState<string>('');
    const c_tRef = useRef<AbortController>(new AbortController());

    useEffect(() => {
        document.addEventListener('keydown', ev => {
            if (ev.ctrlKey && ev.key === 'c') {
                // console.log('test')
                c_tRef.current.abort();
                c_tRef.current = new AbortController();
                setProc(false);
            }
        });
        return () => {
            c_tRef.current.abort();
        }
    }, []);

    const configuration = new Configuration({
        apiKey: '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'
    })

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const fetchOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: "user", content: prompt}],
            temperature: 0.6,
            stream: true,
            //    stop: ['\n'],
        }),
    };

    function handleInput(e: FormEvent) {
        const t = e.target as HTMLInputElement;
        setPrompt(t.value);

        // const l: number = t.value.length;
        // let t_: string;
        // if (t.value) {
        //     t_ = commands.find(_ => _.startsWith(t.value));
        // }
        //
        // if (t_) {
        //     // console.log(t_.slice(l));
        //     setTail(t_.slice(l));
        // }
    }

    async function handlePress(e: KeyboardEvent) {
        if (!e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            // const t = e.target as HTMLInputElement;
            switch (prompt) {
                case "help":
                    break;
                case "history":
                    break;
                case "exit":
                    break;
                case 'clear':
                    setHistories([]);
                    break;
                case '':
                    console.log('null')
                    setHistories([...histories, {command: `root@sh# ~ ${prompt}`, content: false}]);
                    break;
                default:
                    setHistories([...histories, {command: `${prompt}`, content: true}]);
                    setProc(true);
                    try {
                        const {body} = await fetch(apiUrl, {...fetchOptions, signal: c_tRef.current.signal});
                        const d = new TextDecoder('utf8');
                        const reader = await body.getReader();
                        let fullText = ''

                        while (true) {
                            const {value, done} = await reader.read();
                            if (done) {
                                setTokens(fullText);
                                setProc(false);
                                break;
                            } else {
                                const decodedString = d.decode(value);
                                try {
                                    //fixes string not json-parseable otherwise
                                    let splits: string[] = decodedString.split('data: ');
                                    splits = splits.filter(_ => _ !== '');
                                    splits.forEach(_ => {
                                        const text: string = JSON.parse(_).choices[0].delta.content || '';
                                        fullText += text;
                                        setTokens(fullText);
                                    })
                                } catch (e) {
                                    // the last line is data: [DONE] which is not parseable either, so we catch that.
                                    console.log('done');
                                }
                            }
                        }
                    } catch (err) {
                        console.log(err.message);
                    }
                    // fetch(apiUrl, fetchOptions).then(async (response) => {
                    //     const r = response.body;
                    //     if (!r) throw new Error('No response body');
                    //
                    //     const d = new TextDecoder('utf8');
                    //     const reader = await r.getReader();
                    //     let fullText = ''
                    //
                    //     while (true) {
                    //         const {value, done} = await reader.read();
                    //         if (done) {
                    //             setTokens(fullText);
                    //             setProc(false);
                    //             break;
                    //         } else {
                    //             const decodedString = d.decode(value);
                    //             try {
                    //                 //fixes string not json-parseable otherwise
                    //                 let splits: string[] = decodedString.split('data: ');
                    //                 splits = splits.filter(_ => _ !== '');
                    //                 splits.forEach(_ => {
                    //                     const text: string = JSON.parse(_).choices[0].delta.content || '';
                    //                     fullText += text;
                    //                     setTokens(fullText);
                    //                 })
                    //             } catch (e) {
                    //                 // the last line is data: [DONE] which is not parseable either, so we catch that.
                    //                 console.log('done');
                    //             }
                    //         }
                    //     }
                    // });
                    break;
            }
            setPrompt('');
        }
    }

    return (
        <div className='ml-2 text-white mr-2 h-[calc(100%-1.8rem)] overflow-auto rm-sc'>
            <div className='mt-0.5'>
                Last Login: Sun May 7 23:19:46 on Chrome
            </div>
            <div className='flex items-start flex-col'>
                {histories.map((_, i) => {
                    return <div key={_.command + i}>
                        <p>root@sh# ~<span style={{display: 'inline-block', marginLeft: '0.5rem'}}>{_.command}</span>
                        </p>
                        <main dangerouslySetInnerHTML={{__html: _.content ? tokens : ''}}></main>
                    </div>
                })}
                {
                    !processing && <p className='flex items-start w-[100%]'>
                        <span className=''>root@sh# ~</span>
                        <TextareaAutosize value={prompt} onInput={handleInput} onKeyDown={handlePress} autoFocus
                                          className='flex-1 ml-2 caret-w-2  resize-none focus:outline-none bg-transparent'>
                        </TextareaAutosize>
                    </p>
                }
            </div>
        </div>
    );
}