"use client";

import * as React from "react";
import { toast } from "sonner";
import { User as UserIcon, Pencil, Save, X } from "lucide-react";

import type { UserMe, UpdateMeInput } from "@/services/user.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export function ProfileCard({
    initialMe,
    initialError,
}: {
    initialMe: UserMe | null;
    initialError: string | null;
}) {
    const [me, setMe] = React.useState<UserMe | null>(initialMe);
    const [editing, setEditing] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    const [draft, setDraft] = React.useState({
        name: initialMe?.name ?? "",
        phone: initialMe?.phone ?? "",
        image: initialMe?.image ?? "",
        addressesText: initialMe?.addresses ? JSON.stringify(initialMe.addresses, null, 2) : "",
        businessName: initialMe?.businessName ?? "",
    });

    React.useEffect(() => {
        if (initialError) toast.error(initialError);
    }, [initialError]);

    const initials =
        me?.name?.trim()?.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") ||
        me?.email?.[0]?.toUpperCase() ||
        "U";

    const onEdit = () => {
        if (!me) return;
        setDraft({
            name: me.name ?? "",
            phone: me.phone ?? "",
            image: me.image ?? "",
            addressesText: me.addresses ? JSON.stringify(me.addresses, null, 2) : "",
            businessName: me.businessName ?? "",
        });
        setEditing(true);
    };

    const onCancel = () => {
        if (!me) return;
        setDraft({
            name: me.name ?? "",
            phone: me.phone ?? "",
            image: me.image ?? "",
            addressesText: me.addresses ? JSON.stringify(me.addresses, null, 2) : "",
            businessName: me.businessName ?? "",
        });
        setEditing(false);
    };

    const onSave = async () => {
        if (!me) return;

        // Build payload ONLY with changes
        const payload: UpdateMeInput = {};

        const nextName = draft.name.trim();
        if (!nextName) return toast.error("Name is required.");
        if (nextName !== me.name) payload.name = nextName;

        const nextPhone = draft.phone.trim();
        const normalizedPhone = nextPhone === "" ? null : nextPhone;
        if ((me.phone ?? null) !== normalizedPhone) payload.phone = normalizedPhone;

        const nextImage = draft.image.trim();
        const normalizedImage = nextImage === "" ? null : nextImage;
        if ((me.image ?? null) !== normalizedImage) payload.image = normalizedImage;

        // addresses (optional JSON)
        const addrText = draft.addressesText.trim();
        let normalizedAddresses: any = null;

        if (addrText === "") {
            normalizedAddresses = null;
        } else {
            try {
                normalizedAddresses = JSON.parse(addrText);
            } catch {
                return toast.error("Addresses must be valid JSON.");
            }
        }

        const oldAddrStr = me.addresses == null ? "" : JSON.stringify(me.addresses);
        const newAddrStr = normalizedAddresses == null ? "" : JSON.stringify(normalizedAddresses);
        if (oldAddrStr !== newAddrStr) payload.addresses = normalizedAddresses;

        if (me.role === "PROVIDER") {
            const nextBiz = draft.businessName.trim();
            const normalizedBiz = nextBiz === "" ? null : nextBiz;
            if ((me.businessName ?? null) !== normalizedBiz) payload.businessName = normalizedBiz;
        }

        if (Object.keys(payload).length === 0) {
            toast.message("No changes to save.");
            setEditing(false);
            return;
        }

        setSaving(true);
        const toastId = toast.loading("Saving changes...");

        try {
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok || json?.error) {
                toast.error(json?.error?.message ?? "Update failed", { id: toastId });
                setSaving(false);
                return;
            }

            toast.success("Profile updated.", { id: toastId });
            setMe(json.data);
            setEditing(false);
        } catch {
            toast.error("Something went wrong", { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    if (!me) {
        return (
            <Card className="border-none shadow-lg">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    No profile data found.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle className="text-2xl">Profile</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        View and update your account details.
                    </p>
                </div>

                {!editing ? (
                    <Button onClick={onEdit} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={onCancel} variant="outline" className="gap-2" disabled={saving}>
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button onClick={onSave} className="gap-2" disabled={saving}>
                            <Save className="h-4 w-4" />
                            {saving ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                )}
            </CardHeader>

            <CardContent>
                <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                    {/* Left */}
                    <div className="flex flex-col items-center lg:items-start gap-4">
                        <Avatar className="h-28 w-28 border">
                            {me.image ? <AvatarImage src={me.image} alt={me.name} /> : null}
                            <AvatarFallback className="text-xl">
                                {me.image ? initials : <UserIcon className="h-10 w-10 text-muted-foreground" />}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center lg:text-left">
                            <p className="text-lg font-semibold">{me.name}</p>
                            <div className="mt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                                <Badge variant="secondary">{me.role}</Badge>
                                {me.status ? <Badge variant="outline">{me.status}</Badge> : null}
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Email</p>
                                <Input value={me.email} disabled />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium">Phone</p>
                                {editing ? (
                                    <Input
                                        value={draft.phone}
                                        onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
                                        placeholder="+971..."
                                    />
                                ) : (
                                    <Input value={me.phone ?? ""} disabled />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Profile image URL</p>
                            {editing ? (
                                <Input
                                    value={draft.image}
                                    onChange={(e) => setDraft((p) => ({ ...p, image: e.target.value }))}
                                    placeholder="https://i.ibb.co/..."
                                />
                            ) : (
                                <Input value={me.image ?? ""} disabled />
                            )}
                            <p className="text-xs text-muted-foreground">
                                URLs are accepted only from ImageBB — <span className="font-medium">i.ibb.co</span>
                            </p>
                        </div>

                        {me.role === "PROVIDER" ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Business name</p>
                                {editing ? (
                                    <Input
                                        value={draft.businessName}
                                        onChange={(e) => setDraft((p) => ({ ...p, businessName: e.target.value }))}
                                        placeholder="Your business name"
                                    />
                                ) : (
                                    <Input value={me.businessName ?? ""} disabled />
                                )}
                            </div>
                        ) : null}

                        <Separator />

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Addresses (JSON)</p>
                            {editing ? (
                                <Textarea
                                    value={draft.addressesText}
                                    onChange={(e) => setDraft((p) => ({ ...p, addressesText: e.target.value }))}
                                    placeholder='{"home": "..."}'
                                    className="min-h-40"
                                />
                            ) : (
                                <Textarea
                                    value={me.addresses ? JSON.stringify(me.addresses, null, 2) : ""}
                                    disabled
                                    className="min-h-4"
                                />
                            )}
                            <p className="text-xs text-muted-foreground">
                                Leave empty if you don’t want to store addresses.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
