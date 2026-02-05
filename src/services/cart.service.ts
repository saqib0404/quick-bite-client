import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const cartService = {
    addToCart: async (payload: { menuItemId: string; quantity?: number }) => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                return { data: null, error: { message: data?.message ?? "Failed to add to cart." } };
            }

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },
    
    getMyCart: async () => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/cart`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-store",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                return { data: null, error: { message: data?.message ?? "Failed to load cart." } };
            }

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    removeCartItemByMenuId: async (menuItemId: string) => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/cart/item/${menuItemId}`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() },
                cache: "no-store",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                return { data: null, error: { message: data?.message ?? "Failed to remove item." } };
            }

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    clearCart: async () => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/cart/clear`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() },
                cache: "no-store",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                return { data: null, error: { message: data?.message ?? "Failed to clear cart." } };
            }

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },
};
