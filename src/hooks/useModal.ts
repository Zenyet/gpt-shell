// @flow
import * as React from 'react';
import {Provider, useState} from "react";
import {ModalContext} from "../context";

export function useModal(): [Provider<any>, boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return [ModalContext.Provider, isOpen, openModal, closeModal];
}