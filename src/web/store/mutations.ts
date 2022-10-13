import { MutationTree } from 'vuex'
import { ParsedItem } from '../../data_loader/ParsedItem'
import { Stat } from "../../data_loader/StatsLoader"
import { State } from "./state"

export enum MutationTypes {
    SET_STATS = 'SET_STATS',
    SET_PARSED_ITEM = 'SET_PARSED_ITEM',
    SET_RESPONSE = 'SET_RESPONSE',
}

export type Mutations<S = State> = {
    [MutationTypes.SET_STATS](state: S, payload: Stat[]): void
    [MutationTypes.SET_PARSED_ITEM](state: S, payload: ParsedItem): void
    [MutationTypes.SET_RESPONSE](state: S, payload: string): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_STATS](state, payload: Stat[]) {
        state.stats = payload
    },
    [MutationTypes.SET_PARSED_ITEM](state, payload: ParsedItem) {
        state.parsedItem = payload
    },
    [MutationTypes.SET_RESPONSE](state, payload: string) {
        state.response = payload 
    }
}