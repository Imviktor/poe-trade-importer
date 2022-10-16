import { Option } from '../data_loader/StatsLoader'

export class ParsedItem {
    description?: ItemDescription
    itemLevel?: string
    basicStats?: ItemStats
    quality?: string
    requirements?: ItemRequirements
    sockets?: string
    mods!: Array<Modifier>
    special?: string
    radius?: string
    unknown?: string[]
}

export class ItemDescription {
    rarity?: string
    name?: string
    baseItem?: string
}

export class ItemStats {
    category?: string
    quality?: string
    physicalDamage?: string
    elementalDamage?: string
    critStrikeChange?: string
    attacksPerSecond?: string
    weaponRange?: string
}

export class ItemRequirements {
    level?: string
    strength?: string
    intelligence?: string
    dexterity?: string
}

export class Modifier {
    itemMod: string
    variants: ModVariant[]
    arg: Argument

    constructor(itemMod: string, modVariants: ModVariant[], arg: Argument) {
        this.itemMod = itemMod
        this.variants = modVariants
        this.arg = arg
    }

}

export class ModVariant {
    id: string
    type: string

    constructor(id: string, type: string) {
        this.id = id
        this.type = type
    }

}

export class Argument {
    value: string
    options: Option[]
    isNegative: boolean
    isNumeric: boolean

    constructor(value: string)
    constructor(value: string, isNegative: boolean)
    constructor(value: string, isNegative: boolean, options: Option[])
    constructor(value: string, isNegative?: boolean, options?: Option[]) {
        value = value == 'an' ? '1' : value
        this.isNegative = isNegative !== undefined ? isNegative : false
        this.isNumeric = new RegExp('^[\-\+]?[\.0-9]+$', 'gi').test(value)
        this.options = options !== undefined ? options : []
        this.value = value
    }

    static withOptions(value: string, options: Option[]): Argument {
        return new Argument(value, false, options)
    }

}

export class AugmentedModifier {
    itemMod: string
    selectedVariant: number
    variants: ModVariant[]
    arg: Argument
    options?: string[]
    valueMin?: number
    valueMax?: number
    selected?: boolean

    constructor(mod: Modifier, selectedVariant: number, valueMin?: number, valueMax?: number, selected?: boolean) {
        this.itemMod = mod.itemMod
        this.selectedVariant = selectedVariant
        this.variants = mod.variants
        this.arg = mod.arg
        this.valueMin = valueMin
        this.valueMax = valueMax
        this.selected = selected !== undefined ? selected : true
    }

}