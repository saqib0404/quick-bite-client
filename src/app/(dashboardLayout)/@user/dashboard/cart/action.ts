"use server";

import { cartService } from "@/services/cart.service";
import { menuService } from "@/services/menu.service";
import { env } from "@/env";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

type CartItem = { menuItemId: string; quantity?: number };

export async function removeCartItemAction(menuItemId: string) {
    const { error } = await cartService.removeCartItemByMenuId(menuItemId);
    if (error) return { ok: false, message: error.message };

    revalidatePath("/dashboard/cart");
    return { ok: true, message: "Item removed from cart." };
}

export async function clearCartAction() {
    const { error } = await cartService.clearCart();
    if (error) return { ok: false, message: error.message };

    revalidatePath("/dashboard/cart");
    return { ok: true, message: "Cart cleared." };
}

export async function checkoutFromCartAction(input: {
    deliveryAddressSnapshot: {
        city: string;
        label: string;
        line1: string;
        line2?: string;
        postcode?: string;
        notes?: string;
    };
    notes?: string;
}) {
    try {
        const cookieStore = await cookies();

        const res = await fetch(`${env.API_URL}/orders/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
            body: JSON.stringify(input),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return { ok: false, message: data?.message ?? "Failed to checkout." };
        }

        revalidatePath("/dashboard/cart");
        return { ok: true, message: data?.message ?? "Order placed.", data };
    } catch {
        return { ok: false, message: "Something went wrong." };
    }
}
