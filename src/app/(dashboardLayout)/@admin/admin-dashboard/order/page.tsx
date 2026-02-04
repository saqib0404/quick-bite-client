import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { adminOrdersService } from "@/services/admin-order-service";

export const dynamic = "force-dynamic";


function statusVariant(status: string) {
    const s = (status || "").toUpperCase();

    switch (s) {
        case "DELIVERED":
            return "default";     
        case "CONFIRMED":
        case "PREPARING":
        case "OUT_FOR_DELIVERY":
            return "secondary";   
        case "PENDING":
            return "outline";     
        case "CANCELLED":
            return "destructive"; 
        default:
            return "outline";
    }
}

export default async function AdminOrdersPage() {
    const { data, error } = await adminOrdersService.getOrdersTableData();

    if (error || !data) {
        return (
            <div className="rounded-2xl border p-6">
                <h1 className="text-xl font-bold">Orders</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error?.message ?? "Something went wrong."}
                </p>
            </div>
        );
    }

    const rows = data.rows;

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">All Orders</h1>
                <p className="text-muted-foreground">
                    Admin view of orders with customer, restaurants, and items with prices.
                </p>
            </div>

            <div className="rounded-2xl border bg-card p-2">
                <Table>
                    <TableCaption className="mb-2">
                        Showing {rows.length} order{rows.length === 1 ? "" : "s"}.
                    </TableCaption>

                    <TableHeader>
                        <TableRow>
                            <TableHead>Restaurant</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Menu item</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-medium">{row.restaurantName}</TableCell>
                                    <TableCell>{row.customerName}</TableCell>
                                    <TableCell>{row.menuItemName}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${(row.totalCents)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
