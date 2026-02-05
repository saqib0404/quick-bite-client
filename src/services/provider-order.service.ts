import { env } from "@/env";
import { OrderStatus, ProviderOrder } from "@/type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function fetchJSON(url: string, init?: RequestInit) {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
}

export const providerOrderService = {
    async getProviderOrders() {
        try {
            const cookieStore = await cookies();

            const res = await fetchJSON(`${API_URL}/orders/provider`, {
                headers: { Cookie: cookieStore.toString() },
                cache: "no-store",
            });

            const orders: ProviderOrder[] = Array.isArray(res.data?.data) ? res.data.data : [];

            if (!res.ok) return { data: null as ProviderOrder[] | null, error: { message: "Failed to load orders" } };

            return { data: orders, error: null as null | { message: string } };
        } catch {
            return { data: null as ProviderOrder[] | null, error: { message: "Something Went Wrong" } };
        }
    },

    async updateOrderStatus(orderId: string, status: OrderStatus) {
        const cookieStore = await cookies();

        return fetchJSON(`${API_URL}/orders/${orderId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify({ status }),
            cache: "no-store",
        });
    },
};
