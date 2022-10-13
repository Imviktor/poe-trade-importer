import { Requests } from "../data_loader/PoeRequests"

test('testing parser', async () => {
    const stats = await Requests.getStats().then(response => {return response})

    expect(stats.length).toBeGreaterThan(1)
})