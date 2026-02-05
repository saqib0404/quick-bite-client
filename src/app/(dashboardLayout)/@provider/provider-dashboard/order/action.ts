"use server";

import { providerOrderService } from "@/services/provider-order.service";
import { OrderStatus } from "@/type";

export async function updateProviderOrderStatusAction(orderId: string, status: OrderStatus) {
    const res = await providerOrderService.updateOrderStatus(orderId, status);

    if (!res.ok) {
        return {
            ok: false,
            message: res.data?.message ?? "Failed to update order status",
        };
    }

    return { ok: true, data: res.data?.data ?? res.data };
}
