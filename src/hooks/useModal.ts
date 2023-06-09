import {useState} from "react";
export function useModal(): [boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return [isOpen, openModal, closeModal];
}