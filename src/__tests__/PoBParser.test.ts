import { PoBParser } from '../data_loader/PoBParser'
import { Requests } from '../data_loader/PoeRequests'

test('testing parser', async () => {
    const stats = await Requests.getStats().then(response => {return response})
    const parsedItem = new PoBParser().parseItem("Rarity: RARE\n" +
    "Maelstrom Creed\n" +
    "Medium Cluster Jewel\n" +
    "Unique ID: fd802584af12d08145a0ad71ca302282352a9b6d66477c434d3aa34db5ad83ab\n" +
    "Item Level: 83\n" +
    "LevelReq: 40\n" +
    "Implicits: 3\n" +
    "{crafted}Adds 4 Passive Skills\n" +
    "{crafted}1 Added Passive Skill is a Jewel Socket\n" +
    "{crafted}Added Small Passive Skills grant: 10% increased Projectile Damage\n" +
    "Added Small Passive Skills also grant: +3% to Chaos Resistance\n" +
    "1 Added Passive Skill is Eye to Eye\n" +
    "1 Added Passive Skill is Repeater          ", stats)

    console.log(parsedItem.mods)
})