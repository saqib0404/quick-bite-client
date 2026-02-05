"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, AlertTriangle } from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateMenuItemInput, CuisineType, MenuItem, Restaurant } from "@/type";
import { createMenuItemAction, deleteMenuItemAction } from "@/app/(dashboardLayout)/@provider/provider-dashboard/menu-items/action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


function moneyFromCents(cents: number) {
    const val = (cents ?? 0) / 100;
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(val);
}

export default function ProviderMenuClient({
    providerStatus,
    restaurant,
    items,
}: {
    providerStatus: string;
    restaurant: Restaurant | null;
    items: MenuItem[];
}) {
    const router = useRouter();

    const isSuspended = (providerStatus || "").toUpperCase() === "SUSPENDED";
    const restaurantInactive = restaurant ? !restaurant.isActive : false;

    const canManage = !!restaurant && !isSuspended && !restaurantInactive;

    const [list, setList] = React.useState<MenuItem[]>(items);
    React.useEffect(() => setList(items), [items]);

    // Create form state
    const [open, setOpen] = React.useState(false);
    const [creating, setCreating] = React.useState(false);

    const [form, setForm] = React.useState<CreateMenuItemInput>({
        name: "",
        description: "",
        priceCents: 0,
        imageUrl: "",
        isAvailable: true,
        cuisine: "MEAT",
    });

    const resetForm = () =>
        setForm({
            name: "",
            description: "",
            priceCents: 0,
            imageUrl: "",
            isAvailable: true,
            cuisine: "MEAT",
        });

    const submitCreate = async () => {
        if (!canManage) return;

        if (!form.name.trim()) return toast.error("Name is required.");
        if (!Number.isInteger(form.priceCents) || form.priceCents <= 0)
            return toast.error("priceCents must be a positive integer.");

        setCreating(true);
        const toastId = toast.loading("Creating menu item...");

        const payload: CreateMenuItemInput = {
            name: form.name.trim(),
            description: form.description?.trim() || undefined,
            priceCents: form.priceCents,
            imageUrl: form.imageUrl?.trim() || undefined,
            isAvailable: !!form.isAvailable,
            cuisine: form.cuisine,
        };

        const res = await createMenuItemAction(payload);
        setCreating(false);

        if (!res.ok) {
            toast.error(res.message ?? "Failed", { id: toastId });
            return;
        }

        toast.success("Menu item created!", { id: toastId });
        setOpen(false);
        resetForm();

        const created: MenuItem | null = res.data ?? null;
        if (created?.id) setList((p) => [created, ...p]);

        router.refresh();
    };

    const onDelete = async (id: string) => {
        if (!canManage) return;

        const prev = list;
        setList((p) => p.filter((x) => x.id !== id));

        const toastId = toast.loading("Deleting...");
        const res = await deleteMenuItemAction(id);

        if (!res.ok) {
            setList(prev);
            toast.error(res.message ?? "Delete failed", { id: toastId });
            return;
        }

        toast.success("Deleted", { id: toastId });
        router.refresh();
    };

    // ─────────────────────────────────────────────

    if (!restaurant) {
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold">My Menu</h1>
                    <p className="text-muted-foreground">Add your restaurant first to upload menus.</p>
                </div>

                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No restaurant found</AlertTitle>
                    <AlertDescription>
                        You don’t have a restaurant yet. Create one from{" "}
                        <Link className="text-primary underline" href="/provider-dashboard/restaurant">
                            My Restaurant
                        </Link>{" "}
                        before adding menu items.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Menu</h1>
                    <p className="text-muted-foreground">
                        Menu items under <span className="font-medium">{restaurant.name}</span>.
                    </p>
                </div>

                {canManage ? (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add item
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Add new menu item</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Name *</label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        placeholder="e.g. Chicken Burger"
                                        disabled={creating}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                        value={form.description ?? ""}
                                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                        placeholder="Short description…"
                                        disabled={creating}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price (cents) *</label>
                                    <Input
                                        type="number"
                                        value={form.priceCents}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, priceCents: Number(e.target.value) }))
                                        }
                                        disabled={creating}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cuisine</label>
                                    <Select
                                        value={form.cuisine}
                                        onValueChange={(v) => setForm((p) => ({ ...p, cuisine: v as CuisineType }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MEAT">MEAT</SelectItem>
                                            <SelectItem value="FISH">FISH</SelectItem>
                                            <SelectItem value="VEG">VEG</SelectItem>
                                            <SelectItem value="VEGAN">VEGAN</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Image URL</label>
                                    <Input
                                        value={form.imageUrl ?? ""}
                                        onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                                        placeholder="https://..."
                                        disabled={creating}
                                    />
                                </div>

                                <div className="md:col-span-2 flex items-center justify-between rounded-xl border p-3">
                                    <div>
                                        <p className="text-sm font-medium">Available</p>
                                        <p className="text-xs text-muted-foreground">
                                            If off, customers won’t see it.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={!!form.isAvailable}
                                        onCheckedChange={(v) => setForm((p) => ({ ...p, isAvailable: v }))}
                                        disabled={creating}
                                    />
                                </div>

                                <div className="md:col-span-2 flex justify-end">
                                    <Button onClick={submitCreate} disabled={creating} className="gap-2">
                                        {creating ? "Creating..." : "Create item"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : null}
            </div>

            {!canManage && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    {/* <AlertTitle>Menu is read-only</AlertTitle> */}
                    <AlertDescription>
                        {isSuspended
                            ? "Your account is SUSPENDED. You cannot upload or change menu items."
                            : "Your restaurant is INACTIVE. Activate it to upload or change menu items."}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.length === 0 ? (
                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border p-10 text-center text-muted-foreground">
                        No menu items found.
                    </div>
                ) : (
                    list.map((item) => (
                        <Card key={item.id} className="rounded-2xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                        {item.isAvailable ? "Available" : "Hidden"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.cuisine}</p>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.description || "—"}
                                </p>

                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">${(item.priceCents)}</p>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <Button asChild variant="outline" className="gap-2">
                                        <Link href={`/provider-dashboard/menu-items/${item.id}`}>
                                            <Eye className="h-4 w-4" />
                                            See detail
                                        </Link>
                                    </Button>

                                    {canManage ? (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    title="Delete"
                                                    disabled={!canManage}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete this menu item?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently remove{" "}
                                                        <span className="font-medium">{item.name}</span> from your menu.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        onClick={() => onDelete(item.id)}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    ) : null}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
