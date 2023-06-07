// @flow
import * as React from 'react';
import {ReactElement, ReactNode, useState} from "react";

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
                  className='flex items-center justify-center bg-[#5b5c59] w-3.5 h-3.5 rounded-full'>
                <span style={{backgroundColor: !isChecked ? 'transparent' : ''}}
                      className='bg-white rounded-full w-1.5 h-1.5 inline-block'></span>
            </span>
        </span>
        <span className='text-xs text-gray-50'>{children}</span>
    </label>
}


export function Settings() {
    const [mode, setMode] = useState<string>('API');
    const options = [
        {
            value: 'API',
            label: 'API',
        },
        {
            value: 'ChatGPT-ReverseProxy',
            label: <>
                ChatGPT反代(由zhile.io大佬提供的 <a
                className='text-blue-500'
                href='https://ai.fakeopen.com' target='_blank'>https://ai.fakeopen.com </a>)
            </>
        }
    ];

    const handleClick = (value: string) => {
        setMode(value);
    }

    return (
        <div className='w-[80%]'>
            <div className='flex mt-4'>
                <span className='text-xs text-gray-50 my-1'>模式: </span>
                <div className='flex flex-col items-start ml-4'>
                    {options.map((_, idx) => {
                        return <Radio handleClick={handleClick} key={_.value + idx} isChecked={_.value === mode}
                                      value={_.value}>{_.label}</Radio>
                    })}
                </div>
            </div>
        </div>
    );
}