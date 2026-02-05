import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { menuService } from "@/services/menu.service";
import { reviewService } from "@/services/review.service";
import { userService } from "@/services/user.service";
import { ArrowLeft, CheckCircle2, CircleX } from "lucide-react";
import { MenuItem, Review } from "@/type";
import { MenuDetailsInteractions } from "@/components/modules/menupage/menu-details-interactions";

function cuisineBadgeTone(cuisine: MenuItem["cuisine"]) {
    switch (cuisine) {
        case "MEAT":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
        case "FISH":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
        case "VEG":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
        case "VEGAN":
            return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
        default:
            return "bg-muted text-muted-foreground";
    }
}

export default async function MenuDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const { data } = await menuService.getMenuItemById(id, { cache: "no-store" });
    const item = data && !Array.isArray(data) ? data : null;

    if (!item) {
        return (
            <section className="py-16 px-4 min-h-[70svh] md:px-8 lg:px-16">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/menu-items"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to menu
                    </Link>

                    <div className="mt-8 h-[50vh] rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                        Menu item not found.
                    </div>
                </div>
            </section>
        );
    }

    const { data: reviewsRes } = await reviewService.getReviewsByMenuItem(id, { cache: "no-store" });
    const reviews: Review[] = (reviewsRes?.data ?? []) as Review[];

    const { data: session } = await userService.getSession();

    const role =
        session?.user?.role ?? session?.role ?? null;

    const userId =
        session?.user?.id ?? session?.userId ?? session?.id ?? null;

    const isCustomer = role === "CUSTOMER";

    return (
        <section className="py-16 px-4 min-h-[70svh] md:px-8 lg:px-16">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/menu-items"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to menu
                </Link>

                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    <Card className="overflow-hidden border-none shadow-md">
                        <div className="relative aspect-4/3 w-full bg-muted">
                            {item.imageUrl ? (
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{item.name}</h1>
                            <div className="text-xl font-semibold">$ {item.priceCents}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={cuisineBadgeTone(item.cuisine)}>
                                {item.cuisine}
                            </Badge>

                            <Badge variant="secondary" className="text-xs">
                                {item.isAvailable ? (
                                    <span className="inline-flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Available
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1">
                                        <CircleX className="h-3.5 w-3.5" />
                                        Unavailable
                                    </span>
                                )}
                            </Badge>

                            <Badge variant="outline" className="text-xs">
                                Restaurant: {item.restaurantId.slice(0, 10)}…
                            </Badge>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            {item.description ?? "No description provided."}
                        </p>
                    </div>
                </div>

                <MenuDetailsInteractions
                    menuItemId={id}
                    isAvailable={item.isAvailable}
                    isCustomer={isCustomer}
                    userId={isCustomer ? userId : null}
                    reviews={reviews}
                />
            </div>
        </section>
    );
}
