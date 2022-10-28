import { Argument, Modifier, ModVariant } from "./ParsedItem";
import { Stat } from "./StatsLoader";

export enum ReplacementOperation {
    None,
    Negative
}

export enum ModifierGroup {
    Enchant = 'enchant',
    Implicit = 'implicit',
    Explicit = 'explicit',
}

export class Replacement {
    replacement: string
    operation: ReplacementOperation

    constructor(replacement: string)
    constructor(replacement: string, operation: ReplacementOperation)
    constructor(replacement: string, operation?: ReplacementOperation) {
        this.replacement = replacement
        this.operation = operation !== undefined ? operation : ReplacementOperation.None
    }

}

export class ProcessedMod {
    original: string
    replaced: string
    operation: ReplacementOperation

    constructor(original: string, replaced: string)
    constructor(original: string, replaced: string, operation: ReplacementOperation)
    constructor(original: string, replaced: string, operation?: ReplacementOperation) {
        this.original = original
        this.replaced = replaced
        this.operation = operation !== undefined ? operation : ReplacementOperation.None;
    }
}

const replacements: { [index: string]: Replacement; } = {
    'reduced': new Replacement('increased', ReplacementOperation.Negative),
    'Curse': new Replacement('Curses'),
    'fire an additional Arrow': new Replacement('fire an additional Arrows')
}


export function buildModifier(rawMod: string, type: ModifierGroup, stats: Stat[]): Modifier {
    const replacedMod = _modTextReplacements(rawMod)

    // Filter by type
    let matchedStats: Stat[] = []
    switch (type) {
        case ModifierGroup.Enchant:
            matchedStats = Object.values(stats).filter(s => s.type == ModifierGroup.Enchant)
            break
        case ModifierGroup.Implicit:
            matchedStats = Object.values(stats).filter(s => s.type == ModifierGroup.Implicit)
            break
        case ModifierGroup.Explicit:
            matchedStats = Object.values(stats).filter(s => s.type != ModifierGroup.Implicit && s.type != ModifierGroup.Enchant)
    }

    // Get the stats that matches the regexp of the raw modifier
    matchedStats = Object.values(matchedStats).filter(s => new RegExp(s.regexp, 'gi').test(replacedMod.replaced))

    if (matchedStats.length == 0) {
        console.log(`cannot find any matching stat for the modifier ${rawMod} `)
        return new Modifier(replacedMod.replaced, [], new Argument(''))
    }

    /*
     * A variant is the same modifier defined in multiple types (fractured, veiled, etc).
     * valid only for explicit modifiers.
     */
    const modVariants: ModVariant[] = []
    for (const match of matchedStats) {
        modVariants.push(new ModVariant(match.id, match.type))
    }

    const matchedStat = matchedStats[0]
    const arg = _extractArguments(replacedMod, matchedStat)

    return new Modifier(matchedStat.text, modVariants, arg)

}

function _extractArguments(processedMod: ProcessedMod, matchedStat: Stat): Argument {
    // We are only interested in the first stat. The others are identical in content
    const m = processedMod.replaced.match(matchedStat.regexp)
    if (m) {
        // First match is the full test. Second and following matches are the capturing groups
        if (m.length == 2) {
            const capturedArg = m[1]
            // If there is only one argument first check if it belongs to an option inside the stat. Normally, 
            // when this happens there is only one matched stat therefore just checking the first stat is enough
            if (matchedStat.option !== undefined) {
                return Argument.withOptions(capturedArg, matchedStat.option.options)
            }
            const isNegative = processedMod.operation == ReplacementOperation.Negative ? true : false
            return new Argument(capturedArg, isNegative)
            // The regexp captured more than one argument. Normally this happens to modifiers of kind 'adds # to #'.
            // The PoE Trade does not allow to arguments but the arithmetical mean of both values
        } else if (m.length > 2) {
            let argMean: number = 0
            for (let i = 1; i < m.length; i++) {
                let capturedArg = m[i]
                const value = parseFloat(capturedArg)
                if (!Number.isNaN(capturedArg)) {
                    argMean += value
                }
            }
            argMean /= (m.length - 1)
            return new Argument(argMean.toString())
        } else {
            return new Argument('')
        }
    } else {
        return new Argument('')
    }
}


// This function translates modifiers that the object has but they would not match with
// any 'official' stats. Some replacements must be done
export function _modTextReplacements(mod: string): ProcessedMod {
    let replaced = mod;
    const replacement = Object.keys(replacements).filter(k => mod.indexOf(k) != -1)
    if (replacement.length > 0) {
        const r = replacement[0]
        replaced = mod.replace(r, replacements[r].replacement)
        return new ProcessedMod(mod, replaced, replacements[r].operation)
    }
    return new ProcessedMod(mod, mod)
}