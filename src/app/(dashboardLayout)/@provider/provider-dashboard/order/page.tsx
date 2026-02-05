import ProviderOrdersClient from "@/components/modules/provider/provider-order-client";
import { providerOrderService } from "@/services/provider-order.service";

export const dynamic = "force-dynamic";

export default async function ProviderOrdersPage() {
  const { data, error } = await providerOrderService.getProviderOrders();

  if (error || !data) {
    return (
      <div className="rounded-2xl border p-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message ?? "Something went wrong."}
        </p>
      </div>
    );
  }

  return <ProviderOrdersClient initialOrders={data} />;
}
