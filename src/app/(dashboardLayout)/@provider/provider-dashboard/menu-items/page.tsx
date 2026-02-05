import { userService } from "@/services/user.service";
import { restaurantService } from "@/services/restaurant.service";
import { providerMenuService } from "@/services/provider-menu.service";
import ProviderMenuClient from "@/components/modules/provider/provider-menu-client";

export const dynamic = "force-dynamic";

export default async function ProviderMenuPage() {
    const { data: session } = await userService.getSession();
    const { data: me } = await userService.getMe();

    const providerId = session?.user?.id;
    const providerStatus = (me?.status ?? session?.user?.status ?? "ACTIVE") as string;

    if (!providerId) {
        return (
            <div className="rounded-2xl border p-6">
                <h1 className="text-2xl font-bold">Menu</h1>
                <p className="mt-2 text-sm text-muted-foreground">Authentication required.</p>
            </div>
        );
    }

    const { data: restaurant } = await restaurantService.getMyRestaurant(providerId);

    // If no restaurant, no menu fetch needed.
    if (!restaurant) {
        return (
            <ProviderMenuClient
                providerStatus={providerStatus}
                restaurant={null}
                items={[]}
            />
        );
    }

    const { data: items } = await providerMenuService.getMenuByRestaurant(restaurant.id);

    return (
        <ProviderMenuClient
            providerStatus={providerStatus}
            restaurant={restaurant}
            items={items}
        />
    );
}
