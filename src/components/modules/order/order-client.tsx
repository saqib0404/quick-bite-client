"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MyOrder, OrderStatus } from "@/type";

function statusVariant(status: OrderStatus) {
    const s = (status || "").toUpperCase();
    if (s === "DELIVERED") return "default";
    if (s === "CANCELLED") return "destructive";
    if (s === "PENDING") return "secondary";
    return "outline";
}

function prettyStatus(status: string) {
    return status.replaceAll("_", " ");
}

export default function OrdersClient({ orders }: { orders: MyOrder[] }) {
    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
                <p className="text-sm text-muted-foreground">
                    Track your orders and their current status.
                </p>
            </div>

            {orders.length === 0 ? (
                <Card className="p-10 text-center">
                    <div className="mx-auto max-w-md space-y-2">
                        <div className="text-lg font-semibold">No orders yet</div>
                        <p className="text-sm text-muted-foreground">
                            Place your first order from the menu.
                        </p>
                        <Link href="/menu-items" className="text-primary hover:underline">
                            Browse menu
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {orders.map((o) => (
                        <Card key={o.id} className="rounded-2xl overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Package className="h-5 w-5" />
                                            Order #{o.id.slice(0, 8)}
                                        </CardTitle>

                                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            {new Date(o.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={statusVariant(o.status)}>
                                            {prettyStatus(o.status)}
                                        </Badge>
                                        <div className="font-semibold">${(o.totalCents)}</div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Menu item */}
                                <div className="flex gap-3">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border bg-muted shrink-0">
                                        {o.menuItem?.imageUrl ? (
                                            <Image
                                                src={o.menuItem.imageUrl}
                                                alt={o.menuItem.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium truncate">{o.menuItem?.name ?? "Menu item"}</p>
                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                            {o.menuItem?.cuisine ? (
                                                <Badge variant="outline">{o.menuItem.cuisine}</Badge>
                                            ) : null}
                                            {typeof o.menuItem?.isAvailable === "boolean" ? (
                                                <Badge variant={o.menuItem.isAvailable ? "default" : "secondary"}>
                                                    {o.menuItem.isAvailable ? "Available" : "Unavailable"}
                                                </Badge>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-1">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Restaurant:</span>{" "}
                                        <span className="font-medium">{o.restaurant?.name ?? "—"}</span>
                                    </p>
                                    {o.restaurant ? (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {o.restaurant.addressLine}, {o.restaurant.city}
                                        </p>
                                    ) : null}
                                </div>

                                {o.notes ? (
                                    <div className="rounded-xl border p-3">
                                        <p className="text-sm font-medium">Notes</p>
                                        <p className="text-sm text-muted-foreground">{o.notes}</p>
                                    </div>
                                ) : null}

                                {o.deliveryAddressSnapshot ? (
                                    <div className="rounded-xl border p-3">
                                        <p className="text-sm font-medium">Delivery</p>
                                        <p className="text-sm text-muted-foreground">
                                            {typeof o.deliveryAddressSnapshot === "object"
                                                ? JSON.stringify(o.deliveryAddressSnapshot)
                                                : String(o.deliveryAddressSnapshot)}
                                        </p>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
