import { userService } from "@/services/user.service";
import { restaurantService } from "@/services/restaurant.service";
import { providerMenuService } from "@/services/provider-menu.service";
import ProviderMenuDetailsClient from "@/components/modules/provider/provider-menu-details-client";

export const dynamic = "force-dynamic";

export default async function ProviderMenuDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;


    const { data: session } = await userService.getSession();
    const { data: me } = await userService.getMe();

    const providerId = session?.user?.id;
    const providerStatus = (me?.status ?? session?.user?.status ?? "ACTIVE") as string;

    if (!providerId) {
        return (
            <div className="rounded-2xl border p-6">
                <h1 className="text-2xl font-bold">Menu item</h1>
                <p className="mt-2 text-sm text-muted-foreground">Authentication required.</p>
            </div>
        );
    }

    const { data: restaurant } = await restaurantService.getMyRestaurant(providerId);
    const { data: item, error } = await providerMenuService.getMenuItemById(id);

    return (
        <ProviderMenuDetailsClient
            providerStatus={providerStatus}
            restaurant={restaurant}
            item={item}
            error={error?.message ?? null}
        />
    );
}

