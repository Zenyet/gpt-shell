// @flow
import * as React from 'react';
import {useState} from "react";

type Props = {
    changeOpacity?: (opacity: string) => void
    changeBlur?: (blur: number) => void
    blur_?: number
    opacity_?: string
}

export function Appearance({changeBlur, changeOpacity, blur_, opacity_}: Props) {
    const [opacity, setOP] = useState<string>(opacity_ || '50');
    const [blur, setBlur] = useState<number>(blur_ / 0.32 || 0);

    return <div className='w-[80%]'>
        <div className='text-xs mt-5 text-gray-600 dark:text-gray-50'>不透明度</div>
        <div className='flex items-center'>
            <div className='relative w-[80%] h-2 bg-[#dadad9] dark:bg-[#3d3e3b]'>
                <input value={opacity} min='0' max='100' onChange={e => {
                    setOP(e.target.value);
                    changeOpacity(e.target.value)
                }}
                       className='appearance-none h-2 absolute w-[100%] bg-transparent' type="range"/>
                <span onClick={() => {
                    setOP('0')
                    changeOpacity('0')
                }}
                      className='absolute bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
                <span onClick={() => {
                    setOP('50');
                    changeOpacity('50')
                }}
                      className='absolute left-[calc(50%-2px)] bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
                <span onClick={() => {
                    setOP('100');
                    changeOpacity('100');
                }}
                      className='absolute right-0 bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
            </div>
            <div className='w-[20%] flex items-center'>
                <div className='flex'>
                    <input min={0} max={100}
                           className='text-gray-600 dark:text-gray-50 w-[100%] bg-white dark:bg-[#3b3b3b] h-5 text-center text-[0.875rem] relative pl-1.5 rounded-md ml-2 px-1'
                           value={opacity}
                           onChange={e => {
                               setOP(e.target.value);
                               changeOpacity(e.target.value)
                           }} type="number"/>
                </div>
                <span className='ml-1 text-gray-600 dark:text-gray-50'>%</span>
            </div>
        </div>
        <div className='text-xs mt-4 text-gray-600 dark:text-gray-50'>模糊度</div>
        <div className='flex items-center mb-6'>
            <div className='relative w-[80%] h-2 bg-[#dadad9] dark:bg-[#3d3e3b]'>
                <input value={blur} min={0} max={100} onChange={e => {
                    setBlur(+e.target.value);
                    changeBlur((+e.target.value) * 0.32);
                }}
                       className='appearance-none h-2 absolute w-[100%] bg-transparent' type="range"/>
                <span onClick={() => {
                    setBlur(0)
                    changeBlur(0)
                }}
                      className='absolute bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
                <span onClick={() => {
                    setBlur(50);
                    changeBlur(16)
                }}
                      className='absolute left-[calc(50%-2px)] bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
                <span onClick={() => {
                    setBlur(100);
                    changeBlur(32);
                }}
                      className='absolute right-0 bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
            </div>
            <div className='w-[20%] flex items-center justify-start'>
                <div className='flex'>
                    <input min={0} max={100}
                           className='text-gray-600 dark:text-gray-50 w-[100%] bg-white dark:bg-[#3b3b3b] h-5 text-center text-[0.875rem] relative pl-1.5 rounded-md ml-2 px-1'
                           value={blur}
                           onChange={e => {
                               setBlur(+e.target.value);
                               changeBlur((+e.target.value) * 0.32);
                           }} type="number"/>
                </div>
                <span className='ml-1 text-gray-600 dark:text-gray-50'>%</span>
            </div>
        </div>
    </div>
}