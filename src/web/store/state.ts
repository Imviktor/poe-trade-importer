import { ParsedItem } from "../../data_loader/ParsedItem"
import { Stat } from "../../data_loader/StatsLoader"

export const state = {
    stats: new Array<Stat>(),
    parsedItem: {} as ParsedItem,
    response: '' as string
}

export type State = typeof state