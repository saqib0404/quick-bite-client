"use client";

import * as React from "react";
import {
    ShoppingBag,
    DollarSign,
    Clock,
    CheckCircle,
    Package,
    TrendingUp,
    Calendar,
    MapPin,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { MyOrder } from "@/type";

type Props = {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string | null;
        addresses?: string | null;
        createdAt?: string;
    };
    orders: MyOrder[];
    error?: string | null;
};

function fmtDateShort(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

function formatMoney(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
}

function KpiCard({
    title,
    value,
    icon,
    sub,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    sub?: string;
}) {
    return (
        <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent className="space-y-1">
                <div className="text-3xl font-bold">{value}</div>
                {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
            </CardContent>
        </Card>
    );
}

function OrderCard({ order }: { order: MyOrder }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "default";
            case "OUT_FOR_DELIVERY":
                return "secondary";
            case "PREPARING":
                return "outline";
            case "CONFIRMED":
                return "outline";
            case "PENDING":
                return "outline";
            case "CANCELLED":
                return "destructive";
            default:
                return "outline";
        }
    };

    return (
        <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-medium">{order.menuItem.name}</p>
                            <p className="text-sm text-muted-foreground">{order.restaurant.name}</p>
                        </div>
                    </div>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {fmtDateShort(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {order.restaurant.city}
                        </div>
                    </div>
                    <div className="font-semibold">{formatMoney(order.totalCents)}</div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function UserDashboardClient({ user, orders, error }: Props) {

    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalCents, 0);
    const deliveredOrders = orders.filter(order => order.status === "DELIVERED").length;
    const pendingOrders = orders.filter(order => ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"].includes(order.status)).length;

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5);

    // Mock data for spending chart (would need real data from backend)
    const spendingSeries = [
        { date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 45.50 },
        { date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 32.75 },
        { date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 28.90 },
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 52.25 },
        { date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 41.80 },
        { date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 38.60 },
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 65.40 },
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 29.95 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 47.20 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 33.85 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 56.70 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 42.15 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 39.90 },
        { date: new Date().toISOString().split('T')[0], amount: 51.25 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your orders and activity.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm">Your Activity</span>
                </div>
            </div>

            {error ? (
                <Alert>
                    <AlertTitle>Failed to load some data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : null}

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={<ShoppingBag className="h-5 w-5" />}
                    sub="All time"
                />
                <KpiCard
                    title="Total Spent"
                    value={formatMoney(totalSpent)}
                    icon={<DollarSign className="h-5 w-5" />}
                    sub="All time"
                />
                <KpiCard
                    title="Delivered"
                    value={deliveredOrders}
                    icon={<CheckCircle className="h-5 w-5" />}
                    sub="Completed orders"
                />
                <KpiCard
                    title="In Progress"
                    value={pendingOrders}
                    icon={<Clock className="h-5 w-5" />}
                    sub="Active orders"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Spending Overview</CardTitle>
                        <p className="text-sm text-muted-foreground">Last 14 days</p>
                    </CardHeader>
                    <CardContent className="h-65">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendingSeries}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(v) => fmtDateShort(v)}
                                    tick={{ fontSize: 12 }}
                                    interval={2}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(v) => `$${v}`}
                                />
                                <Tooltip
                                    labelFormatter={(v) => fmtDateShort(String(v))}
                                    formatter={(val) => [`$${val}`, "Spent"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    strokeWidth={2}
                                    fillOpacity={0.15}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Recent Orders</CardTitle>
                        <p className="text-sm text-muted-foreground">Your latest activity</p>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-65 overflow-y-auto">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No orders yet</p>
                                <p className="text-sm">Start exploring restaurants to place your first order!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Separator />
        </div>
    );
}