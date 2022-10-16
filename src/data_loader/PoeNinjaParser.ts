
import { IParser } from "./IParser"
import { buildModifier, ModifierGroup } from "./ModProcessor"
import { Argument, Modifier, ParsedItem } from "./ParsedItem"
import { Stat } from "./StatsLoader"

enum Sections {
  ItemDescription = 'Rarity: (.*)',
  ItemLevel = 'Item Level: ([0-9]{0,2})',
  ItemRequirement = 'Requirements:',
  ItemStats = '',
  Quality = 'Quality\\s?(.*): (\\+[0-9]{1,2}%).*',
  Sockets = 'Sockets: (.*)',
  EnchantModifiers = '(.*)\\s\\(enchant\\)',
  ImplicitModifiers = '(.*)\\s\\(implicit\\)',
  ExplicitModifiers = '',
  Special = '(Shaper|Elder|Crusader|Fractured|Veiled|Corrupted)( Item)?',
  Radius = 'Radius: (Small|Medium|Large|Variable)',
  Unknown = 'Unknown'
}

export class PoeNinjaParser implements IParser {
  parseItem(rawItem: string, stats: Stat[]): ParsedItem {
    return _parseItem(rawItem, stats)
  }

}

function _parseItem(item: string, stats: Stat[]): ParsedItem {

  const parsedItem = new ParsedItem()

  const lines = item.split(/\r?\n/)
  lines.pop()

  let sections: string[][] = [[]]
  lines.reduce((section, line) => {
    if (line.trim() !== '--------') {
      section.push(line.trim())
      return section
    } else {
      const section: string[] = []
      sections.push(section)
      return section
    }
  }, sections[0])
  sections = sections.filter(section => section.length)

  let previousGroup: string = 'Unknown';
  let currentGroup: string = 'Unknown';

  for (let section of sections) {
    const header = section[0];
    currentGroup = _identifySection(header)

    switch (currentGroup) {
      case 'ItemDescription':
        break;
      case 'ItemLevel':
        break;
      case 'ItemRequirement':
        break;
      case 'Quality':
        break;
      case 'Sockets':
        break;
      case 'EnchantModifiers':
        parsedItem.mods = _buildModifiers(parsedItem.mods, section, ModifierGroup.Enchant, stats)
        break;
      case 'ImplicitModifiers':
        parsedItem.mods = _buildModifiers(parsedItem.mods, section, ModifierGroup.Implicit, stats)
        break;
      case 'Special':
        break;
      case 'Radius':
        break;
      case 'Unknown':
        if (previousGroup === 'ItemLevel') {
          currentGroup = 'ItemStats'
        } else if (previousGroup === 'ImplicitModifiers' ||
          previousGroup === 'EnchantModifiers' ||
          previousGroup === 'Sockets' ||
          previousGroup === 'ItemRequirement' ||
          previousGroup === 'Radius') {
          parsedItem.mods = _buildModifiers(parsedItem.mods, section, ModifierGroup.Explicit, stats)
        }
        break;
      default:
    }
    previousGroup = currentGroup
  }
  return parsedItem
}

function _identifySection(header: string): string {
  for (const e in Sections) {
    const text = Sections[e as keyof typeof Sections]
    const regexp = new RegExp(text, 'gi')
    if (text != '' && regexp.test(header)) {
      return e
    }
  }

  return 'Unknown'
}

function _buildModifiers(mods: Modifier[], list: string[], type: ModifierGroup, stats: Stat[]): Modifier[] {
  if (mods === undefined) {
    mods = new Array<Modifier>()
  }
  for (let mod of list) {

    // Replace type mentioned in the mod
    mod = mod.replace(" (implicit)", "")
      .replace(" (enchant)", "")
      .replace(" (crafted)", "")
      .replace(" (fractured)", "")
      .replace(" (veiled)", "")

    const builtMod = buildModifier(mod, type, stats)
    mods.push(builtMod)
  }
  return mods
}