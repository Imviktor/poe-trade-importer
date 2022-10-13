import axios, { AxiosResponse } from "axios";
import { Request, Response } from "./SearchRequest";
import { processStats, Stat } from "./StatsLoader";


function _getUrl(): string {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
        return "https://www.pathofexile.com/api/trade/"
    } else {
    return "api/trade/"
}

const instance = axios.create({
    baseURL: _getUrl(),
    timeout: 15000
});

const responseBody = (response: AxiosResponse) => {
    return response.data
};

const requests = {
    get: (url: string) => instance.get(
        url,
        {
            headers:
            {
                'Content-Type': 'application/json',
                'User-Agent': 'electron/1.0.0'
            },
        }
    ).then(responseBody),
    search: async (url: string, request: Request) => {
        const response = await instance.post(
            url,
            JSON.stringify(request),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'electron/1.0.0'
                },
            }
        );
        return responseBody(response);
    }
}

export const Requests = {
    getStats: async (): Promise<Stat[]> => {
        const stats = await requests.get('data/stats')
        return processStats(stats)
    },
    search: async (request: Request): Promise<Response> => {
        return await requests.search('search/Kalandra', request)
    }
}