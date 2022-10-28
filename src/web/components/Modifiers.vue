<template>
    <p class="display-6 text-center mb-4">Modifiers</p>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="maxEnabled" v-model="maxEnabled"
            @change="maxEnabledChanged()">
        <label class="form-check-label" for="maxEnabled">
            Enable min-max
        </label>
    </div>
    <div class="form-check">
        <label for="modRange" class="form-label">Mod range: {{range}}</label>
        <input type="range" class="form-range" id="modRange" min="0" max="25" step="5" v-model="range"
            @change="maxEnabledChanged()">
    </div>
    <template v-for="(mod,i) in mods" :key="mod.itemMod">
        <div class="d-flex">
            <input class="form-check-input" type="checkbox" v-model="mod.selected" />
            <p :class="'mx-3 p-1 fst-italic text-center fw-bold item-' + mod.variants[mod.selectedVariant].type">
                {{mod.variants[mod.selectedVariant].type.toUpperCase()}}
            </p>
            <p class="me-auto">{{mod.itemMod}}</p>
            <!-- Numeric argument -->
            <input type="text" class="input-stretch my-auto form-control form-control-sm bg-dark text-white"
                placeholder="min" v-model="mod.valueMin" v-if="isNumericArg(mod)" />
            <input :type="maxEnabled ? 'text': 'hidden'"
                class="input-stretch my-auto form-control form-control-sm bg-dark text-white" placeholder="max"
                :value="mod.valueMax" :disabled="!maxEnabled" v-if="isNumericArg(mod)" />
            <!-- Text argument -->
            <div v-if="isTextArg(mod)">
                <input type="text" class="form-control form-control-sm bg-dark text-white" placeholder="min"
                    v-model="mod.arg.value" readonly />
            </div>
            <!-- Options argument -->
            <div v-if="isTextWithOptionsArg(mod)">
                <select class="form-select form-select-sm bg-dark text-white" :value="mod.arg.value">
                    <option v-for="opt in mod.arg.options" :value="opt.text" :selected="opt.text == mod.arg.value">
                        {{opt.text}}
                    </option>
                </select>
            </div>
            <select class="m-2 form-select-sm bg-dark text-white" style="width: 13%;" v-model="mod.selectedVariant"
                :disabled="mod.variants.length ==1">
                <option v-for="(variant, j) in mod.variants" :key="variant.type" :value="j" :title="variant.id">
                    {{variant.type}}
                </option>
            </select>
        </div>
    </template>
    <input id="search-item" class="btn btn-lg btn-primary" type="button" value="Buscar" @click="prepareRequest(mods)"
        v-if="mods.length > 0" />
    <div class="container mx-auto">
        <p class="display-4 text-center mb-4"> Link </p>
        <a class="mx-auto" :href="'https://www.pathofexile.com/trade/search/Kalandra/' + response" v-if="response != ''"
            target="_blank">Search Link</a>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AugmentedModifier, ParsedItem } from '../../data_loader/ParsedItem';
import { Requests } from '../../data_loader/PoeRequests';
import { createRequest } from '../../data_loader/SearchRequest';


export default defineComponent({
    name: 'Modifiers',
    data: function (): {
        mods: AugmentedModifier[],
        range: number,
        response: string,
        maxEnabled: boolean,
    } {
        return {
            mods: [],
            range: 10,
            response: '',
            maxEnabled: false,
        }
    },
    methods: {
        prepareRequest: function (mods: AugmentedModifier[]): void {
            const requestMods = Object.values(mods).filter(am => am.selected)
            const req = createRequest(requestMods)
            Requests.search(req).then(r =>
                this.response = r.id
            )
        },
        maxEnabledChanged: function (): void {
            for (const mod of this.mods) {
                const arg = mod.arg
                if (arg && arg.isNumeric) {
                    const val = parseFloat(arg.value)
                    mod.valueMin = Math.floor((arg.isNegative ? -1 : 1) * val / (1 + (this.range / 100)))
                    mod.valueMin = mod.valueMin == 0 ? 1 : mod.valueMin
                    if (this.maxEnabled) {
                        mod.valueMax = Math.ceil((arg.isNegative ? -1 : 1) * val * (1 + (this.range / 100)))
                    } else {
                        mod.valueMax = -1
                    }
                }
            }
        },
        isNumericArg: function (mod: AugmentedModifier): boolean {
            return mod.arg.isNumeric
        },
        isTextArg: function (mod: AugmentedModifier): boolean {
            return mod.arg.value != '' && mod.arg.options === undefined
        },
        isTextWithOptionsArg: function (mod: AugmentedModifier): boolean {
            return mod.arg.value != '' && mod.arg.options !== undefined && mod.arg.options.length > 0
        }

    },
    created() {
        this.$store.watch(() => {
            return this.$store.getters.parsedItem
        }, (value: ParsedItem) => {
            this.mods = []
            for (const mod of value.mods) {
                let min = 0
                let max = 0
                const arg = mod.arg
                if (arg && arg.isNumeric) {
                    const val = parseFloat(arg.value)
                    min = Math.floor((arg.isNegative ? -1 : 1) * val / (1 + (this.range / 100)))
                    min = min == 0 ? 1 : min
                    if (this.maxEnabled) {
                        max = Math.ceil((arg.isNegative ? -1 : 1) * val * (1 + (this.range / 100)))
                    } else {
                        max = Number.NaN
                    }
                }

                let selectedVariant = 0
                if (mod.variants && mod.variants.length > 0) {
                    selectedVariant = 0
                }

                const augmented = new AugmentedModifier(mod, selectedVariant, min, max)
                this.mods.push(augmented)
            }
        }, { deep: true })
    },
})
</script>

<style>
.item-fractured {
    background-color: #a29162;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}

.item-pseudo {
    background-color: #232420;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}

.item-enchant {
    background-color: #8b579c;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}


.item-implicit {
    background-color: #65621e;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}

.item-veiled {
    background-color: #545c63;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}

.item-crafted {
    background-color: #0060bf;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}

.item-scourge {
    background-color: #ff6e25;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}

.item-explicit {
    background-color: #626468;
    font-size: 0.75rem;
    min-width: 75px;
    width: 10%;
}

.input-stretch {
    width: 7% !important;
}
</style>