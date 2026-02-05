import { userService } from "@/services/user.service";
import { restaurantService } from "@/services/restaurant.service";
import { ProviderRestaurantClient } from "@/components/modules/provider/provider-restaurant-client";

export const dynamic = "force-dynamic";

export default async function ProviderRestaurantPage() {
    const { data: session } = await userService.getSession();
    const { data: me } = await userService.getMe();

    const providerId = session?.user?.id;
    const role = me?.role ?? session?.user?.role;
    const status = me?.status ?? session?.user?.status ?? "ACTIVE";

    if (!providerId || role !== "PROVIDER") {
        return (
            <div className="rounded-2xl border p-6">
                <h1 className="text-2xl font-bold">My Restaurant</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    You don’t have access to this page.
                </p>
            </div>
        );
    }

    const { data: restaurant } = await restaurantService.getMyRestaurant(providerId);

    return (
        <ProviderRestaurantClient
            initialRestaurant={restaurant}
            providerStatus={status}
        />
    );
}
