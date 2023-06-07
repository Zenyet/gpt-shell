import {TerminalTop} from "./TerminalTop.tsx";
import {TerminalBottom} from "./TerminalBottom.tsx";

type ThemeConfig = {
    opacity: string
    blur?: number
}

export function TerminalBox({opacity, blur}: ThemeConfig) {
    return (
        <div
            style={{
                backgroundColor: 'rgba(0,0,0,' + opacity + ')',
                backdropFilter: 'blur(' + (~~blur) + 'px)',
                WebkitBackdropFilter: 'blur(' + (~~blur) + 'px)'
            }}
            className='border-[1px] border-ter-border transform-gpu w-[66%] h-[85%] rounded-xl overflow-hidden'>
            <TerminalTop/>
            <TerminalBottom/>
        </div>
    );
}