import { PoeNinjaParser } from '../data_loader/PoeNinjaParser'
import { Requests } from '../data_loader/PoeRequests'

test('testing parser', async () => {
    const stats = await Requests.getStats().then(response => { return response })
    const parsedItem = new PoeNinjaParser().parseItem("Rarity: Rare\n" +
        "Maelström Strike\n" +
        "Spine Bow\n" +
        "--------\n" +
        "Item Level: 83\n" +
        "--------\n" +
        "Bow\n" +
        "Quality: +30%\n" +
        "Physical Damage: 38-115\n" +
        "Critical Strike Chance: 8.25%\n" +
        "Attacks per Second: 1.68\n" +
        "--------\n" +
        "Requirements:\n" +
        "Level: 80\n" +
        "Str: 62\n" +
        "Dex: 212\n" +
        "Int: 159\n" +
        "--------\n" +
        "Sockets: G-W-W-W-B-B\n" +
        "--------\n" +
        "Quality does not increase Physical Damage (enchant)\n" +
        "1% increased Attack Speed per 8% Quality (enchant)\n" +
        "--------\n" +
        "Socketed Gems are supported by Level 18 Cast On Critical Strike\n" +
        "143% increased Spell Damage\n" +
        "17% increased Attack Speed\n" +
        "+34% to Global Critical Strike Multiplier\n" +
        "Damage Penetrates 12% Elemental Resistances\n" +
        "27% increased Critical Strike Chance (crafted)\n" +
        "--------\n" +
        "Shaper Item\n", stats)

    console.log(parsedItem.mods)
})