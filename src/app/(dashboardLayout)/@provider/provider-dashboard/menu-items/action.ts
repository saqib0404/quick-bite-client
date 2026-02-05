"use server";

import { providerMenuService } from "@/services/provider-menu.service";
import { CreateMenuItemInput } from "@/type";

export async function createMenuItemAction(payload: CreateMenuItemInput) {
    const res = await providerMenuService.createMenuItem(payload);

    if (!res.ok) {
        return { ok: false, message: res.data?.message ?? "Failed to create item" };
    }

    return { ok: true, data: res.data?.data ?? res.data };
}

export async function deleteMenuItemAction(menuItemId: string) {
    const res = await providerMenuService.deleteMenuItem(menuItemId);

    if (!res.ok) {
        return { ok: false, message: res.data?.message ?? "Failed to delete item" };
    }

    return { ok: true };
}
