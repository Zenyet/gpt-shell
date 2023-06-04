// @flow
import * as React from 'react';
import {useContext} from "react";
import {ModalContext} from "../context";

export function SetupModal({isOpen}: { isOpen: boolean }) {
    const {closeModal} = useContext(ModalContext);
    return (
        <div style={{display: isOpen ? 'flex' : 'none'}}
             className='w-full h-[100vh] fixed left-0 top-0 flex items-center justify-center z-50'>
            <div
                className='rounded-xl overflow-hidden w-1/3 h-1/2 bg-st-bg border-[1px] border-ter-border bg-[rgba(0,0,0,.7)]'>
                <div className='bg-st-top h-[15%] border-b-[1px] border-b-st-bt'>
                    <div className='flex'>
                        <span onClick={() => closeModal()}
                              className='bg-[#ff6057] w-3 h-3 ml-1.5 mt-1.5 rounded-full'></span>
                        <span className='bg-[#5b5c5b] w-3 h-3 ml-1.5 mt-1.5 rounded-full'></span>
                        <span className='bg-[#5b5c5b] w-3 h-3 ml-1.5 mt-1.5 rounded-full'></span>
                    </div>
                    <div className='h-[calc(100%-18px)]'>

                    </div>
                </div>
            </div>
        </div>
    );
}