"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AdminUser, UserStatus } from "@/type";
import { updateUserApprovalAction, updateUserStatusAction } from "@/app/(dashboardLayout)/@admin/admin-dashboard/users/action";

function initials(name: string) {
    const parts = (name || "").trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
}

function roleBadgeVariant(role: string) {
    if (role === "PROVIDER") return "secondary";
    return "outline";
}

const STATUS_OPTIONS: UserStatus[] = ["ACTIVE", "SUSPENDED"];

export function AdminUsersTable({ initialUsers }: { initialUsers: AdminUser[] }) {
    const router = useRouter();

    const [users, setUsers] = React.useState<AdminUser[]>(initialUsers);

    // per-row loading flags
    const [busy, setBusy] = React.useState<Record<string, boolean>>({});

    const setRowBusy = (id: string, v: boolean) =>
        setBusy((m) => ({ ...m, [id]: v }));

    async function onToggleApproved(userId: string, nextVal: boolean) {
        setRowBusy(userId, true);

        // optimistic
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, isApproved: nextVal } : u))
        );

        const res = await updateUserApprovalAction(userId, nextVal);

        setRowBusy(userId, false);

        if (!res.ok) {
            // revert
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, isApproved: !nextVal } : u))
            );
            toast.error(res.message ?? "Failed to update approval");
            return;
        }

        toast.success("Approval updated");
        router.refresh();
    }

    async function onChangeStatus(userId: string, nextStatus: UserStatus) {
        setRowBusy(userId, true);

        const prevStatus = users.find((u) => u.id === userId)?.status ?? null;

        // optimistic
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );

        const res = await updateUserStatusAction(userId, nextStatus);

        setRowBusy(userId, false);

        if (!res.ok) {
            // revert
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, status: prevStatus } : u))
            );
            toast.error(res.message ?? "Failed to update status");
            return;
        }

        toast.success("Status updated");
        router.refresh();
    }

    return (
        <div className="rounded-2xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-17.5">User</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((u) => {
                            const isRowBusy = !!busy[u.id];

                            return (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={u.image ?? ""} alt={u.name} />
                                            <AvatarFallback>{initials(u.name)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>

                                    <TableCell className="font-medium">{u.name}</TableCell>

                                    <TableCell>
                                        <Badge variant={roleBadgeVariant(u.role)}>{u.role}</Badge>
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">{u.email}</TableCell>

                                    <TableCell className="text-muted-foreground">{u.phone ||"No Number"}</TableCell>

                                    {/* <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={!!u.isApproved}
                                                disabled={isRowBusy}
                                                onCheckedChange={(v) => onToggleApproved(u.id, v)}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {u.isApproved ? "Approved" : "Unapproved"}
                                            </span>
                                        </div>
                                    </TableCell> */}

                                    <TableCell>
                                        <div className="min-w-40">
                                            <Select
                                                value={(u.status ?? "ACTIVE") as UserStatus}
                                                onValueChange={(v) => onChangeStatus(u.id, v as UserStatus)}
                                                disabled={isRowBusy}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            {s}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {isRowBusy && (
                                                <p className="mt-1 text-xs text-muted-foreground">Updating…</p>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
