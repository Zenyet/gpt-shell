import {ChangeEvent} from "react";
import * as React from "react";

export function Select({options, onChange, value}: {
    value: string,
    options: {
        value: string
        label: string
    }[],
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
}) {
    return <select value={value} onChange={onChange}
                   className='text-gray-50 text-xs py-1 px-1.5 appearance-none text-center bg-[#595a58] outline-0 rounded-md'>
        {options.map((_, idx) => {
            return <option className='text-center' key={_.value + idx} value={_.value}>{_.label}</option>
        })}
    </select>
}