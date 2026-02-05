import { env } from "@/env";
import { Restaurant, RestaurantUpsertInput } from "@/type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

interface ServiceOptions {
    cache?: RequestCache;
    revalidate?: number;
}

async function fetchJSON(url: string, init?: RequestInit) {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
}

export const restaurantService = {
    getRestaurants: async (options?: ServiceOptions) => {
        try {
            const config: RequestInit = {};
            if (options?.cache) config.cache = options.cache;
            if (options?.revalidate) config.next = { revalidate: options.revalidate };

            const res = await fetch(`${API_URL}/restaurants`, config);
            const data = (await res.json()) as Restaurant[];

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    getRestaurantById: async (restaurantId: string, options?: ServiceOptions) => {
        try {
            const config: RequestInit = {};
            if (options?.cache) config.cache = options.cache;
            if (options?.revalidate) config.next = { revalidate: options.revalidate };

            const res = await fetch(`${API_URL}/restaurants/${restaurantId}`, config);
            const data = (await res.json()) as Restaurant | null;

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    async getMyRestaurant(providerId: string) {
        const cookieStore = await cookies();

        const res = await fetchJSON(`${API_URL}/restaurants/provider/${providerId}`, {
            headers: { Cookie: cookieStore.toString() },
            cache: "no-store",
        });

        const restaurant: Restaurant | null =
            res.ok ? (res.data ?? null) : null;

        return { data: restaurant, error: res.ok ? null : { message: "Failed to load restaurant" } };
    },

    async createRestaurant(payload: RestaurantUpsertInput) {
        const cookieStore = await cookies();

        return fetchJSON(`${API_URL}/restaurants`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });
    },

    async updateRestaurant(restaurantId: string, payload: RestaurantUpsertInput) {
        const cookieStore = await cookies();

        return fetchJSON(`${API_URL}/restaurants/${restaurantId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });
    },
};
