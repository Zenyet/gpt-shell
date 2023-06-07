// @flow
import * as React from 'react';
import {useState} from "react";

type Props = {
    defaultOpacity: string | number
    defaultBlur: number
    changeOpacity?: (opacity: string) => void
    changeBlur?: (blur: number) => void
}

export function Appearance({defaultBlur, defaultOpacity, changeBlur, changeOpacity}: Props) {
    const themeConfig = JSON.parse(localStorage.getItem('theme-config')) || {};
    const [opacity, setOP] = useState<string>((parseInt(themeConfig.opacity) + '') || defaultOpacity as string);
    const [blur, setBlur] = useState<number>(themeConfig.blur || defaultBlur);

    return <div className='w-[80%]'>
        <div className='text-xs mt-5 text-gray-50'>不透明度</div>
        <div className='flex items-center'>
            <div className='relative w-[80%] h-2 bg-gray-600'>
                <input value={opacity} min='0' max='100' onChange={e => {
                    setOP(e.target.value);
                    changeOpacity(e.target.value + '%')
                }}
                       className='appearance-none h-2 absolute w-[100%] bg-transparent' type="range"/>
                <span onClick={() => {
                    setOP('0')
                    changeOpacity('0%')
                }}
                      className='absolute bottom-[-2px] h-3 w-1 bg-gray-500 rounded-full'></span>
                <span onClick={() => {
                    setOP('50');
                    changeOpacity('50%')
                }}
                      className='absolute left-[calc(50%-2px)] bottom-[-2px] h-3 w-1 bg-gray-500 rounded-full'></span>
                <span onClick={() => {
                    setOP('100');
                    changeOpacity('100%');
                }}
                      className='absolute right-0 bottom-[-2px] h-3 w-1 bg-gray-500 rounded-full'></span>
            </div>
            <div className='w-[20%]'>
                <input min={0} max={100} className='relative pl-1.5 rounded-md ml-2 w-[3.5rem] px-1'
                       value={opacity}
                       onChange={e => {
                           setOP(e.target.value);
                           changeOpacity(e.target.value + '%')
                       }} type="number"/>
                <span className='absolute translate-x-1 text-gray-50'>%</span>
            </div>
        </div>
        <div className='text-xs mt-4 text-gray-50'>模糊度</div>
        <div className='flex items-center mb-6'>
            <div className='relative w-[80%] h-2 bg-gray-600'>
                <input value={blur} min={0} max={100} onChange={e => {
                    setBlur(+e.target.value);
                    changeBlur((+e.target.value) * 0.32);
                }}
                       className='appearance-none h-2 absolute w-[100%] bg-transparent' type="range"/>
                <span onClick={() => {
                    setBlur(0)
                    changeBlur(0)
                }}
                      className='absolute bottom-[-2px] h-3 w-1 bg-gray-500 rounded-full'></span>
                <span onClick={() => {
                    setBlur(50);
                    changeBlur(16)
                }}
                      className='absolute left-[calc(50%-2px)] bottom-[-2px] h-3 w-1 bg-gray-500 rounded-full'></span>
                <span onClick={() => {
                    setBlur(100);
                    changeBlur(32);
                }}
                      className='absolute right-0 bottom-[-2px] h-3 w-1 bg-gray-500 rounded-full'></span>
            </div>
            <div className='w-[20%]'>
                <input min={0} max={100} className='relative pl-1.5 rounded-md ml-2 w-[3.5rem] px-1'
                       value={blur}
                       onChange={e => {
                           setBlur(+e.target.value);
                           changeBlur((+e.target.value) * 0.32);
                       }} type="number"/>
                <span className='absolute translate-x-1 text-gray-50'>%</span>
            </div>
        </div>
    </div>
}