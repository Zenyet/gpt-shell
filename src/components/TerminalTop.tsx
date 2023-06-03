import {useState} from "react";

export function TerminalTop() {
    const [isF, setIsF] = useState<boolean>(false);
    const handleClick = () => {
        if (isF) {
            document.exitFullscreen().then(() => {
                setIsF(false);
            })
        } else {
            document.body.requestFullscreen().then(() => {
                document.fullscreenElement && setIsF(true);
            }); // just for fun :)
        }
    }

    return (
        <div className='w-[100%] bg-ter-top h-[1.8rem] flex items-center'>
            <span className='bg-[#ff6057] w-3.5 h-3.5 ml-1.5 rounded-full'></span>
            <span className='bg-[#ffbc2e] w-3.5 h-3.5 ml-2 rounded-full'></span>
            <span onClick={() => handleClick()} className='bg-[#00c840] w-3.5 h-3.5 ml-2 rounded-full'></span>
        </div>
    );
}