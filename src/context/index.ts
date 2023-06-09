import {createContext} from "react";
import {Config, Operation} from "../types";

export const GlobalContext = createContext<{
    openModal?: () => void
    closeModal?: () => void
    toggleMode?: (mode: string) => void
}>({})