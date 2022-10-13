class StatsResult {
    result!: Entries[]
}

class Entries {
    label!: string
    entries!: Stat[]
}

export class Stat {
    id!: string
    text!: string
    type!: string
    option?: Options
    regexp!: string
}

export class Options {
    options!: Option[]
}

export class Option {
    id!: string
    text!: string
}

export function processStats(stats: StatsResult): Stat[] {
    const statList: Stat[] = []
    for (const entries of stats.result) {
        if (entries.label != 'Scourge') {
            if (entries.label == 'Pseudo') {
                _preparePseudos(entries.entries).forEach(s => statList.push(s))
            } else {
                for (const entry of entries.entries) {

                    // Replace before escaping
                    entry.regexp = entry.text
                        .replace('an additional', '# additional')
                        .replace(' (Local)', '')

                    // Escape and replace to get the regepx 
                    entry.regexp = _escapeRegexChars(entry.regexp)
                        .replace('#%', '([\-\+\.0-9]{2,}|[0-9]+)%')
                        .replace('# to #', '([\.0-9]+) to #')
                        .replace('#', '(.*)')
                    entry.regexp = '^' + entry.regexp + '$'
                    statList.push({
                        id: entry.id,
                        text: entry.text,
                        type: entry.type,
                        regexp: entry.regexp,
                        option: entry.option
                    })
                }
            }
        }
    }
    return statList
}

function _escapeRegexChars(text: String): String {
    const specialChars = ["\\", ".", "[", "]", "{", "}", "(", ")", "<", ">", "*", "+", "-", "=", "!", "?", "^", "$", "|"]
    for (const escape of specialChars) {
        if (text.indexOf(escape) != -1) {
            text = text.replaceAll(escape, "\\" + escape)
        }
    }
    return text;
}

function _preparePseudos(pseudoStats: Stat[]): Stat[] {
    let finalPseudoStats: Stat[] = []
    for (const stat of pseudoStats) {
        stat.regexp = _escapeRegexChars(stat.text).replace('#', '(.*)')
        finalPseudoStats.push({
            id: stat.id,
            text: stat.text,
            type: stat.type,
            regexp: stat.regexp,
            option: stat.option
        })
    }
    return []
}

