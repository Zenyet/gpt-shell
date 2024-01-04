// @flow
import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import {debounce} from "../helpers";
import {Select} from "./Select.tsx";
import {useAtom} from "jotai";
import {configAtom} from "../state";
import {ChatConfig} from "../types";
import {InputRange} from "./InputRange.tsx";

export function ChatSetting() {
    const configRef = useRef(null);
    const dbRef = useRef<(config: ChatConfig) => void | null>(null);
    const [, setCF] = useAtom(configAtom);

    const options = [
        {
            value: 'text-davinci-002-render-sha',
            label: 'text-davinci-002-render-sha'
        },
        {
            value: 'text-davinci-002-render-sha-mobile',
            label: 'text-davinci-002-render-sha-mobile'
        },
    ];

    useEffect(() => {
        if (!dbRef.current) {
            dbRef.current = debounce((config: ChatConfig) => {
                const new_config = JSON.parse(localStorage.getItem('config')) || {};
                new_config['chatgpt-reverse'] = {...config};
                setCF({...new_config});
                localStorage.setItem('config', JSON.stringify({...new_config}));
            }, 300);
        }
    }, []);

    if (!configRef.current) {
        try {
            const config = JSON.parse(localStorage.getItem('config'));
            if (config?.['chatgpt-reverse']) {
                configRef.current = {...config?.['chatgpt-reverse']};
            } else {
                configRef.current = {
                    model: 'text-davinci-002-render-sha',
                    useProxy: true,
                    proxyAddress: 'https://ai.fakeopen.com/api/conversation',
                    access_token: '',
                    keep_session: true,
                    max_history: 25
                };
                setCF({...config, 'chatgpt-reverse': configRef.current});
                localStorage.setItem('config', JSON.stringify({...config, 'chatgpt-reverse': configRef.current}))
            }
        } catch (e) {
            console.log('JSON parse Error');
        }
    }

    const [config, setConfig] = useState<ChatConfig>({...configRef.current});

    const updateChatConfig = (config: ChatConfig, frequency = true) => {
        setConfig({...config});
        if (frequency) {
            dbRef.current({...config});
        } else {
            try {
                const new_config = JSON.parse(localStorage.getItem('config')) || {};
                new_config['chatgpt-reverse'] = {...config};
                localStorage.setItem('config', JSON.stringify({...new_config}));
            } catch (e) {
                console.log(e.message);
            }
        }
    }

    return <>
        <div className='flex mb-4 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1 '>模型: </span>
            <div className='ml-4'>
                <Select value={config.model} onChange={e => updateChatConfig({...config, model: e.target.value}, false)}
                        options={options}/>
            </div>
        </div>
        <div className='flex mb-4 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1'>Access Token: </span>
            <div className='flex ml-4 w-[80%] items-center'>
                <div className='w-[50%] flex'>
                    <input
                        placeholder='输入 Access Token'
                        value={config.access_token}
                        onChange={e => {
                            updateChatConfig({...config, access_token: e.target.value});
                        }}
                        className='text-gray-600 dark:text-gray-50 appearance-none px-2 py-0.5 dark:bg-[#3b3b3b] text-xs w-[100%] rounded-[5px]'
                        type="text"/>
                </div>
            </div>
        </div>
        <div className='flex mb-4 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1 '>历史记录条数: </span>
            <div className='ml-4 w-[80%]'>
                <InputRange value={config.max_history} min={1} max={999}
                            onClickMax={() => updateChatConfig({...config, max_history: 999}, false)}
                            onClickMin={() => updateChatConfig({...config, max_history: 0}, false)}
                            onClickMiddle={() => updateChatConfig({...config, max_history: 498}, false)}
                            onChange={(e) => {
                                (+e.target.value > 999) && updateChatConfig({...config, max_history: 999});
                                (+e.target.value < 999) && updateChatConfig({
                                    ...config,
                                    max_history: +e.target.value || 0
                                });
                            }}/>
            </div>
        </div>
        <div className='flex mb-6 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1'>使用代理: </span>
            <div className='flex ml-4 w-[80%] items-center'>
                <div className='h-4 flex items-center mr-2'>
                    <input className='accent-[#0080ff]' checked={config.useProxy} onChange={() => {
                        updateChatConfig({...config, useProxy: !config.useProxy});
                    }} type="checkbox"/>
                </div>
                <div className='w-[50%] flex'>
                    {config.useProxy && <input
                        placeholder='输入反代地址'
                        value={config.proxyAddress}
                        onChange={e => {
                            updateChatConfig({...config, proxyAddress: e.target.value});
                        }}
                        className='text-gray-600 dark:text-gray-50 appearance-none px-2 py-0.5 dark:bg-[#3b3b3b] text-xs w-[100%] rounded-[5px]'
                        type="text"/>}
                </div>
            </div>
        </div>
        <div className='flex mb-6 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1'>保存对话: </span>
            <div className='flex ml-4 w-[80%] items-center'>
                <div className='h-4 flex items-center mr-2'>
                    <input className='accent-[#0080ff]' checked={config.keep_session} onChange={() => {
                        updateChatConfig({...config, keep_session: !config.keep_session});
                    }} type="checkbox"/>
                </div>
                <span className='text-gray-600 dark:text-gray-50 text-xs'>
                    {config.keep_session ? '你的对话将会在官网显示' : '你的对话将会在官网被隐藏'}
                </span>
            </div>
        </div>
    </>
}