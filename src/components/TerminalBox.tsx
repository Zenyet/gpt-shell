import {TerminalTop} from "./TerminalTop.tsx";
import {TerminalBottom} from "./TerminalBottom.tsx";

type ThemeConfig = {
    opacity: string
    blur?: number
    mode?: string
}

export function TerminalBox({opacity, blur, mode}: ThemeConfig) {
    return (
        <div
            style={{
                backgroundColor: 'rgba(0,0,0,' + opacity + '%)',
                backdropFilter: 'blur(' + (~~blur) + 'px)',
                WebkitBackdropFilter: 'blur(' + (~~blur) + 'px)'
            }}
            className='border-[1px] border-ter-border transform-gpu w-[66%] h-[85%] rounded-xl overflow-hidden'>
            <TerminalTop mode={mode}/>
            <TerminalBottom mode={mode}/>
        </div>
    );
}