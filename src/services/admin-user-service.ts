import { env } from "@/env";
import { AdminUser, UserStatus } from "@/type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function fetchJSON(url: string, init?: RequestInit) {
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
}

export const adminUsersService = {
    async getAllUsers() {
        try {
            const cookieStore = await cookies();
            const cookieHeader = cookieStore.toString();

            const { ok, data } = await fetchJSON(`${API_URL}/users`, {
                headers: { Cookie: cookieHeader },
                cache: "no-store",
            });

            if (!ok) return { data: null, error: { message: "Failed to load users" } };

            // your backend shape: { success: true, data: result }
            const users: AdminUser[] = Array.isArray(data?.data) ? data.data : [];
            return { data: users, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    async updateUserStatus(userId: string, status: UserStatus) {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        return fetchJSON(`${API_URL}/users/${userId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify({ status }),
            cache: "no-store",
        });
    },

    // ✅ for the Approved toggle (adjust path if needed)
    async updateUserApproval(userId: string, isApproved: boolean) {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        return fetchJSON(`${API_URL}/users/${userId}/approval`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify({ isApproved }),
            cache: "no-store",
        });
    },
};
