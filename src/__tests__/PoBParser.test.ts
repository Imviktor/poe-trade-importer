import { PoBParser } from '../data_loader/PoBParser'
import { Requests } from '../data_loader/PoeRequests'

test('testing parser', async () => {
    const stats = await Requests.getStats().then(response => {return response})
    const parsedItem = new PoBParser().parseItem("Rarity: RARE\n" +
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
    "Adds 3 to 5 Physical Damage to Attacks\n" +
    "14% increased Attack Speed\n" +
    "22% increased Global Critical Strike Chance\n" +
    "24% increased Armour and Evasion\n" +
    "+46% to Cold Resistance\n" +
    "11% increased Stun and Block Recovery\n" +
    "33% increased Damage with Hits against Chilled Enemies\n" +
    "Adds 25 to 31 Chaos Damage if you've dealt a Critical Strike Recently\n" +
    "{crafted}+62 to maximum Life", stats)

    console.log(parsedItem.mods)
})