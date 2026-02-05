"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Loader2,
    ShoppingBag,
    Trash2,
    X,
    ChevronRight,
    MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { checkoutFromCartAction, clearCartAction, removeCartItemAction } from "@/app/(dashboardLayout)/@user/dashboard/cart/action";

export type CartMenuItem = {
    id: string;
    name: string;
    description?: string | null;
    priceCents: number;
    imageUrl?: string | null;
    cuisine?: "MEAT" | "FISH" | "VEG" | "VEGAN" | string;
    isAvailable?: boolean;
    restaurantId?: string;
};

export type CartLine = {
    menuItemId: string;
    quantity: number;
    menuItem: CartMenuItem;
};

export default function CartClient({
    initialLines,
}: {
    initialLines: CartLine[];
}) {
    const router = useRouter();

    const [lines, setLines] = React.useState<CartLine[]>(initialLines ?? []);
    const hasItems = lines.length > 0;

    const [checkoutOpen, setCheckoutOpen] = React.useState(false);
    const [placing, setPlacing] = React.useState(false);
    const [clearing, setClearing] = React.useState(false);
    const [removingId, setRemovingId] = React.useState<string | null>(null);

    const [addr, setAddr] = React.useState({
        label: "Home",
        city: "",
        line1: "",
        line2: "",
        postcode: "",
        notes: "",
    });
    const [orderNotes, setOrderNotes] = React.useState("");

    const totalCents = React.useMemo(() => {
        return lines.reduce(
            (sum, l) => sum + (l.menuItem?.priceCents ?? 0) * (l.quantity ?? 0),
            0
        );
    }, [lines]);

    const canCheckout =
        hasItems &&
        addr.label.trim().length > 0 &&
        addr.city.trim().length > 0 &&
        addr.line1.trim().length > 0;

    async function onRemove(menuItemId: string) {
        setRemovingId(menuItemId);
        const t = toast.loading("Removing item...");

        const res = await removeCartItemAction(menuItemId);

        if (!res.ok) {
            toast.error(res.message ?? "Failed to remove item.", { id: t });
            setRemovingId(null);
            return;
        }

        setLines((prev) => prev.filter((l) => l.menuItemId !== menuItemId));

        toast.success("Removed from cart.", { id: t });
        setRemovingId(null);
        router.refresh();
    }

    async function onClearCart() {
        setClearing(true);
        const t = toast.loading("Clearing cart...");

        const res = await clearCartAction();

        if (!res.ok) {
            toast.error(res.message ?? "Failed to clear cart.", { id: t });
            setClearing(false);
            return;
        }

        setLines([]);
        toast.success("Cart cleared.", { id: t });
        setClearing(false);
        router.refresh();
    }

    async function onCheckout() {
        if (!canCheckout) {
            toast.error("Delivery address is required (Label, City, Address line 1).");
            return;
        }

        setPlacing(true);
        const t = toast.loading("Placing order...");

        const res = await checkoutFromCartAction({
            deliveryAddressSnapshot: {
                label: addr.label.trim(),
                city: addr.city.trim(),
                line1: addr.line1.trim(),
                line2: addr.line2.trim() || undefined,
                postcode: addr.postcode.trim() || undefined,
                notes: addr.notes.trim() || undefined,
            },
            notes: orderNotes.trim() || undefined,
        });

        if (!res.ok) {
            toast.error(res.message ?? "Checkout failed.", { id: t });
            setPlacing(false);
            return;
        }

        setLines([]);
        toast.success(res.message ?? "Order placed.", { id: t });
        setPlacing(false);
        setCheckoutOpen(false);
        router.refresh();
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
                    <p className="text-sm text-muted-foreground">
                        Review items, remove them, or checkout (Cash on Delivery).
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                        Items: {lines.length}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                        Total: ${(totalCents)}
                    </Badge>

                    {/* Clear cart */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="gap-2"
                                disabled={!hasItems || clearing}
                            >
                                {clearing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                                Clear cart
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Clear the entire cart?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove all items from your cart. You can’t undo this
                                    action.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={clearing}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onClearCart}
                                    disabled={clearing}
                                >
                                    {clearing ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Clearing…
                                        </span>
                                    ) : (
                                        "Yes, clear"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!hasItems} className="gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Place order
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Checkout (Cash on Delivery)</DialogTitle>
                                <DialogDescription>
                                    Please provide delivery address to place the order.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4">
                                <div className="rounded-xl border p-3">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <MapPin className="h-4 w-4" />
                                        Delivery Address
                                    </div>
                                    <Separator className="my-3" />

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">Label *</div>
                                            <Input
                                                value={addr.label}
                                                onChange={(e) =>
                                                    setAddr((p) => ({ ...p, label: e.target.value }))
                                                }
                                                placeholder="Home / Office"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">City *</div>
                                            <Input
                                                value={addr.city}
                                                onChange={(e) =>
                                                    setAddr((p) => ({ ...p, city: e.target.value }))
                                                }
                                                placeholder="Dhaka"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        <div className="text-sm font-medium">Address line 1 *</div>
                                        <Input
                                            value={addr.line1}
                                            onChange={(e) =>
                                                setAddr((p) => ({ ...p, line1: e.target.value }))
                                            }
                                            placeholder="House 12, Road 3"
                                        />
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">Address line 2</div>
                                            <Input
                                                value={addr.line2}
                                                onChange={(e) =>
                                                    setAddr((p) => ({ ...p, line2: e.target.value }))
                                                }
                                                placeholder="Apartment / Floor"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">Postcode</div>
                                            <Input
                                                value={addr.postcode}
                                                onChange={(e) =>
                                                    setAddr((p) => ({ ...p, postcode: e.target.value }))
                                                }
                                                placeholder="1207"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        <div className="text-sm font-medium">Delivery note</div>
                                        <Textarea
                                            value={addr.notes}
                                            onChange={(e) =>
                                                setAddr((p) => ({ ...p, notes: e.target.value }))
                                            }
                                            placeholder="Gate is locked, call me..."
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3">
                                    <div className="text-sm font-medium">Order note (optional)</div>
                                    <div className="mt-2">
                                        <Textarea
                                            value={orderNotes}
                                            onChange={(e) => setOrderNotes(e.target.value)}
                                            placeholder="Any note for the restaurant..."
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl border p-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Items</span>
                                        <span className="font-medium">{lines.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Total</span>
                                        <span className="text-base font-bold">
                                            ${(totalCents)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setCheckoutOpen(false)}
                                    disabled={placing}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={onCheckout} disabled={!canCheckout || placing}>
                                    {placing ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Placing…
                                        </span>
                                    ) : (
                                        "Confirm & Place order"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content */}
            {!hasItems ? (
                <Card className="p-10 text-center">
                    <div className="mx-auto max-w-md space-y-2">
                        <div className="text-lg font-semibold">Your cart is empty</div>
                        <p className="text-sm text-muted-foreground">
                            Add something from the menu to see it here.
                        </p>
                        <Button asChild className="mt-2">
                            <Link href="/menu-items">
                                Browse menu <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {lines.map((line) => {
                        const item = line.menuItem;
                        const lineTotal = (item?.priceCents ?? 0) * (line.quantity ?? 0);

                        return (
                            <Card
                                key={line.menuItemId}
                                className="overflow-hidden border-muted/60"
                            >
                                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        {/* image */}
                                        <div className="h-20 w-28 overflow-hidden rounded-xl bg-muted">
                                            {item?.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* details */}
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={`/menu-items/${item.id}`}
                                                    className="text-base font-semibold hover:underline"
                                                >
                                                    {item?.name ?? line.menuItemId}
                                                </Link>

                                                {item?.cuisine ? (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {String(item.cuisine)}
                                                    </Badge>
                                                ) : null}

                                                {typeof item?.isAvailable === "boolean" ? (
                                                    <Badge
                                                        variant={item.isAvailable ? "default" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {item.isAvailable ? "Available" : "Unavailable"}
                                                    </Badge>
                                                ) : null}
                                            </div>

                                            <div className="text-sm text-muted-foreground">
                                                Qty: <span className="font-medium">{line.quantity}</span>{" "}
                                                • Price:{" "}
                                                <span className="font-medium">
                                                    ${(item.priceCents)}
                                                </span>
                                            </div>

                                            <div className="text-sm">
                                                Line total:{" "}
                                                <span className="font-semibold">
                                                    ${(lineTotal)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* actions */}
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                        <Button asChild variant="outline" className="gap-2">
                                            <Link href={`/menu-items/${item.id}`}>
                                                View <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        {/* Remove with confirmation */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    className="gap-2"
                                                    disabled={removingId === line.menuItemId}
                                                >
                                                    {removingId === line.menuItemId ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <X className="h-4 w-4" />
                                                    )}
                                                    Remove
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Remove this item?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will remove{" "}
                                                        <span className="font-medium">
                                                            {item?.name ?? "this item"}
                                                        </span>{" "}
                                                        from your cart.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        disabled={removingId === line.menuItemId}
                                                    >
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => onRemove(line.menuItemId)}
                                                        disabled={removingId === line.menuItemId}
                                                    >
                                                        {removingId === line.menuItemId ? (
                                                            <span className="inline-flex items-center gap-2">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                Removing…
                                                            </span>
                                                        ) : (
                                                            "Yes, remove"
                                                        )}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

