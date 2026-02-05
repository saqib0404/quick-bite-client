import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

type ServiceOptions = {
    cache?: RequestCache;
    revalidate?: number;
};

export const reviewService = {
    getReviewsByMenuItem: async (menuItemId: string, options?: ServiceOptions) => {
        try {
            const config: RequestInit = {};
            if (options?.cache) config.cache = options.cache;
            if (options?.revalidate) config.next = { revalidate: options.revalidate };

            const res = await fetch(`${API_URL}/reviews/menu-item/${menuItemId}`, config);
            const data = await res.json();

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    createOrUpdateReview: async (
        payload: { menuItemId: string; rating: number; comment?: string },
    ) => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/reviews`, {
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
                return { data: null, error: { message: data?.message ?? "Failed to submit review." } };
            }

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    deleteMyReview: async (reviewId: string) => {
        try {
            const cookieStore = await cookies();

            const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString(),
                },
                cache: "no-store",
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                return { data: null, error: { message: data?.message ?? "Failed to delete review." } };
            }

            return { data, error: null as null | { message: string } };
        } catch {
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },
};
