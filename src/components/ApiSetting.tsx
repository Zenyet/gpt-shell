// @flow
import * as React from 'react';
import {InputRange} from "./InputRange.tsx";
import {useEffect, useRef, useState} from "react";
import {Select} from "./Select.tsx";
import {debounce} from "../helpers";
import {useAtom} from "jotai";
import {configAtom} from "../state";

type APIConfig = {
    model?: string
    max_tokens?: number
    temperature?: number
    history?: number
    useProxy?: boolean
    proxyAddress?: string
    apiKey?: string
}

export function ApiSetting() {
    const configRef = useRef(null);
    const dbRef = useRef<(config: APIConfig) => void | null>(null);
    const [, setCF] = useAtom(configAtom);

    const options = [
        {
            value: 'gpt-3.5-turbo',
            label: 'gpt-3.5-turbo'
        },
        {
            value: 'gpt-3.5-turbo-0301',
            label: 'gpt-3.5-turbo-0301'
        },
        {
            value: 'gpt-3.5-turbo-0613',
            label: 'gpt-3.5-turbo-0613'

        },
        {
            value: 'gpt-3.5-turbo-16k',
            label: 'gpt-3.5-turbo-16k'
        },
        {
            value: 'gpt-3.5-turbo-16k-0613',
            label: 'gpt-3.5-turbo-16k-0613'
        },
        {
            value: 'gpt-4',
            label: 'gpt-4'
        },
        {
            value: 'gpt4-0314',
            label: 'gpt4-0314'
        },
        {
            value: 'gpt-4-0613',
            label: 'gpt-4-0613'
        },
        {
            value: 'gpt4-32k',
            label: 'gpt4-32k'
        },
        {
            value: 'gpt4-32k-0314',
            label: 'gpt4-32k-0314'
        },
        {
            value: 'gpt-4-32k-0613',
            label: 'gpt-4-32k-0613'
        },
        {
            value: 'gpt-4-1106-preview',
            label: 'gpt-4-1106-preview',
        },
    ];

    useEffect(() => {
        if (!dbRef.current) {
            dbRef.current = debounce((config: APIConfig) => {
                const new_config = JSON.parse(localStorage.getItem('config')) || {};
                new_config.api = {...config};
                setCF({...new_config});
                localStorage.setItem('config', JSON.stringify({...new_config}));
            }, 300);
        }
    }, []);

    if (!configRef.current) {
        try {
            const config = JSON.parse(localStorage.getItem('config'));
            if (config?.['api']) {
                configRef.current = config?.['api'];
            } else {
                configRef.current = {
                    model: 'gpt-3.5-turbo',
                    max_tokens: 2048,
                    temperature: 0.6,
                    history: 4,
                    useProxy: true,
                    proxyAddress: 'https://thoughtflow.org/reverse/api-reverse',
                    apiKey: ''
                };
                localStorage.setItem('config', JSON.stringify({...config, 'api': configRef.current}));
            }
        } catch (e) {
            console.log('JSON parse Error', e);
        }
    }

    const [config, setConfig] = useState<APIConfig>({...configRef.current});

    const updateAPIConfig = (config: APIConfig, frequency = true) => {
        setConfig({...config});
        if (frequency) {
            dbRef.current({...config});
        } else {
            try {
                const new_config = JSON.parse(localStorage.getItem('config')) || {};
                new_config['api'] = {...config};
                setCF({...new_config});
                localStorage.setItem('config', JSON.stringify(new_config));
            } catch (e) {
                console.log(e.message);
            }
        }
    }

    return <>
        <div className='flex mb-4 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1 '>模型: </span>
            <div className='ml-4'>
                <Select value={config.model} onChange={e => updateAPIConfig({...config, model: e.target.value}, false)}
                        options={options}/>
            </div>
        </div>
        <div className='flex mb-4 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1 '>历史消息: </span>
            <div className='ml-4 w-[80%]'>
                <InputRange value={config.history} min={0} max={24}
                            onClickMax={() => updateAPIConfig({...config, history: 24}, false)}
                            onClickMin={() => updateAPIConfig({...config, history: 1}, false)}
                            onClickMiddle={() => updateAPIConfig({...config, history: 12}, false)}
                            onChange={(e) => {
                                (+e.target.value > 24) && updateAPIConfig({...config, history: 24});
                                (+e.target.value < 24) && updateAPIConfig({...config, history: +e.target.value || 0});
                            }}/>
            </div>
        </div>
        <div className='flex mb-4 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1 '>temperature: </span>
            <div className='ml-4 w-[80%]'>
                <InputRange value={config.temperature} step={0.1} min={0} max={2}
                            onClickMax={() => updateAPIConfig({...config, temperature: 2.0}, false)}
                            onClickMin={() => updateAPIConfig({...config, temperature: 0}, false)}
                            onClickMiddle={() => updateAPIConfig({...config, temperature: 1.0}, false)}
                            onChange={(e) => {
                                (+e.target.value > 2.0) && updateAPIConfig({...config, temperature: 2.0});
                                (+e.target.value < 2.0) && updateAPIConfig({
                                    ...config,
                                    temperature: +e.target.value || 0
                                })
                            }}/>
            </div>
        </div>
        <div className='flex mb-4 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1 '>max_tokens: </span>
            <div className='ml-4 w-[80%]'>
                <InputRange value={config.max_tokens} min={0} max={32768}
                            onClickMax={() => updateAPIConfig({...config, max_tokens: 32768}, false)}
                            onClickMin={() => updateAPIConfig({...config, max_tokens: 0}, false)}
                            onClickMiddle={() => updateAPIConfig({...config, max_tokens: 16384}, false)}
                            onChange={(e) => {
                                (+e.target.value > 32768) && updateAPIConfig({...config, max_tokens: 32768});
                                (+e.target.value < 32768) && updateAPIConfig({
                                    ...config,
                                    max_tokens: +e.target.value || 0
                                });
                            }}/>
            </div>
        </div>
        <div className='flex mb-6 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1'>API Key: </span>
            <div className='flex ml-4 w-[80%] items-center'>
                <div className='w-[50%] flex'>
                    <input
                        placeholder='输入 API Key'
                        value={config.apiKey}
                        onChange={e => {
                            updateAPIConfig({...config, apiKey: e.target.value});
                        }}
                        className='text-gray-600 dark:text-gray-50 appearance-none px-2 py-0.5 dark:bg-[#3b3b3b] text-xs w-[100%] rounded-[5px]'
                        type="text"/>
                </div>
            </div>
        </div>
        <div className='flex mb-6 items-center'>
            <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1'>使用代理: </span>
            <div className='flex ml-4 w-[80%] items-center'>
                <div className='h-4 flex items-center mr-2'>
                    <input className='accent-[#0080ff]' checked={config.useProxy} onChange={() => {
                        updateAPIConfig({...config, useProxy: !config.useProxy});
                    }} type="checkbox"/>
                </div>
                <div className='w-[50%] flex'>
                    {config.useProxy && <input
                        placeholder='输入反代地址'
                        value={config.proxyAddress}
                        onChange={e => {
                            updateAPIConfig({...config, proxyAddress: e.target.value});
                        }}
                        className='text-gray-600 dark:text-gray-50 appearance-none px-2 py-0.5 dark:bg-[#3b3b3b] text-xs w-[100%] rounded-[5px]'
                        type="text"/>}
                </div>
            </div>
        </div>
    </>
}