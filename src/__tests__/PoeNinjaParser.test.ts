import { PoeNinjaParser } from '../data_loader/PoeNinjaParser'
import { Requests } from '../data_loader/PoeRequests'

test('testing parser', async () => {
    const stats = await Requests.getStats().then(response => { return response })
    const parsedItem = new PoeNinjaParser().parseItem("Rarity: Rare\n" +
                "Rune Volley\n" +
                "Synthesised Spine Bow\n" +
                "--------\n" +
                "Item Level: 87\n" +
                "--------\n" +
                "Bow\n" +
                "Quality: +30%\n" +
                "Physical Damage: 277-660\n" +
                "Elemental Damage: 199-326\n" +
                "Critical Strike Chance: 6.50%\n" +
                "Attacks per Second: 1.58\n" +
                "--------\n" +
                "Requirements:\n" +
                "Level: 78\n" +
                "Str: 155\n" +
                "Dex: 212\n" +
                "Int: 123\n" +
                "--------\n" +
                "Sockets: W-W-W-W-W-W\n" +
                "--------\n" +
                "Bow Attacks fire an additional Arrow (implicit)\n" +
                "Item sells for much more to vendors (implicit)\n" +
                "--------\n" +
                "192% increased Physical Damage\n" +
                "Adds 48 to 90 Physical Damage\n" +
                "Adds 199 to 326 Cold Damage\n" +
                "Bow Attacks fire 2 additional Arrows\n" +
                "14% chance to deal Double Damage\n" +
                "13% increased Attack Speed (crafted)\n" +
                "--------\n" +
                "Synthesised Item\n", stats)

    console.log(parsedItem.mods)
})