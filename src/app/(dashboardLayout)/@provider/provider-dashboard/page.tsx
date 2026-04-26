import { userService } from "@/services/user.service";
import { providerOrderService } from "@/services/provider-order.service";
import { providerMenuService } from "@/services/provider-menu.service";
import { restaurantService } from "@/services/restaurant.service";
import ProviderDashboardClient from "@/components/modules/dashboard/provider-dashboard-client";

export default async function ProviderDashboard() {
    const { data: user, error: userError } = await userService.getMe();

    if (userError || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
                    <p className="text-muted-foreground">{userError?.message || "Please try again later"}</p>
                </div>
            </div>
        );
    }

    // Fetch all provider data
    const [ordersRes, restaurantRes] = await Promise.all([
        providerOrderService.getProviderOrders(),
        restaurantService.getMyRestaurant(user.id),
    ]);

    let menuItems: any[] = [];
    if (restaurantRes.data?.id) {
        const menuRes = await providerMenuService.getMenuByRestaurant(restaurantRes.data.id);
        menuItems = menuRes.data || [];
    }

    return (
        <ProviderDashboardClient
            user={user}
            orders={ordersRes.data || []}
            restaurant={restaurantRes.data}
            menuItems={menuItems}
            error={ordersRes.error?.message || restaurantRes.error?.message}
        />
    );
}
