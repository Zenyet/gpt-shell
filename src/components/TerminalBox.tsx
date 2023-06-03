import {TerminalTop} from "./TerminalTop.tsx";
import {TerminalBottom} from "./TerminalBottom.tsx";

export function TerminalBox() {
    return (
        <div className='border-[1px] border-ter-border bg-[rgba(0,0,0,.7)] backdrop-blur-md transform-gpu w-[66%] h-[85%] rounded-xl overflow-hidden'>
            <TerminalTop/>
            <TerminalBottom/>
        </div>
    );
}