import { ParsedItem } from "./ParsedItem"
import { PoBParser } from "./PoBParser"
import { PoeNinjaParser } from "./PoeNinjaParser"
import { Stat } from "./StatsLoader"


export interface IParser {
    parseItem: (rawItem: string, stats: Stat[]) => ParsedItem
}

export function parseItem(rawItem: string, stats: Stat[]): ParsedItem {
    if (rawItem.indexOf("--------") != -1) {
        return new PoeNinjaParser().parseItem(rawItem, stats)
    } else {
        return new PoBParser().parseItem(rawItem, stats)
    }
}
