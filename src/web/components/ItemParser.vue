<template>
    <p class="display-6 text-center mb-4">Paste your item here</p>
    <form class="mx-auto">
        <textarea id="item-raw" class="form-control" rows="5" v-model="item">
          Rarity: Rare
          Cataclysm Roar
          Opal Sceptre
          --------
          Item Level: 83
          --------
          Sceptre
          Quality: +20%
          Physical Damage: 59-88
          Critical Strike Chance: 6.50%
          Attacks per Second: 1.25
          Weapon Range: 11
          --------
          Requirements:
          Level: 80
          Str: 95
          Int: 151
          --------
          Sockets: B-B-B
          --------
          40% increased Elemental Damage (implicit)
          --------
          +1 to Level of all Spell Skill Gems (fractured)
          +17% to Fire Damage over Time Multiplier
          23% increased Fire Damage
          +1 to Level of all Fire Spell Skill Gems
          29% increased Stun Duration on Enemies
          59% increased Fire Damage (crafted)
          19% chance to Ignite (crafted)
          --------
          Fractured Item
          </textarea>

        <input id="submit-item" class="w-100 btn btn-lg btn-primary" value="Parse" type="button"
            @click="parseItem(item, stats)" />
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { parseItem } from '../../data_loader/IParser';
import { Stat } from '../../data_loader/StatsLoader';
import { ActionTypes } from '../store/actions';
import { MutationTypes } from '../store/mutations'

export default defineComponent({
    name: 'ItemParser',
    data() {
        return {
            item: "" as string,
        }
    },
    methods: {
        parseItem: function (item: string, stats: Array<Stat>): void {
            const parsedItem = parseItem(item, stats)
            this.$store.commit(MutationTypes.SET_PARSED_ITEM, parsedItem)
        }
    },
    computed: {
        stats(): Stat[] {
            return this.$store.getters.stats
        }
    },
    created() {
        this.$store.dispatch(ActionTypes.GET_STATS)
        this.item = "Rarity: RARE\n" +
            "Dragon Touch\n" +
            "Wyrmscale Gauntlets\n" +
            "Armour: 150\n" +
            "ArmourBasePercentile: 1\n" +
            "Evasion: 150\n" +
            "EvasionBasePercentile: 1\n" +
            "Unique ID: da76174b46c0a3c4e231b3a75079645557bea17b715ff6e7d5f2aee2b0cd0822\n" +
            "Item Level: 85\n" +
            "Quality: 20\n" +
            "Sockets: G-G-G-G\n" +
            "LevelReq: 70\n" +
            "Implicits: 2\n" +
            "{crafted}Ice Spear fires an additional Projectile\n" +
            "Inflict Cold Exposure on Hit, applying -12% to Cold Resistance\n" +
            "While a Unique Enemy is in your Presence, 55% chance to Unnerve Enemies for 4 seconds on Hit\n" +
            "Adds 3 to 5 Physical Damage to Attacks\n" +
            "14% increased Attack Speed\n" +
            "22% increased Global Critical Strike Chance\n" +
            "24% increased Armour and Evasion\n" +
            "+46% to Cold Resistance\n" +
            "11% increased Stun and Block Recovery\n" +
            "33% increased Damage with Hits against Chilled Enemies\n" +
            "Adds 25 to 31 Chaos Damage if you've dealt a Critical Strike Recently\n" +
            "{crafted}+62 to maximum Life"
    },
})
</script>