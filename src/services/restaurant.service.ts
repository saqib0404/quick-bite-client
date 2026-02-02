import { env } from "@/env";
import { Restaurant } from "@/type";

const API_URL = env.API_URL;

interface ServiceOptions {
    cache?: RequestCache;
    revalidate?: number;
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
};
