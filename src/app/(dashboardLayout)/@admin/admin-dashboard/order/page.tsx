"use client";

import * as React from "react";
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
import { Pagination } from "@/components/ui/pagination";
import { getAdminOrdersAction } from "./action";


const ITEMS_PER_PAGE = 10;

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

export default function AdminOrdersPage() {
    const [data, setData] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAdminOrdersAction();
                if (result.error) {
                    setError(result.error.message);
                } else {
                    setData(result.data);
                }
            } catch (err) {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold">All Orders</h1>
                    <p className="text-muted-foreground">
                        Admin view of orders with customer, restaurants, and items with prices.
                    </p>
                </div>
                <div className="rounded-2xl border bg-card p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="rounded-2xl border p-6">
                <h1 className="text-xl font-bold">Orders</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error ?? "Something went wrong."}
                </p>
            </div>
        );
    }

    const rows = data.rows;
    const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentRows = rows.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                        Showing {currentRows.length} of {rows.length} order{rows.length === 1 ? "" : "s"} (Page {currentPage} of {totalPages}).
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
                        {currentRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentRows.map((row: any) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-medium">{row.restaurantName}</TableCell>
                                    <TableCell>{row.customerName}</TableCell>
                                    <TableCell>{row.menuItemName}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${(row.totalCents / 100).toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="p-4 border-t">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}
