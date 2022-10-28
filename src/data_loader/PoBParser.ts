import { IParser } from "./IParser"
import { buildModifier, ModifierGroup } from "./ModProcessor"
import { Modifier, ParsedItem } from "./ParsedItem"
import { Stat } from "./StatsLoader"

export class PoBParser implements IParser {

    parseItem(rawItem: string, stats: Stat[]): ParsedItem {
        return parseItem(rawItem, stats)
    }

}

const SPECIAL = "(Shaper|Elder|Crusader|Fractured|Veiled|Corrupted)"

function parseItem(item: string, stats: Stat[]): ParsedItem {

    // Workaround to read the last line if the text does not end with \n
    if(item.substring(item.length - 1) != '\n') {
        item += '\n'
    }

    const parsedItem = new ParsedItem()

    const lines = item.split(/\n/)
    lines.pop()

    let nImplicits: number = 0
    let sections: string[][] = [[]]
    lines.reduce((section, line) => {
        if (line.indexOf("Implicits: ") < 0) {
            section.push(line.trim())
            return section
        } else {
            nImplicits = parseInt(line.replace("Implicits: ", ""))
            const section: string[] = []
            sections.push(section)
            return section
        }
    }, sections[0])
    sections = sections.filter(section => section.length)

    parsedItem.description = {
        name: sections[0][1],
        baseItem: sections[0][2]
    }

    const modifiers = sections[1]

    const lastLine = modifiers.at(modifiers.length - 1)
    if(lastLine?.match(SPECIAL)) {
        modifiers.pop()
    }

    parsedItem.mods = _buildModifiers(parsedItem.mods, parsedItem.description.baseItem, nImplicits, modifiers, stats)
    return parsedItem
}

function _buildModifiers(mods: Modifier[], baseItem: string | undefined, nImplicits: number, list: string[], stats: Stat[]): Modifier[] {
    if (mods === undefined) {
        mods = new Array<Modifier>()
    }
    for (let i = 0; i < list.length; i++) {
        let mod = list[i]

        let isEnchant: boolean = false
        if (mod.indexOf("{crafted}") >= 0) {
            mod = mod.replace("{crafted}", "")
            isEnchant = true
            // Workaround for PoB counting enchants as implicit
            if (baseItem !== undefined && baseItem.indexOf('Cluster Jewel') < 0) {
                nImplicits++
            }
        }

        let group = ModifierGroup.Explicit
        if (i < nImplicits) {
            if (isEnchant) {
                group = ModifierGroup.Enchant
            } else {
                group = ModifierGroup.Implicit
            }
        }

        const builtMod = buildModifier(mod, group, stats)
        mods.push(builtMod)
    }
    return mods
}

