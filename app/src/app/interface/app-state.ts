import { dataState } from "../enum/data-state";

export interface AppState<T>{
    dataState: dataState,
    appData?: T,
    error?: string
}