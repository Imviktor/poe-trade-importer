import axios from "axios";
import { AugmentedModifier } from "./ParsedItem";

export class Request {
    query: Query
    sort: any


    constructor(query: Query) {
        this.query = query
        this.sort = {
            'price': 'asc'
        }
    }

}

export class Response {
    id!: string
}

export class Operators {
    type: string
    filters: StatsFilter[]

    constructor(filters: StatsFilter[]) {
        this.type = 'and'
        this.filters = filters
    }

}

export class Query {
    status: any
    stats: Operators[]

    constructor(operators: Operators[]) {
        this.status = {
            'option': 'online'
        }
        this.stats = operators
    }

}

export class StatsFilter {
    id: string
    value: StatsValue
    disabled: boolean

    constructor(id: string, value: StatsValue, disabled: boolean) {
        this.id = id
        this.value = value
        this.disabled = disabled
    }

}

export class StatsValue {
    min?: number
    max?: number
    value?: string
}

export function createRequest(modifiers: AugmentedModifier[]): Request {

    const statFilters: StatsFilter[] = []
    for (const mod of modifiers) {
        const statsValue = {
            min: mod.valueMin,
            max: mod.valueMax
        }
        statFilters.push(new StatsFilter(mod.variants[mod.selectedVariant].id, statsValue, false));
    }

    return new Request(new Query(new Array<Operators>(new Operators(statFilters))))
}