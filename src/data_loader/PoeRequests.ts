import axios, { AxiosResponse } from "axios";
import { Request, Response } from "./SearchRequest";
import { processStats, Stat } from "./StatsLoader";

/*
 * The URL is relative because in DEV mode, Vite is configured to use a proxy dev server and in Netlify also.
 * This is due to the CORS error when requesting the STATS to the poe trade API. It might cause problems if
 * the application is deployed in other platform. In that case, try to use the full URL.
 * 
 * Netlify configuration: /netlify.toml
 * Vite configuration: /vite.config.ts
 * 
 * Full URL: https://www.pathofexile.com/api/trade/
 */
function _getUrl(): string {
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
                'Content-Type': 'application/json'
            },
        }
    ).then(responseBody),
    search: async (url: string, request: Request) => {
        const response = await instance.post(
            url,
            JSON.stringify(request),
            {
                headers: {
                    'Content-Type': 'application/json'
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