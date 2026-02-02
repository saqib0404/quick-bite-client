import Link from "next/link";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { restaurantService } from "@/services/restaurant.service";

// show menu items for that restaurant
import { menuService } from "@/services/menu.service";
import { MenuItem, Restaurant } from "@/type";
import MenuCard from "@/components/modules/menupage/MenuCard";

export default async function RestaurantDetailsPage({
    params,
}: {
    params: Promise<{ id: string }> | { id: string };
}) {
    const { id } = await Promise.resolve(params);

    const { data } = await restaurantService.getRestaurantById(id, { cache: "no-store" });
    const restaurant: Restaurant | null = data && !Array.isArray(data) ? data : null;

    if (!restaurant) {
        return (
            <section className="py-16 px-4 md:px-8 lg:px-16">
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/restaurants"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to restaurants
                    </Link>

                    <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                        Restaurant not found.
                    </div>
                </div>
            </section>
        );
    }

    const { data: menuData } = await menuService.getMenuItemsByRestaurantId(id, {
        cache: "no-store",
    });
    const menuItems: MenuItem[] = Array.isArray(menuData) ? (menuData as MenuItem[]) : [];

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <Link
                    href="/restaurants"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to restaurants
                </Link>

                <div className="mt-8">
                    <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
                    <p className="text-muted-foreground mt-2 max-w-3xl">
                        {restaurant.description ?? "No description provided."}
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <Card className="p-5 border-none shadow-sm">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">Address</div>
                                    <div className="text-sm text-muted-foreground">
                                        {restaurant.addressLine}, {restaurant.city}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-5 border-none shadow-sm">
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">Phone</div>
                                    <div className="text-sm text-muted-foreground">
                                        {restaurant.phone ?? "Not provided"}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Menu items */}
                <div className="mt-14">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">
                            Menu <span className="text-primary">Items</span>
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Items available from this restaurant.
                        </p>
                    </div>

                    {menuItems.length === 0 ? (
                        <div className="rounded-2xl border h-[50vh] border-dashed p-10 text-center text-muted-foreground">
                            No menu items for this restaurant.
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {menuItems.map((item) => (
                                <MenuCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
