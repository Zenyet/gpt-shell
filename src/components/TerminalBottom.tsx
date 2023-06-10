import type {FormEvent, KeyboardEvent, ReactElement} from "react";
import TextareaAutosize from 'react-textarea-autosize';
// import {debounce} from "../helpers";
// import {OpenAIApi, Configuration} from "openai";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {dateF, genL_L, parse} from "../helpers";
import {Chat, Completions} from "../api";
import {GlobalContext} from "../context";
import {v4 as uuidv4} from 'uuid';
import {useAtom} from "jotai";
import {configAtom} from "../state";
import {Markdown} from "./Markdown.tsx";

interface APIHistory {
    ts: number
    user: {
        command: string
        role: string
    }
    assistant?: {
        replies: string | ReactElement
        role: string
    },
    isLast?: boolean,
    d?: string,
    error?: boolean
}

interface ChatHistory extends APIHistory {
    id: string
    conversation_id?: string
    parent_message_id: string
}

const commands: string[] = ["clear", "history", "exit", "help", "./setup"];

const HelpCommand = () => {
    return <ul>
        <span>Welcome to gpt-shell 🐚 ! Try some of the commands below.</span>
        <li className="ml-3 mt-2"><span className='text-red-400'>./setup</span> - Setup
        </li>
        <li className="ml-3"><span className='text-red-400'>clear / ctrl + l(L)</span> - Clear the
            screen
        </li>
        <li className="ml-3"><span className='text-red-400'>history</span> - Show all
            history
        </li>
        <li className="ml-3"><span
            className='text-red-400'>{'history | grep <yyyy-MM-dd>'}</span> - Filter history
        </li>
        <li className="ml-3"><span className='text-red-400'>exit</span> - Fake exit...</li>
        <li className="ml-3">press <span className='text-red-400'>tab</span> - Auto complete
        </li>
        <li className="ml-3">press <span className='text-red-400'>ctrl + c</span> - Abort
            request
        </li>
        <li className="ml-3 mb-2.5">press <span
            className='text-red-400'>up arrow</span> / <span className='text-red-400'>down arrow</span> -
            Select history commands
        </li>
    </ul>
}

