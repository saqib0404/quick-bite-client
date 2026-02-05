"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User, MapPin, UtensilsCrossed, ClipboardList, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { OrderStatus, ProviderOrder } from "@/type";
import { updateProviderOrderStatusAction } from "@/app/(dashboardLayout)/@provider/provider-dashboard/order/action";

function moneyFromCents(cents: number) {
    const val = (cents ?? 0) / 100;
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(val);
}

function prettyStatus(s: string) {
    return (s || "").replaceAll("_", " ");
}

function statusBadgeVariant(status: string) {
    const s = (status || "").toUpperCase();
    switch (s) {
        case "DELIVERED":
            return "default";
        case "CONFIRMED":
        case "PREPARING":
        case "OUT_FOR_DELIVERY":
            return "secondary";
        case "CANCELLED":
            return "destructive";
        case "PENDING":
        default:
            return "outline";
    }
}

function isTerminal(status: string) {
    const s = (status || "").toUpperCase();
    return s === "DELIVERED" || s === "CANCELLED";
}

const PROVIDER_ALLOWED: OrderStatus[] = [
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

function AddressBlock({ snapshot }: { snapshot: any }) {
    if (!snapshot) return <p className="text-sm text-muted-foreground">No delivery address</p>;

    // If it's an object, show key-values
    if (typeof snapshot === "object") {
        const entries = Object.entries(snapshot).filter(([_, v]) => v !== null && v !== undefined && v !== "");
        return (
            <div className="space-y-1">
                {entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No delivery address</p>
                ) : (
                    entries.slice(0, 6).map(([k, v]) => (
                        <p key={k} className="text-sm text-muted-foreground">
                            <span className="capitalize">{k.replaceAll("_", " ")}:</span>{" "}
                            <span className="text-foreground">{String(v)}</span>
                        </p>
                    ))
                )}
            </div>
        );
    }

    return <p className="text-sm text-muted-foreground">{String(snapshot)}</p>;
}

export default function ProviderOrdersClient({ initialOrders }: { initialOrders: ProviderOrder[] }) {
    const router = useRouter();
    const [orders, setOrders] = React.useState(initialOrders);

    // per-order loading
    const [busy, setBusy] = React.useState<Record<string, boolean>>({});

    const setOrderBusy = (id: string, v: boolean) =>
        setBusy((m) => ({ ...m, [id]: v }));

    async function onStatusChange(orderId: string, nextStatus: OrderStatus) {
        const current = orders.find((o) => o.id === orderId);
        if (!current) return;

        // optimistic
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
        setOrderBusy(orderId, true);

        const toastId = toast.loading("Updating status...");
        const res = await updateProviderOrderStatusAction(orderId, nextStatus);

        setOrderBusy(orderId, false);

        if (!res.ok) {
            // revert
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: current.status } : o)));
            toast.error(res.message ?? "Failed to update", { id: toastId });
            return;
        }

        toast.success("Status updated", { id: toastId });
        router.refresh();
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-muted-foreground">
                    Orders placed for your restaurant(s).
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {orders.length === 0 ? (
                    <div className="lg:col-span-2 rounded-2xl border p-10 text-center text-muted-foreground">
                        No orders found.
                    </div>
                ) : (
                    orders.map((o) => {
                        const customer = o.customer;
                        const menu = o.menuItem;
                        const restaurant = o.restaurant;
                        const disabled = isTerminal(o.status) || !!busy[o.id];

                        return (
                            <Card key={o.id} className="rounded-2xl overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <ClipboardList className="h-5 w-5" />
                                                Order #{o.id.slice(0, 8)}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {new Date(o.createdAt).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <Badge variant={statusBadgeVariant(o.status)}>
                                                {prettyStatus(o.status)}
                                            </Badge>
                                            <p className="font-semibold">{moneyFromCents(o.totalCents)}</p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Restaurant */}
                                    {restaurant?.name ? (
                                        <p className="text-sm">
                                            <span className="text-muted-foreground">Restaurant:</span>{" "}
                                            <span className="font-medium">{restaurant.name}</span>
                                            {!restaurant.isActive && (
                                                <Badge className="ml-2" variant="secondary">Inactive</Badge>
                                            )}
                                        </p>
                                    ) : null}

                                    <Separator />

                                    {/* Customer */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium">Customer</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            ID: <span className="text-foreground">{o.customerId}</span>
                                        </p>
                                        {customer?.name ? (
                                            <p className="text-sm text-muted-foreground">
                                                {customer.name} • {customer.email}
                                                {customer.phone ? ` • ${customer.phone}` : ""}
                                            </p>
                                        ) : null}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium">Delivery address</p>
                                        </div>
                                        <AddressBlock snapshot={o.deliveryAddressSnapshot} />
                                    </div>

                                    <Separator />

                                    {/* Menu item */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                                            <p className="font-medium">Menu</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-xl border bg-muted shrink-0">
                                                {menu?.imageUrl ? (
                                                    <Image
                                                        src={menu.imageUrl}
                                                        alt={menu.name ?? "Menu item"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : null}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate">{menu?.name ?? "—"}</p>
                                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                                    {menu?.cuisine ? <Badge variant="outline">{menu.cuisine}</Badge> : null}
                                                    {menu ? (
                                                        <Badge variant={menu.isAvailable ? "default" : "secondary"}>
                                                            {menu.isAvailable ? "Available" : "Hidden"}
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {o.notes ? (
                                        <div className="rounded-xl border p-3">
                                            <p className="text-sm font-medium">Notes</p>
                                            <p className="text-sm text-muted-foreground">{o.notes}</p>
                                        </div>
                                    ) : null}

                                    {/* Status update */}
                                    <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
                                        <div>
                                            <p className="text-sm font-medium">Update status</p>
                                            <p className="text-xs text-muted-foreground">
                                                {isTerminal(o.status)
                                                    ? "This order can no longer be updated."
                                                    : "Provider allowed statuses only."}
                                            </p>
                                        </div>

                                        <div className="min-w-52.5">
                                            <Select
                                                value={o.status}
                                                onValueChange={(v) => onStatusChange(o.id, v as OrderStatus)}
                                                disabled={disabled}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PROVIDER_ALLOWED.map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            {prettyStatus(s)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {busy[o.id] ? (
                                                <p className="mt-1 text-xs text-muted-foreground">Updating…</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
