import { env } from "@/env";
import { CuisineType } from "@/type";

const API_URL = env.API_URL;

interface ServiceOptions {
    cache?: RequestCache;
    revalidate?: number;
}

type GetAllMenuItemsParams = {
    cuisine?: CuisineType;
    minPrice?: number;
};

export const menuService = {
    // GET /menu-items?cuisine=MEAT&minPrice=1200
    getAllMenuItems: async (params?: GetAllMenuItemsParams, options?: ServiceOptions) => {
        try {
            const url = new URL(`${API_URL}/menu-items`);

            if (params?.cuisine) url.searchParams.set("cuisine", params.cuisine);
            if (typeof params?.minPrice === "number") url.searchParams.set("minPrice", String(params.minPrice));

            const config: RequestInit = {};
            if (options?.cache) config.cache = options.cache;
            if (options?.revalidate) config.next = { revalidate: options.revalidate };

            const res = await fetch(url.toString(), config);

            const data = await res.json();

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    // GET /menu-items/restaurant/:restaurantId
    getMenuItemsByRestaurantId: async (restaurantId: string, options?: ServiceOptions) => {
        try {
            const config: RequestInit = {};
            if (options?.cache) config.cache = options.cache;
            if (options?.revalidate) config.next = { revalidate: options.revalidate };

            const res = await fetch(`${API_URL}/menu-items/restaurant/${restaurantId}`, config);
            const data = await res.json();

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    // GET /menu-items/:menuItemId
    getMenuItemById: async (menuItemId: string, options?: ServiceOptions) => {
        try {
            const config: RequestInit = {};
            if (options?.cache) config.cache = options.cache;
            if (options?.revalidate) config.next = { revalidate: options.revalidate };

            const res = await fetch(`${API_URL}/menu-items/${menuItemId}`, config);
            const data = await res.json();

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },
};
