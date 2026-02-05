"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Save, XCircle, AlertTriangle } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CuisineType, MenuItem, Restaurant, UpdateMenuItemInput } from "@/type";
import { updateMenuItemAction } from "@/app/(dashboardLayout)/@provider/provider-dashboard/menu-items/[id]/action";

function moneyFromCents(cents: number) {
  const val = (cents ?? 0) / 100;
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(val);
}

export default function ProviderMenuDetailsClient({
  providerStatus,
  restaurant,
  item,
  error,
}: {
  providerStatus: string;
  restaurant: Restaurant | null;
  item: MenuItem | null;
  error: string | null;
}) {
  const router = useRouter();

  const isSuspended = (providerStatus || "").toUpperCase() === "SUSPENDED";
  const restaurantInactive = restaurant ? !restaurant.isActive : false;
  const canManage = !!restaurant && !!item && !isSuspended && !restaurantInactive;

  const [editing, setEditing] = React.useState(false);
  const [saving, startTransition] = React.useTransition();

  const [form, setForm] = React.useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    priceCents: item?.priceCents ?? 0,
    imageUrl: item?.imageUrl ?? "",
    isAvailable: item?.isAvailable ?? true,
    cuisine: (item?.cuisine ?? "MEAT") as CuisineType,
  });

  React.useEffect(() => {
    if (!item) return;
    setForm({
      name: item.name ?? "",
      description: item.description ?? "",
      priceCents: item.priceCents ?? 0,
      imageUrl: item.imageUrl ?? "",
      isAvailable: !!item.isAvailable,
      cuisine: item.cuisine,
    });
  }, [item]);

  if (error) {
    return (
      <div className="rounded-2xl border p-6">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border p-6">
        <p className="text-sm text-muted-foreground">Menu item not found.</p>
      </div>
    );
  }

  const save = () => {
    if (!canManage) return;

    if (!form.name.trim()) return toast.error("Name is required.");
    if (!Number.isInteger(form.priceCents) || form.priceCents <= 0)
      return toast.error("priceCents must be a positive integer.");

    const payload: UpdateMenuItemInput = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      priceCents: form.priceCents,
      imageUrl: form.imageUrl?.trim() || undefined,
      isAvailable: !!form.isAvailable,
      cuisine: form.cuisine,
    };

    startTransition(async () => {
      const toastId = toast.loading("Updating item...");
      const res = await updateMenuItemAction(item.id, payload);

      if (!res.ok) {
        toast.error(res.message ?? "Update failed", { id: toastId });
        return;
      }

      toast.success("Updated!", { id: toastId });
      setEditing(false);
      router.refresh();
    });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {!editing ? (
          <Button onClick={() => setEditing(true)} disabled={!canManage} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)} disabled={saving} className="gap-2">
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </div>

      {!canManage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Read-only</AlertTitle>
          <AlertDescription>
            {isSuspended
              ? "Your account is SUSPENDED. You cannot update menu items."
              : restaurantInactive
                ? "Your restaurant is INACTIVE. Activate it to update menu items."
                : "You need a restaurant to manage menu items."}
          </AlertDescription>
        </Alert>
      )}

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl">{editing ? "Edit Menu Item" : "Menu Item Details"}</CardTitle>
            <Badge variant={item.isAvailable ? "default" : "secondary"}>
              {item.isAvailable ? "Available" : "Hidden"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                disabled={!editing || !canManage}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                disabled={!editing || !canManage}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price </label>
              <Input
                type="number"
                value={form.priceCents}
                onChange={(e) => setForm((p) => ({ ...p, priceCents: Number(e.target.value) }))}
                disabled={!editing || !canManage}
              />
              {!editing && (
                <p className="text-xs text-muted-foreground">
                  ${(item.priceCents)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cuisine</label>
              <Select
                value={form.cuisine}
                onValueChange={(v) => setForm((p) => ({ ...p, cuisine: v as CuisineType }))}
                disabled={!editing || !canManage}
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
                disabled={!editing || !canManage}
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="text-sm font-medium">Available</p>
                <p className="text-xs text-muted-foreground">Visible to customers</p>
              </div>
              <Switch
                checked={!!form.isAvailable}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isAvailable: v }))}
                disabled={!editing || !canManage}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}