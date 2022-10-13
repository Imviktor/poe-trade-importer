import { state, State } from "./state"
import { GetterTree } from 'vuex'
import { Stat } from "../../data_loader/StatsLoader"
import { ParsedItem } from "../../data_loader/ParsedItem"

export type Getters = {
    stats(state: State): Stat[],
    parsedItem(state: State): ParsedItem,
    response(state: State): string,
}

export const getters: GetterTree<State, State> & Getters = {
    stats: (state) => {
        return state.stats
    },
    parsedItem: (state) => {
        return state.parsedItem
    },
    response: (state) => {
        return state.response
    },
}