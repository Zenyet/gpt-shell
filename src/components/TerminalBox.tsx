import {TerminalTop} from "./TerminalTop.tsx";
import {TerminalBottom} from "./TerminalBottom.tsx";

export function TerminalBox() {
    return (
        <div className='border-[1px] border-ter-border bg-black w-[66%] h-[85%] rounded-xl overflow-hidden'>
            <TerminalTop/>
            <TerminalBottom/>
        </div>
    );
}