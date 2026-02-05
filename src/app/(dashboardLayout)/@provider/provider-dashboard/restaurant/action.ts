"use server";

import { restaurantService } from "@/services/restaurant.service";
import { RestaurantUpsertInput } from "@/type";

export async function createRestaurantAction(payload: RestaurantUpsertInput) {
    const res = await restaurantService.createRestaurant(payload);

    if (!res.ok) {
        return {
            ok: false,
            message: res.data?.message ?? res.data?.error ?? "Failed to create restaurant",
        };
    }

    return { ok: true };
}

export async function updateRestaurantAction(restaurantId: string, payload: RestaurantUpsertInput) {
    const res = await restaurantService.updateRestaurant(restaurantId, payload);

    if (!res.ok) {
        return {
            ok: false,
            message: res.data?.message ?? res.data?.error ?? "Failed to update restaurant",
        };
    }

    return { ok: true };
}
