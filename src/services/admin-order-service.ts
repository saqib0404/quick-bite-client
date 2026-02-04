import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export type AdminOrder = {
    id: string;
    createdAt: string;
    customerId: string;
    restaurantId: string;
    menuItemId: string;
    status: string;
    totalCents: number;
};

type AdminUser = {
    id: string;
    name: string;
    role: "CUSTOMER" | "PROVIDER";
};

type Restaurant = { id: string; name: string };
type MenuItem = { id: string; name: string };

function isArray<T>(v: any): v is T[] {
    return Array.isArray(v);
}

async function fetchJSON(url: string, cookieHeader: string) {
    const res = await fetch(url, {
        headers: { Cookie: cookieHeader },
        cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
}

export const adminOrdersService = {
    async getOrdersTableData() {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        // 1) Orders (admin)
        const ordersRes = await fetchJSON(`${API_URL}/orders`, cookieHeader);
        const orders: AdminOrder[] = isArray<AdminOrder>(ordersRes.data) ? ordersRes.data : [];

        if (!ordersRes.ok) {
            return {
                data: null as null | { rows: any[] },
                error: { message: "Failed to load orders" },
            };
        }

        // 2) Users (admin) -> build map for customer names
        const usersRes = await fetchJSON(`${API_URL}/users`, cookieHeader);
        const usersArr: AdminUser[] = isArray<AdminUser>(usersRes.data?.data)
            ? usersRes.data.data
            : [];

        const userNameById = new Map<string, string>();
        for (const u of usersArr) userNameById.set(u.id, u.name);

        // 3) Deduplicate IDs
        const restaurantIds = Array.from(new Set(orders.map((o) => o.restaurantId)));
        const menuItemIds = Array.from(new Set(orders.map((o) => o.menuItemId)));

        // 4) Fetch restaurants by id (deduped)
        const restaurantResults = await Promise.all(
            restaurantIds.map(async (id) => {
                const r = await fetchJSON(`${API_URL}/restaurants/${id}`, cookieHeader);
                return { id, data: r.data as Restaurant | null };
            })
        );

        const restaurantNameById = new Map<string, string>();
        for (const r of restaurantResults) {
            const name = r.data?.name ?? "Unknown restaurant";
            restaurantNameById.set(r.id, name);
        }

        // 5) Fetch menu items by id (deduped)
        const menuItemResults = await Promise.all(
            menuItemIds.map(async (id) => {
                const m = await fetchJSON(`${API_URL}/menu-items/${id}`, cookieHeader);
                return { id, data: m.data as MenuItem | null };
            })
        );

        const menuItemNameById = new Map<string, string>();
        for (const m of menuItemResults) {
            const name = m.data?.name ?? "Unknown item";
            menuItemNameById.set(m.id, name);
        }

        // 6) Build table rows
        const rows = orders.map((o) => ({
            id: o.id,
            createdAt: o.createdAt,
            status: o.status,
            totalCents: o.totalCents,
            customerName: userNameById.get(o.customerId) ?? "Unknown customer",
            restaurantName: restaurantNameById.get(o.restaurantId) ?? "Unknown restaurant",
            menuItemName: menuItemNameById.get(o.menuItemId) ?? "Unknown item",
        }));

        return { data: { rows }, error: null as null | { message: string } };
    },
};
