import {memo} from "react";

export const TerminalTop = memo(({mode}: { mode: string }) => {
    const handleClick = () => {
        const d = document as any;
        if (d.fullscreenElement || d.webkitFullscreenElement) {
            if (d.webkitExitFullscreen) {
                d.webkitExitFullscreen();
            } else {
                d.exitFullscreen().catch();
            }
        } else {
            if (d.body.webkitRequestFullscreen) {
                d.body.webkitRequestFullscreen();
            } else {
                d.body.requestFullscreen().catch();
            }
        }
    }

    return (
        <div className='relative w-[100%] bg-ter-top h-[1.8rem] flex items-center border-b-[1px] border-b-gray-950'>
            <span className='bg-[#ff6057] w-3.5 h-3.5 ml-1.5 rounded-full'></span>
            <span className='bg-[#ffbc2e] w-3.5 h-3.5 ml-2 rounded-full'></span>
            <span onClick={() => handleClick()} className='bg-[#00c840] w-3.5 h-3.5 ml-2 rounded-full'></span>
            <span className='absolute left-1/2 text-gray-400 translate-x-[-50%] font-medium'>root@{mode}</span>
        </div>
    );
});