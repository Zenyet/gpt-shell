// @flow
import * as React from 'react';
import {ReactElement, ReactNode, useEffect, useRef, useState} from "react";
import {ApiSetting} from "./ApiSetting.tsx";
import {ChatSetting} from "./ChatSetting.tsx";

const Radio = ({value, isChecked, handleClick, children}: {
    value: string,
    isChecked?: boolean,
    handleClick?: (option: string) => void,
    children: ReactNode | ReactElement | string
}) => {
    return <label onClick={() => handleClick(value)} className='my-1 relative flex items-center cursor-pointer'>
        <span className='mr-1'>
            <input onChange={() => {
                return
            }} checked={isChecked} type='radio' className='absolute cursor-pointer opacity-0 z-0'/>
            <span style={{backgroundColor: isChecked ? '#0077df' : ''}}
                  className='flex items-center justify-center bg-[#ddd] dark:bg-[#5b5c59] w-3.5 h-3.5 rounded-full'>
                <span style={{backgroundColor: !isChecked ? 'transparent' : ''}}
                      className='bg-white rounded-full w-1.5 h-1.5 inline-block'></span>
            </span>
        </span>
        <span className='text-xs text-gray-600 dark:text-gray-50'>{children}</span>
    </label>
}

export function Settings({toggleMode}: { toggleMode: (mode: string) => void }) {
    const curModeRef = useRef<string>(null);

    if (!curModeRef.current) {
        curModeRef.current = JSON.parse(localStorage.getItem('config'))?.mode || 'api';
    }

    const [mode, setMode] = useState<string>(curModeRef.current || 'api');

    const options = [
        {
            value: 'api',
            label: 'API',
        },
        {
            value: 'chatgpt-reverse',
            label: <>
                ChatGPT反代(由zhile.io大佬提供的 <a
                className='text-blue-500'
                href='https://ai.fakeopen.com' target='_blank'>https://ai.fakeopen.com </a>)
            </>
        }
    ];

    const updateConfig = (mode: string) => {
        const new_config = JSON.parse(localStorage.getItem('config')) || {};
        new_config.mode = mode;
        localStorage.setItem('config', JSON.stringify({...new_config}));
    }

    const handleClick = (mode: string) => {
        setMode(mode);
        curModeRef.current = mode;
        toggleMode(mode);
        updateConfig(mode);
    }

    return (
        <div className='w-[90%]'>
            <div className='flex mt-4 mb-2'>
                <span className='w-[18%] text-right text-xs text-gray-600 dark:text-gray-50 my-1'>模式: </span>
                <div className='flex flex-col items-start ml-4'>
                    {options.map((_, idx) => {
                        return <Radio handleClick={handleClick} key={_.value + idx} isChecked={_.value === mode}
                                      value={_.value}>{_.label}</Radio>
                    })}
                </div>
            </div>
            {mode === 'api' ? <ApiSetting/> : <ChatSetting/>}
        </div>
    );
}