export function TerminalBottom({mode}: { mode: string }) {
    const {openModal} = useContext(GlobalContext);
    const [sug, setSug] = useState<string>('');
    const [l_l, setL_L] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [histories, setHistories] = useState<APIHistory[] | ChatHistory[]>([]);
    const [processing, setProc] = useState<boolean>(false);
    const [tokens, setTokens] = useState<string>('');
    const tokensRef = useRef<string>('');
    const c_tRef = useRef<AbortController>(new AbortController());
    const [isReq, setReq] = useState<boolean>(false);
    const t_a_ref = useRef<HTMLTextAreaElement>(null);
    const con_ref = useRef<HTMLDivElement>(null);
    const cmdMapsRef = useRef<{
        maps: string[],
        idx: number
    }>(null);

    if (!cmdMapsRef.current) {
        cmdMapsRef.current = {
            maps: [],
            idx: histories.length || 0
        }
    }

    const [config] = useAtom(configAtom);

    useEffect(() => {
        setL_L(localStorage.getItem('l_l') || 'Last login: Sun May 7 23:19:46 on Chrome');
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            // mark last login :)
            localStorage.setItem('l_l', genL_L(new Date()));
        };

        // 添加 beforeunload 事件监听器
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            c_tRef.current.abort();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);

    useEffect(() => {
        if (con_ref.current) {
            con_ref.current.scrollTop = con_ref.current.scrollHeight;
        }
    }, [histories]);

    useEffect(() => {
        cmdMapsRef.current.idx = cmdMapsRef.current.maps.length;
    }, [cmdMapsRef.current.maps.length]);

    function handleInput(e: FormEvent) {
        const t = e.target as HTMLInputElement;

        // auto suggestion

        let f_v: string;

        if (t.value.length < 24) {
            f_v = commands.find(_ => _.startsWith(t.value));
        }

        if (f_v && t.value && t.value.length < 24) {
            setSug(f_v);
        } else {
            setSug('');
        }

        setPrompt(t.value);
    }

    const handlePress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>, prompt: string) => {
        /**
         * !isReq && !processing 防止在 Enter 后有意无意的继续 Enter 导致的 State 和 请求问题
         */
        const {isComposing} = e.nativeEvent;
        if (!isReq && !processing && !e.shiftKey && !isComposing && e.key === 'Enter') {
            e.preventDefault();
            cmdMapsRef.current.maps.push(prompt);
            if (prompt.startsWith('history')) {
                setSug('');
                const splits = prompt.split('|');
                let his: APIHistory[] | ChatHistory[];
                if (mode === 'api') {
                    his = JSON.parse(localStorage.getItem('api-store')) || [];
                } else if (mode === 'chatgpt-reverse') {
                    his = JSON.parse(localStorage.getItem('chat-store')) || [];
                }
                if (splits[1]) {
                    const filter_date = splits[1].split('grep')[1]?.trim();
                    const copy = his.filter(_ => _.d.split(' ')[0] === filter_date);
                    setHistories([{
                        user: {
                            role: 'user',
                            command: 'history | grep ' + filter_date
                        },
                        assistant: {
                            role: 'assistant',
                            replies: ''
                        },
                        isLast: false,
                        ts: +new Date()
                    }, ...copy]);
                } else if (prompt === 'history') {
                    setHistories([{
                        user: {
                            role: 'user',
                            command: 'history'
                        },
                        assistant: {
                            role: 'assistant',
                            replies: ''
                        },
                        isLast: false,
                        ts: +new Date()
                    }, ...his]);
                }
            } else {
                switch (prompt) {
                    case "help": {
                        setSug('');
                        setHistories([...histories, {
                            user: {
                                command: 'help',
                                role: 'user'
                            },
                            assistant: {
                                replies: <HelpCommand/>,
                                role: 'assistant'
                            },
                            ts: +new Date()
                        }])
                        break;
                    }
                    case "exit": {
                        setSug('');
                        // window.open('', '_self', '');
                        setHistories([...histories, {
                            user: {
                                command: 'exit',
                                role: 'user'
                            },
                            assistant: {
                                replies: "exit: window.close() won't work correctly :o7",
                                role: 'assistant'
                            },
                            ts: +new Date()
                        }]);
                        break;
                    }
                    case 'clear': {
                        setSug('');
                        setHistories([]);
                        break;
                    }
                    case './setup': {
                        setSug('');
                        openModal();
                        break;
                    }
                    case '': {
                        break;
                    }
                    default: {
                        setProc(true);
                        setReq(true);
                        setSug('');
                        try {
                            setHistories([...histories, {
                                ts: +new Date(),
                                user: {
                                    command: prompt,
                                    role: 'user'
                                },
                                assistant: {
                                    role: 'assistant',
                                    replies: ''
                                },
                                isLast: true
                            }]);
                            const context = [];
                            if (mode === 'api') {
                                const contextLen = config?.['api']?.history || 4;
                                if (histories.length) {
                                    for (let i = histories.length - 1; i >= 0; i--) {
                                        if (histories[i].error) {
                                            continue;
                                        }
                                        if (context.length === contextLen) {
                                            break;
                                        }
                                        if (!commands.includes(histories[i].user.command)) {
                                            context.unshift({
                                                "role": histories[i].user.role,
                                                "content": histories[i].user.command
                                            }, {
                                                "role": histories[i].assistant.role,
                                                "content": histories[i].assistant.replies
                                            })
                                        }
                                    }
                                    if (context.length < 1) {
                                        const r_c = JSON.parse(localStorage.getItem('api-store')) || [];
                                        r_c.slice(-contextLen).forEach(_ => {
                                            context.push({
                                                "role": _.user.role,
                                                "content": _.user.command
                                            }, {
                                                "role": _.assistant.role,
                                                "content": _.assistant.replies
                                            });
                                        })
                                    }
                                } else if (localStorage.getItem('api-store')) {
                                    const r_c = JSON.parse(localStorage.getItem('api-store')) || [];
                                    r_c.slice(-contextLen).forEach(_ => {
                                        context.push({
                                            "role": _.user.role,
                                            "content": _.user.command
                                        }, {
                                            "role": _.assistant.role,
                                            "content": _.assistant.replies
                                        });
                                    })
                                }
                                Completions([
                                    {"role": "system", "content": "You are a helpful assistant."},
                                    ...context,
                                    {"role": "user", "content": prompt}
                                ], c_tRef.current.signal, config[mode]).then(body => {
                                    setReq(false);
                                    parse(body, piece => {
                                        setTokens(piece);
                                        tokensRef.current = piece;
                                    }, fullText => {
                                        setTokens('');
                                        tokensRef.current = '';
                                        setProc(false);
                                        const old_store: APIHistory[] = JSON.parse(localStorage.getItem('api-store')) || [];
                                        const date: Date = new Date();
                                        const new_rc: APIHistory = {
                                            ts: +date,
                                            d: dateF(date),
                                            user: {
                                                command: prompt,
                                                role: 'user'
                                            },
                                            assistant: {
                                                role: 'assistant',
                                                replies: fullText
                                            },
                                            isLast: false
                                        };
                                        localStorage.setItem('api-store', JSON.stringify([...old_store, new_rc]));
                                        new_rc.d = '';
                                        setHistories([...histories, new_rc]);
                                    }, mode).catch();
                                }).catch(err => {
                                    if (err?.error?.message) {
                                        setHistories([...histories, {
                                            user: {
                                                command: prompt,
                                                role: 'user'
                                            },
                                            assistant: {
                                                replies: err.error.message,
                                                role: 'assistant'
                                            },
                                            ts: +new Date(),
                                            error: true
                                        }]);
                                        setTokens('');
                                        tokensRef.current = '';
                                        setReq(false);
                                        setProc(false);
                                    } else {
                                        setHistories([...histories, {
                                            user: {
                                                command: prompt,
                                                role: 'user'
                                            },
                                            assistant: {
                                                replies: 'network error!',
                                                role: 'assistant'
                                            },
                                            ts: +new Date(),
                                            error: true
                                        }]);
                                        setTokens('');
                                        tokensRef.current = '';
                                        setReq(false);
                                        setProc(false);
                                    }
                                })
                            } else if (mode === 'chatgpt-reverse') {
                                let parent_message_id: string;
                                let conversation_id;
                                if (histories.length) {
                                    for (let i = histories.length - 1; i >= 0; i--) {
                                        if (histories[i].error) {
                                            continue
                                        }
                                        if ((histories[i] as ChatHistory).id && (histories[i] as ChatHistory).conversation_id) { // 返回id 和 对话id
                                            parent_message_id = (histories[i] as ChatHistory).id;
                                            conversation_id = (histories[i] as ChatHistory).conversation_id;
                                            break;
                                        }
                                    }
                                    if (!parent_message_id && !conversation_id) {
                                        const r_c: ChatHistory[] = JSON.parse(localStorage.getItem('chat-store')) || [];
                                        for (let i = r_c.length - 1; i >= 0; i--) {
                                            if ((r_c[i] as ChatHistory).id && (r_c[i] as ChatHistory).conversation_id) { // 返回id 和 对话id
                                                parent_message_id = (r_c[i] as ChatHistory).id;
                                                conversation_id = (r_c[i] as ChatHistory).conversation_id;
                                                break;
                                            }
                                        }
                                    }
                                    if (!parent_message_id && !conversation_id) {
                                        parent_message_id = uuidv4(); // 第一次发送
                                    }
                                } else if (localStorage.getItem('chat-store')) {
                                    const r_c: ChatHistory[] = JSON.parse(localStorage.getItem('chat-store')) || [];
                                    conversation_id = r_c.slice(-1)[0]?.conversation_id;
                                    parent_message_id = r_c.slice(-1)[0]?.id;
                                } else {
                                    parent_message_id = uuidv4();
                                }
                                Chat([
                                        {
                                            id: uuidv4(),
                                            author: {
                                                role: 'user'
                                            },
                                            content: {
                                                content_type: 'text',
                                                parts: [prompt]
                                            }
                                        }
                                    ], parent_message_id,
                                    c_tRef.current.signal,
                                    config[mode],
                                    config[mode]?.keep_session,
                                    conversation_id
                                ).then(body => {
                                    setReq(false);
                                    parse(body, piece => {
                                        setTokens(piece);
                                        tokensRef.current = piece;
                                    }, (fullText, {
                                        message_id,
                                        conversation_id
                                    }) => {
                                        setTokens('');
                                        tokensRef.current = '';
                                        setProc(false);
                                        const old_store: ChatHistory[] = JSON.parse(localStorage.getItem('chat-store')) || [];
                                        const date: Date = new Date();
                                        const new_rc: ChatHistory = {
                                            ts: +date,
                                            d: dateF(date),
                                            user: {
                                                command: prompt,
                                                role: 'user'
                                            },
                                            assistant: {
                                                role: 'assistant',
                                                replies: fullText
                                            },
                                            isLast: false,
                                            id: message_id,
                                            conversation_id,
                                            parent_message_id
                                        };
                                        localStorage.setItem('chat-store', JSON.stringify([...old_store, new_rc]));
                                        new_rc.d = '';
                                        setHistories([...histories, new_rc]);
                                    }, mode).catch();
                                }).catch(err => {
                                    if (err.detail?.message) {
                                        setHistories([...histories, {
                                            user: {
                                                command: prompt,
                                                role: 'user'
                                            },
                                            assistant: {
                                                replies: err.detail.message,
                                                role: 'assistant'
                                            },
                                            ts: +new Date(),
                                            error: true
                                        }]);
                                        setTokens('');
                                        tokensRef.current = '';
                                        setReq(false);
                                        setProc(false);
                                    } else {
                                        setHistories([...histories, {
                                            user: {
                                                command: prompt,
                                                role: 'user'
                                            },
                                            assistant: {
                                                replies: 'network error!',
                                                role: 'assistant'
                                            },
                                            ts: +new Date(),
                                            error: true
                                        }]);
                                        setTokens('');
                                        tokensRef.current = '';
                                        setReq(false);
                                        setProc(false);
                                    }
                                })
                            }
                        } catch (err) {
                            console.log(err.message);
                        }
                        break;
                    }
                }
            }
            setPrompt('');
        } else if (e.ctrlKey && e.key === 'c' && processing) {
            setSug('');
            let old_rc;
            if (mode === 'api') {
                old_rc = JSON.parse(localStorage.getItem('api-store')) || [];
            } else if (mode === 'chatgpt-reverse') {
                old_rc = JSON.parse(localStorage.getItem('chat-store')) || [];
            }
            const copy = [...histories];
            const last = copy?.length - 1;
            copy[last].assistant.replies = tokensRef.current;
            copy[last].d = dateF(new Date(copy[last].ts));
            copy[last].isLast = false;
            if (mode === 'api') {
                localStorage.setItem('api-store', JSON.stringify([...old_rc, copy[last]]));
            } else if (mode === 'chatgpt-reverse') {
                localStorage.setItem('chat-store', JSON.stringify([...old_rc, copy[last]]));
            }
            copy[last].d = '';
            setHistories([...copy]);
            setTokens('');
            tokensRef.current = '';
            setPrompt('');
            c_tRef.current.abort();
            c_tRef.current = new AbortController();
            setProc(false);
            setReq(false);
        } else if (!isReq && !processing && !isComposing && e.key === 'Tab') {
            e.preventDefault();
            sug && setPrompt(sug);
        } else if (!isReq && !processing && e.code === 'ArrowUp') {
            e.preventDefault();
            const {maps, idx} = cmdMapsRef.current;
            if (idx > 0) {
                cmdMapsRef.current.idx = idx - 1;
                setPrompt(maps[idx - 1] || '');
            }
        } else if (!isReq && !processing && e.code === 'ArrowDown') {
            e.preventDefault();
            const {maps, idx} = cmdMapsRef.current;
            if (idx < maps.length) {
                cmdMapsRef.current.idx = idx + 1;
                setPrompt(maps[idx + 1] || '');
            }
        } else if (e.ctrlKey && e.key === 'l' && !processing && !isReq) {
            setSug('');
            setHistories([]);
        }
    }, [histories, sug, mode, config, processing]);

    return (
        <div ref={con_ref} onClick={e => {
            e.preventDefault();
            e.target === e.currentTarget && t_a_ref.current && t_a_ref.current.focus();
        }} className='ml-2 text-white mr-2 h-[calc(100%-1.8rem)] overflow-x-hidden overflow-y-auto rm-sc'>
            <div className='inline-block mt-0.5 font-mono text-gray-300'>
                {l_l}
            </div>
            <div className='flex flex-col relative mb-1'>
                {histories.map((_, i) => {
                    return <div key={i}>
                        <div className='flex items-start'>
                            <div className='flex items-center justify-center mr-2'>
                                <span className='text-gray-300'>root@sh#</span>
                                <div
                                    className='relative flex ml-4 mr-2 bg-triangle w-6 h-4 items-center justify-center a_f'>
                                    <div className='absolute left-[-.5rem]'>
                                        <div className='t_t'></div>
                                        <div className='b_t'></div>
                                    </div>
                                    <span className='text-gray-800'>~</span>
                                </div>
                            </div>
                            <div>
                                {_?.d && <span className='mr-2 text-green-700 font-mono text-sm'>{_?.d}</span>}
                                <span className='text-gray-300'>{_?.user.command}</span>
                            </div>
                        </div>
                        {!_?.isLast && <Markdown tokens={_?.assistant?.replies}/>}
                    </div>
                })}
                {processing && <Markdown tokens={tokens}/>}
                <div style={{position: processing ? 'absolute' : 'static', opacity: processing ? '0' : '1', bottom: 0}}
                     className='flex items-start w-[100%]'>
                    <div className='relative flex items-center justify-center'>
                        <span className='text-gray-300'>root@sh#</span>
                        <div className='relative flex ml-4 mr-2 bg-triangle w-6 h-4 items-center justify-center a_f'>
                            <div className='absolute left-[-.5rem]'>
                                <div className='t_t'></div>
                                <div className='b_t'></div>
                            </div>
                            <span className='text-gray-800'>~</span>
                        </div>
                    </div>
                    <div className='flex-1 relative ml-2'>
                        <span className='absolute left-0 opacity-70 z-0'>{sug}</span>
                        <TextareaAutosize ref={t_a_ref} value={prompt} onInput={handleInput}
                                          onKeyDown={e => handlePress(e, prompt)}
                                          autoFocus
                                          className='text-gray-300 w-[100%] caret-w-2 resize-none focus:outline-none bg-transparent'>
                        </TextareaAutosize>
                    </div>
                </div>
            </div>
            {isReq && <div className='w-[6px] h-[20px] bg-white animate-breath'></div>}
        </div>
    );
}