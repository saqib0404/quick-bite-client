import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type UserMe = {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
    addresses?: unknown | null;
    businessName?: string | null;
    role: UserRole;
    status?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type UpdateMeInput = {
    name?: string;
    phone?: string | null;
    image?: string | null;
    addresses?: unknown | null;
    businessName?: string | null;
};

export const userService = {
    getSession: async function () {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const session = await res.json();

            if (session === null) {
                return { data: null, error: { message: "Session is missing." } };
            }

            return { data: session, error: null };
        } catch (err) {
            console.error(err);
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    //  GET /users/me 
    getMe: async function () {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/users/me`, {
                method: "GET",
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const json = await res.json();


            const me: UserMe | null = json?.data ?? null;

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: json?.message ?? "Failed to load profile" },
                };
            }

            return { data: me, error: null as null | { message: string } };
        } catch (err) {
            console.error(err);
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    //  PATCH /users/me 
    updateMe: async function (payload: UpdateMeInput) {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            });

            const json = await res.json();
            const me: UserMe | null = json?.data ?? null;

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: json?.message ?? "Failed to update profile" },
                };
            }

            return { data: me, error: null as null | { message: string } };
        } catch (err) {
            console.error(err);
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },
};
