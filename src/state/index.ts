import {atom} from 'jotai'
import {Config} from "../types";

const configAtom = atom<Config | NonNullable<unknown>>({});

export {configAtom};