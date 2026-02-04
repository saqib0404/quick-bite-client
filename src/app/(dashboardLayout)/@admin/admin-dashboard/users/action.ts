"use server";

import { adminUsersService } from "@/services/admin-user-service";
import { UserStatus } from "@/type";


export async function updateUserStatusAction(userId: string, status: UserStatus) {
    const res = await adminUsersService.updateUserStatus(userId, status);
    if (!res.ok) {
        return { ok: false, message: res.data?.message ?? "Failed to update status" };
    }
    return { ok: true };
}

export async function updateUserApprovalAction(userId: string, isApproved: boolean) {
    const res = await adminUsersService.updateUserApproval(userId, isApproved);
    if (!res.ok) {
        return { ok: false, message: res.data?.message ?? "Failed to update approval" };
    }
    return { ok: true };
}
