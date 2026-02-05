import { env } from "@/env";
import { CreateMenuItemInput, MenuItem, UpdateMenuItemInput } from "@/type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function fetchJSON(url: string, init?: RequestInit) {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
}

export const providerMenuService = {
    async getMenuByRestaurant(restaurantId: string) {
        const cookieStore = await cookies();
        const res = await fetchJSON(`${API_URL}/menu-items/restaurant/${restaurantId}`, {
            headers: { Cookie: cookieStore.toString() },
            cache: "no-store",
        });

        const items: MenuItem[] = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        if (!res.ok) return { data: [] as MenuItem[], error: { message: "Failed to load menu items" } };
        return { data: items, error: null as null | { message: string } };
    },

    async getMenuItemById(id: string) {
        const cookieStore = await cookies();
        const res = await fetchJSON(`${API_URL}/menu-items/${id}`, {
            headers: { Cookie: cookieStore.toString() },
            cache: "no-store",
        });

        const item: MenuItem | null = res.data ?? null;
        if (!res.ok) return { data: null as MenuItem | null, error: { message: "Failed to load item" } };
        return { data: item, error: null as null | { message: string } };
    },

    async createMenuItem(payload: CreateMenuItemInput) {
        const cookieStore = await cookies();
        return fetchJSON(`${API_URL}/menu-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });
    },

    async updateMenuItem(menuItemId: string, payload: UpdateMenuItemInput) {
        const cookieStore = await cookies();
        return fetchJSON(`${API_URL}/menu-items/${menuItemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });
    },

    async deleteMenuItem(menuItemId: string) {
        const cookieStore = await cookies();
        return fetchJSON(`${API_URL}/menu-items/${menuItemId}`, {
            method: "DELETE",
            headers: { Cookie: cookieStore.toString() },
            cache: "no-store",
        });
    },
};
