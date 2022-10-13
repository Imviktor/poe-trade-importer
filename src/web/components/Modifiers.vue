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
    <div class="list-group">
        <a href="#" v-for="(mod,i) in mods" :key="mod.itemMod"
            class="list-group-item list-group-item-action flex-column align-items-start bg-dark text-white">
            <div class="d-flex justify-content-between form-check">
                <div>
                    <input class="form-check-input" type="checkbox" value="" :id="'modCheck' + i"
                        :checked="selectedMods[i]" @change="checkMod(selectedMods, i, $event)" />
                    <label :class="'form-check-label mb-1' + (mod.arg.isNumeric? 'w-75': 'w-50')" :for="'modCheck' + i">
                        <p>{{mod.itemMod}}</p>
                    </label>
                </div>
                <!-- Numeric argument -->
                <div class="input-stretch input-group mb-3" v-if="isNumericArg(mod)">
                    <input type="text" class="form-control form-control-sm bg-dark text-white" placeholder="min"
                        :value="mod.valueMin" />
                    <input :type="maxEnabled ? 'text': 'hidden'" class="form-control form-control-sm bg-dark text-white"
                        placeholder="max" :value="mod.valueMax" :disabled="!maxEnabled" />
                </div>
                <!-- Text argument -->
                <div class="input-stretch input-group mb-3 w-50" v-if="isTextArg(mod)">
                    <input type="text" class="form-control form-control-sm bg-dark text-white" placeholder="min"
                        :value="mod.arg.value" readonly />
                </div>
                <!-- Options argument -->
                <div class="input-stretch input-group mb-3 w-50" v-if="isTextWithOptionsArg(mod)">
                    <select class="form-select form-select-sm bg-dark text-white" :value="mod.arg.value">
                        <option v-for="opt in mod.arg.options" :value="opt.text" :selected="opt.text == mod.arg.value">
                            {{opt.text}}
                        </option>
                    </select>
                </div>
            </div>
            <div class="btn-group" aria-label="Variants">
                <template v-for="(variant,j) in mod.modVariants" :key="variant.id" v-if="mod.modVariants.length > 1">
                    <input type="radio" class="btn-check" :name="'btn-radio' + i" :id="'v' + i + '-' + j"
                        autocomplete="off" :checked="j==0" v-model="mod.selectedVariantId" :value="variant.id" />
                    <label class="btn" :for="'v' + i + '-' + j">
                        <p :class="'mb-1 p-1 fst-italic fw-bold item-' + variant.type">
                            {{variant.type.toUpperCase()}}
                        </p>
                    </label>
                </template>
            </div>
        </a>
    </div>
    <input id="search-item" class="btn btn-lg btn-primary" type="button" value="Buscar" @click="prepareRequest(mods)"
        v-if="mods.length > 0" />
    <div class="container mx-auto">
        <p class="display-4 text-center mb-4"> Link </p>
        <a class="mx-auto" :href="'https://www.pathofexile.com/trade/search/Kalandra/' + response" v-if="response != ''"
            target="_blank">Search Link</a>
    </div>
</template>

<script lang="ts">
import { Modifier } from '@popperjs/core';
import { defineComponent } from 'vue';
import { AugmentedModifier, ParsedItem } from '../../data_loader/ParsedItem';
import { Requests } from '../../data_loader/PoeRequests';
import { createRequest } from '../../data_loader/SearchRequest';


export default defineComponent({
    name: 'Modifiers',
    data: function (): {
        mods: AugmentedModifier[],
        selectedMods: boolean[],
        range: number,
        response: string,
        maxEnabled: boolean,
    } {
        return {
            mods: [],
            selectedMods: [],
            range: 10,
            response: '',
            maxEnabled: false,
        }
    },
    methods: {
        checkMod: function (selectedMods: boolean[], i: number, e: Event): void {
            selectedMods[i] = (e.target as HTMLInputElement).checked;
        },
        prepareRequest: function (mods: AugmentedModifier[]): void {
            const modsToEvaluate: AugmentedModifier[] = []
            for (const i in this.selectedMods) {
                if (this.selectedMods[i]) {
                    modsToEvaluate.push(mods[i])
                }
            }
            const req = createRequest(modsToEvaluate)
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
            this.selectedMods = []
            for (const mod of value.mods) {
                this.selectedMods.push(true)
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

                let selectedVariantId = ''
                if (mod.modVariants && mod.modVariants.length > 0) {
                    selectedVariantId = mod.modVariants[0].id
                }

                const augmented = new AugmentedModifier(mod, selectedVariantId, min, max)
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
    width: 15%;
}

.item-pseudo {
    background-color: #232420;
    font-size: 0.75rem;
    min-width: 75px;
    width: 15%;
}

.item-enchant {
    background-color: #8b579c;
    font-size: 0.75rem;
    min-width: 75px;
    width: 15%;
}


.item-implicit {
    background-color: #65621e;
    font-size: 0.75rem;
    min-width: 75px;
    width: 15%;
}

.item-veiled {
    background-color: #545c63;
    font-size: 0.75rem;
    min-width: 75px;
    width: 15%;
}

.item-crafted {
    background-color: #0060bf;
    font-size: 0.75rem;
    min-width: 75px;
    width: 15%;
}

.item-scourge {
    background-color: #ff6e25;
    font-size: 0.75rem;
    min-width: 75px;
    width: 15%;
}

.item-explicit {
    background-color: #626468;
    font-size: 0.75rem;
    min-width: 75px;
    width: 15%;
}

.input-stretch {
    width: 15% !important
}
</style>