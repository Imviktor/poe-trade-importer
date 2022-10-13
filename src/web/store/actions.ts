import { State } from "./state"
import { Stat } from "../../data_loader/StatsLoader"
import { Mutations, MutationTypes } from "./mutations"
import { ActionTree, ActionContext } from 'vuex'
import { ParsedItem } from "../../data_loader/ParsedItem"
import { Requests } from "../../data_loader/PoeRequests"
import { Request } from "../../data_loader/SearchRequest"


export enum ActionTypes {
    GET_STATS = 'GET_STATS',
    GET_PARSED_ITEM = 'GET_PARSED_ITEM',
    GET_RESPONSE = 'GET_RESPONSE',
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
    [ActionTypes.GET_STATS](
        { commit }: AugmentedActionContext,
        payload: Stat[]
    ): Promise<Stat[]>,
    [ActionTypes.GET_PARSED_ITEM](
        { commit }: AugmentedActionContext,
        payload: ParsedItem
    ): ParsedItem
    [ActionTypes.GET_RESPONSE](
        { commit }: AugmentedActionContext,
        payload: Request
    ): Promise<string>
}

export const actions: ActionTree<State, State> & Actions = {
    [ActionTypes.GET_STATS]({ commit }) {
        return new Promise((resolve) => {
            Requests.getStats().then(response => {
                commit(MutationTypes.SET_STATS, response)
                return resolve(response)
            })
        })
    },
    [ActionTypes.GET_PARSED_ITEM]({ commit }, payload) {
        commit(MutationTypes.SET_PARSED_ITEM, payload)
        return payload
    },
    [ActionTypes.GET_RESPONSE]({ commit }, request: Request) {
        return new Promise((resolve) => {
            Requests.search(request).then(response => {
                if (response) {
                    commit(MutationTypes.SET_RESPONSE, response.id)
                    return resolve(response.id)
                }
                return resolve('')
            })
        })
    },
}