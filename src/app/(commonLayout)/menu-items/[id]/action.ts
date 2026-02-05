"use server";

import { cartService } from "@/services/cart.service";
import { reviewService } from "@/services/review.service";
import { revalidatePath } from "next/cache";

export async function addToCartAction(menuItemId: string, quantity: number) {
    const { error } = await cartService.addToCart({ menuItemId, quantity });
    if (error) return { ok: false, message: error.message };

    revalidatePath(`/menu-items/${menuItemId}`);
    return { ok: true, message: "Added to cart." };
}

export async function createOrUpdateReviewAction(input: {
    menuItemId: string;
    rating: number;
    comment?: string;
}) {
    const { error } = await reviewService.createOrUpdateReview(input);
    if (error) return { ok: false, message: error.message };

    revalidatePath(`/menu-items/${input.menuItemId}`);
    return { ok: true, message: "Review saved." };
}

export async function deleteReviewAction(menuItemId: string, reviewId: string) {
    const { error } = await reviewService.deleteMyReview(reviewId);
    if (error) return { ok: false, message: error.message };

    revalidatePath(`/menu-items/${menuItemId}`);
    return { ok: true, message: "Review deleted." };
}
