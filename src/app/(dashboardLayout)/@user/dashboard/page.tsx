import { userService } from "@/services/user.service";
import { orderService } from "@/services/order.service";
import UserDashboardClient from "@/components/modules/dashboard/user-dashboard-client";

export default async function UserDashboard() {
    const { data: user, error: userError } = await userService.getMe();
    const { data: orders, error: ordersError } = await orderService.getMyOrders();

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

    return <UserDashboardClient user={user} orders={orders || []} error={ordersError?.message} />;
}
