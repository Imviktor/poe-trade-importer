import { PoeNinjaParser } from '../data_loader/PoeNinjaParser'
import { Requests } from '../data_loader/PoeRequests'

test('testing parser', async () => {
    const stats = await Requests.getStats().then(response => { return response })
    const parsedItem = new PoeNinjaParser().parseItem("Rarity: Rare\n" +
    "Vortex Wrap\n" +
    "Astral Plate\n" +
    "--------\n" +
    "Item Level: 85\n" +
    "--------\n" +
    "Quality: +20%\n" +
    "Armour: 804\n" +
    "--------\n" +
    "Requirements:\n" +
    "Level: 80\n" +
    "Str: 180\n" +
    "Dex: 98\n" +
    "Int: 111\n" +
    "--------\n" +
    "Sockets: R-R-G-R-B-R\n" +
    "--------\n" +
    //"Quality does not increase Defences (enchant)\n" +
    //"Grants +1 to Maximum Life per 2% Quality (enchant)\n" +
    // "--------\n" +
    // "+12% to all Elemental Resistances (implicit)\n" +
    // "--------\n" +
    // "Socketed Attacks have -15 to Total Mana Cost\n" +
    // "+36 to Armour\n" +
    // "23% increased Stun and Block Recovery\n" +
    "You can apply an additional Curse\n" +
    "Attacks have +1.4% to Critical Strike Chance\n" +
    "+82 to maximum Life (crafted)\n" +
    "--------\n" +
    "Hunter Item\n" +
    "Warlord Item\n", stats)

    console.log(parsedItem.mods)
})