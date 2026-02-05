import OrdersClient from "@/components/modules/order/order-client";
import { orderService } from "@/services/order.service";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
    const { data, error } = await orderService.getMyOrders();

    if (error || !data) {
        return (
            <div className="rounded-2xl border p-6">
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error?.message ?? "Something went wrong."}
                </p>
            </div>
        );
    }

    return <OrdersClient orders={data} />;
}
