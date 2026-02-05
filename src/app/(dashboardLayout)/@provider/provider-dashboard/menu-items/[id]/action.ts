"use server";

import { providerMenuService } from "@/services/provider-menu.service";
import { UpdateMenuItemInput } from "@/type";

export async function updateMenuItemAction(menuItemId: string, payload: UpdateMenuItemInput) {
    const res = await providerMenuService.updateMenuItem(menuItemId, payload);

    if (!res.ok) {
        return { ok: false, message: res.data?.message ?? "Failed to update item" };
    }

    return { ok: true, data: res.data?.data ?? res.data };
}
