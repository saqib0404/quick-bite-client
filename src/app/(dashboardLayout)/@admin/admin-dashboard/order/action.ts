"use server";

import { adminOrdersService } from "@/services/admin-order-service";

export async function getAdminOrdersAction() {
    try {
        const result = await adminOrdersService.getOrdersTableData();
        return result;
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        return {
            data: null,
            error: { message: "Failed to load orders" }
        };
    }
}