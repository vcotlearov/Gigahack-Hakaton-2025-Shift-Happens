/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE = 'https://farm-profit-webapp.azurewebsites.net'; // <-- нужный домен

function joinUrl(base: string, path: string) {
    if (/^https?:\/\//i.test(path)) return path;               // если уже абсолютный
    return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}

export function useApi() {
    const { getAccessTokenSilently } = useAuth0();

    async function fetchApi<T>(
        path: string,
        opts: RequestInit & { auth?: boolean; scope?: string } = {}
    ): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(opts.headers as any),
        };

        if (opts.auth !== false) {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'https://farm-profit-webapp.azurewebsites.net', // тот же, что в Auth0Provider
                    scope: opts.scope,
                },
            });
            headers.Authorization = `Bearer ${token}`;
        }

        const url = joinUrl(API_BASE, path); // <-- всегда бьём на прод-бэк
        const res = await fetch(url, { ...opts, headers });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(text || res.statusText);
        }
        if (res.status === 204) return undefined as any;

        const text = await res.text();
        return (text ? JSON.parse(text) : (undefined as any));
    }

    return { fetchApi };
}
