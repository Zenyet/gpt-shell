// @flow
import * as React from 'react';
import {ChangeEvent} from "react";

export function InputRange({value, min, max, step, onChange, onClickMax, onClickMiddle, onClickMin}: {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    onClickMin?: () => void,
    onClickMiddle?: () => void,
    onClickMax?: () => void,
    value: number,
    min: number,
    max: number,
    step?: number
}) {
    return <div className='flex items-center'>
        <div className='relative w-[80%] h-2 bg-[#dadad9] dark:bg-[#3d3e3b]'>
            <input step={step} onChange={onChange} value={value} min={min} max={max}
                   className='appearance-none h-2 absolute w-[100%] bg-transparent' type="range"/>
            <span onClick={onClickMin}
                  className='absolute bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
            <span onClick={onClickMiddle}
                  className='absolute left-[calc(50%-2px)] bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
            <span onClick={onClickMax}
                  className='absolute right-0 bottom-[-2px] h-3 w-1 bg-[#c9c9c8] dark:bg-[#525351] rounded-full'></span>
        </div>
        <div className='w-[20%] flex items-center justify-start'>

            <input min={0} max={100}
                   step={step || 1}
                   onChange={onChange}
                   className='appearance-none text-gray-600 dark:text-gray-50 w-[100%] bg-white dark:bg-[#3b3b3b] h-5 text-center text-[0.875rem] relative pl-1.5 rounded-md ml-2 px-1'
                   value={value}
                   type="number"/>
        </div>
    </div>
}