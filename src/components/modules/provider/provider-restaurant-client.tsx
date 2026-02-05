"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, Pencil, Save, XCircle, ShieldAlert } from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Restaurant, RestaurantUpsertInput } from "@/type";
import { createRestaurantAction, updateRestaurantAction } from "@/app/(dashboardLayout)/@provider/provider-dashboard/restaurant/action";

function sanitizePayload(v: RestaurantUpsertInput): RestaurantUpsertInput {
    return {
        name: v.name.trim(),
        description: (v.description ?? "").trim() || undefined,
        phone: (v.phone ?? "").trim() || undefined,
        addressLine: v.addressLine.trim(),
        city: v.city.trim(),
        isActive: !!v.isActive,
    };
}

export function ProviderRestaurantClient({
    initialRestaurant,
    providerStatus,
}: {
    initialRestaurant: Restaurant | null;
    providerStatus: string;
}) {
    const router = useRouter();
    const isSuspended = (providerStatus || "").toUpperCase() === "SUSPENDED";

    const [restaurant, setRestaurant] = React.useState<Restaurant | null>(initialRestaurant);
    const [mode, setMode] = React.useState<"view" | "edit" | "create">(
        initialRestaurant ? "view" : "create"
    );

    const [loading, startTransition] = React.useTransition();

    const [form, setForm] = React.useState<RestaurantUpsertInput>(() => ({
        name: initialRestaurant?.name ?? "",
        description: initialRestaurant?.description ?? "",
        phone: initialRestaurant?.phone ?? "",
        addressLine: initialRestaurant?.addressLine ?? "",
        city: initialRestaurant?.city ?? "",
        isActive: initialRestaurant?.isActive ?? true,
    }));

    React.useEffect(() => {
        if (!restaurant) return;
        setForm({
            name: restaurant.name ?? "",
            description: restaurant.description ?? "",
            phone: restaurant.phone ?? "",
            addressLine: restaurant.addressLine ?? "",
            city: restaurant.city ?? "",
            isActive: !!restaurant.isActive,
        });
    }, [restaurant]);

    function validate(v: RestaurantUpsertInput) {
        if (!v.name.trim()) return "Restaurant name is required.";
        if (!v.addressLine.trim()) return "Address line is required.";
        if (!v.city.trim()) return "City is required.";
        return null;
    }

    function onCancel() {
        if (!restaurant) return;
        setMode("view");
        setForm({
            name: restaurant.name ?? "",
            description: restaurant.description ?? "",
            phone: restaurant.phone ?? "",
            addressLine: restaurant.addressLine ?? "",
            city: restaurant.city ?? "",
            isActive: !!restaurant.isActive,
        });
    }

    function onSubmit() {
        if (isSuspended) {
            toast.error("Your account is suspended. You can’t update a restaurant.");
            return;
        }

        const err = validate(form);
        if (err) return toast.error(err);

        const payload = sanitizePayload(form);

        startTransition(async () => {
            const toastId = toast.loading(mode === "create" ? "Creating restaurant..." : "Saving changes...");

            if (mode === "create") {
                const res = await createRestaurantAction(payload);

                if (!res.ok) {
                    toast.error(res.message ?? "Failed to create restaurant", { id: toastId });
                    return;
                }

                setRestaurant((prev) => {
                    const now = new Date().toISOString();
                    return {
                        id: prev?.id ?? "temp",
                        providerId: prev?.providerId ?? "temp",
                        name: payload.name,
                        description: payload.description ?? null,
                        phone: payload.phone ?? null,
                        addressLine: payload.addressLine,
                        city: payload.city,
                        isActive: payload.isActive,
                        createdAt: prev?.createdAt ?? now,
                        updatedAt: now,
                    };
                });

                toast.success("Restaurant created!", { id: toastId });
                router.refresh();
            } else if (mode === "edit" && restaurant?.id) {
                const res = await updateRestaurantAction(restaurant.id, payload);

                if (!res.ok) {
                    toast.error(res.message ?? "Failed to update restaurant", { id: toastId });
                    return;
                }

                setRestaurant((prev) => {
                    const now = new Date().toISOString();
                    return {
                        id: prev?.id ?? "temp",
                        providerId: prev?.providerId ?? "temp",
                        name: payload.name,
                        description: payload.description ?? null,
                        phone: payload.phone ?? null,
                        addressLine: payload.addressLine,
                        city: payload.city,
                        isActive: payload.isActive,
                        createdAt: prev?.createdAt ?? now,
                        updatedAt: now,
                    };
                });

                toast.success("Restaurant updated!", { id: toastId });
                setMode("view");
                router.refresh();
            }
        });
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        My Restaurant
                    </h1>
                    <p className="text-sm text-muted-foreground">

                    </p>
                </div>

                {/* {restaurant && mode === "view" && (
                    <Button
                        onClick={() => setMode("edit")}
                        disabled={isSuspended}
                        className="gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                )} */}
            </div>

            {isSuspended && (
                <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Account suspended</AlertTitle>
                    <AlertDescription>
                        Your account status is <strong>SUSPENDED</strong> You can’t update restaurant information.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-3">
                        <CardTitle>
                            {restaurant ? "Restaurant Details" : "Create Restaurant"}
                        </CardTitle>

                        {restaurant && (
                            <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                                {restaurant.isActive ? "Active" : "Inactive"}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {mode === "view" && restaurant ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="font-medium">{restaurant.name}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="font-medium">{restaurant.phone || "—"}</p>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-xs text-muted-foreground">Description</p>
                                    <p className="font-medium">{restaurant.description || "—"}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Address</p>
                                    <p className="font-medium">{restaurant.addressLine}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">City</p>
                                    <p className="font-medium">{restaurant.city}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end gap-2">
                                <Button
                                    onClick={() => setMode("edit")}
                                    disabled={isSuspended}
                                    className="gap-2"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Restaurant name *</label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        placeholder="e.g. Spice Garden"
                                        disabled={isSuspended || loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input
                                        value={form.phone ?? ""}
                                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                        placeholder="+971..."
                                        disabled={isSuspended || loading}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                        value={form.description ?? ""}
                                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                        placeholder="Tell customers what makes your restaurant special…"
                                        disabled={isSuspended || loading}
                                        className="min-h-27.5"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Address line *</label>
                                    <Input
                                        value={form.addressLine}
                                        onChange={(e) => setForm((p) => ({ ...p, addressLine: e.target.value }))}
                                        placeholder="12 Sheikh Zayed Road"
                                        disabled={isSuspended || loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City *</label>
                                    <Input
                                        value={form.city}
                                        onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                                        placeholder="Dubai"
                                        disabled={isSuspended || loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Active</label>
                                    <div className="flex items-center gap-3 rounded-xl border p-3">
                                        <Switch
                                            checked={form.isActive}
                                            onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
                                            disabled={isSuspended || loading}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {form.isActive ? "Visible to customers" : "Hidden from customers"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end gap-2">
                                {mode === "edit" && (
                                    <Button
                                        variant="outline"
                                        onClick={onCancel}
                                        disabled={loading}
                                        className="gap-2"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                )}

                                <Button
                                    onClick={onSubmit}
                                    disabled={isSuspended || loading}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {loading ? "Saving..." : mode === "create" ? "Create Restaurant" : "Save Changes"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
