import {TerminalBox} from "./components/TerminalBox";
import {useRef, useState} from "react";
import {SetupModal} from "./components/SetupModal.tsx";
import {useModal} from "./hooks/useModal.ts";
import {GlobalContext} from "./context";
import {useBackground} from "./hooks/useBackground.ts";
import {useAtom} from 'jotai';
import {configAtom} from "./state";

function App() {
    const bingURL = useBackground();
    const [isOpen, openModal, closeModal] = useModal();
    const themeConfigRef = useRef(null);
    const curModeRef = useRef<string>(null);
    const [, setConfig] = useAtom(configAtom);

    if (!curModeRef.current) {
        const cf = JSON.parse(localStorage.getItem('config')) || {
            mode: 'api',
            'api': {
                model: 'gpt-3.5-turbo',
                max_tokens: 2048,
                temperature: 0.6,
                history: 4,
                useProxy: true,
                proxyAddress: 'https://thoughtflow.org/reverse',
                apiKey: ''
            },
            'chatgpt-reverse': {
                model: 'text-davinci-002-render-sha',
                useProxy: true,
                proxyAddress: 'https://ai.fakeopen.com/api/conversation',
                access_token: ''
            }
        };
        curModeRef.current = cf?.mode || 'api';
        setConfig({...cf});
        localStorage.setItem('config', JSON.stringify({...cf}));
    }

    if (!themeConfigRef.current) {
        themeConfigRef.current = JSON.parse(localStorage.getItem('theme-config')) || {};
    }

    const timer = useRef<{ timer1: number | null, timer2: number | null }>({
        timer1: null,
        timer2: null
    });

    const [opacity, setOP] = useState<string>(themeConfigRef.current?.opacity || '50');
    const [blur, setBlur] = useState<number>(themeConfigRef.current?.blur || 0);
    const [mode, setMode] = useState<string>(curModeRef.current || 'api');

    const changeOpacity = (opacity: string) => {
        timer.current.timer1 && clearTimeout(timer.current.timer1);
        setOP(opacity);
        if (!timer.current.timer2) {
            timer.current.timer1 = setTimeout(() => {
                localStorage.setItem('theme-config', JSON.stringify({
                    opacity,
                    blur
                }));
                timer.current.timer1 = null;
            }, 300);
        }
    }

    const changeBlur = (blur: number) => {
        timer.current.timer2 && clearTimeout(timer.current.timer2);
        setBlur(blur);
        if (!timer.current.timer1) {
            timer.current.timer2 = setTimeout(() => {
                localStorage.setItem('theme-config', JSON.stringify({
                    opacity,
                    blur
                }));
                timer.current.timer2 = null;
            }, 300);
        }
    }

    const toggleMode = (mode: string) => {
        setMode(mode);
    }

    return (
        <div style={{backgroundImage: `url(${bingURL})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}
             className="flex items-center justify-center h-[100vh]">
            <GlobalContext.Provider value={{openModal, closeModal, toggleMode}}>
                <TerminalBox mode={mode} opacity={opacity} blur={blur}/>
                <SetupModal isOpen={isOpen}
                            opacity={opacity}
                            blur={blur}
                            changeBlur={changeBlur}
                            changeOpacity={changeOpacity}/>
            </GlobalContext.Provider>
        </div>
    )
}

export default App
