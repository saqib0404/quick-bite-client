"use client";

import * as React from "react";
import {
    Store,
    DollarSign,
    ShoppingBag,
    Package,
    TrendingUp,
    Users,
    Star,
    Clock,
    CheckCircle,
    AlertCircle,
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

import { ProviderOrder, MenuItem } from "@/type";

type Props = {
    user: {
        id: string;
        name: string;
        email: string;
        businessName?: string | null;
    };
    orders: ProviderOrder[];
    restaurant: any;
    menuItems: MenuItem[];
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

function OrderCard({ order }: { order: ProviderOrder }) {
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
                            <p className="font-medium">{order.menuItem?.name || "Menu Item"}</p>
                            <p className="text-sm text-muted-foreground">
                                {order.customer?.name || "Customer"}
                            </p>
                        </div>
                    </div>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {fmtDateShort(order.createdAt)}
                        </div>
                        <div className="text-muted-foreground">
                            {order.menuItem?.cuisine || "Cuisine"}
                        </div>
                    </div>
                    <div className="font-semibold">{formatMoney(order.totalCents)}</div>
                </div>
            </CardContent>
        </Card>
    );
}

function MenuItemCard({ item }: { item: MenuItem }) {
    return (
        <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.cuisine}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold">{formatMoney(item.priceCents)}</div>
                        <Badge variant={item.isAvailable ? "default" : "secondary"}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ProviderDashboardClient({ user, orders, restaurant, menuItems, error }: Props) {

    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalCents, 0);
    const deliveredOrders = orders.filter(order => order.status === "DELIVERED").length;
    const pendingOrders = orders.filter(order => ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"].includes(order.status)).length;
    const activeMenuItems = menuItems.filter(item => item.isAvailable).length;

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5);
    const recentMenuItems = menuItems.slice(0, 5);

    // Mock data for revenue chart (would need real data from backend)
    const revenueSeries = [
        { date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 125.50 },
        { date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 98.75 },
        { date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 156.90 },
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 203.25 },
        { date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 178.80 },
        { date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 145.60 },
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 234.40 },
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 189.95 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 167.20 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 198.85 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 221.70 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 187.15 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 176.90 },
        { date: new Date().toISOString().split('T')[0], amount: 215.25 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {user.businessName || user.name}!</h1>
                    <p className="text-muted-foreground">
                        Manage your restaurant and track your performance.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                    <Store className="h-5 w-5" />
                    <span className="text-sm">Restaurant Dashboard</span>
                </div>
            </div>

            {!restaurant ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Restaurant Found</AlertTitle>
                    <AlertDescription>
                        You haven't created a restaurant yet. Visit your restaurant settings to get started.
                    </AlertDescription>
                </Alert>
            ) : null}

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
                    title="Total Revenue"
                    value={formatMoney(totalRevenue)}
                    icon={<DollarSign className="h-5 w-5" />}
                    sub="All time"
                />
                <KpiCard
                    title="Active Menu Items"
                    value={activeMenuItems}
                    icon={<Package className="h-5 w-5" />}
                    sub="Available items"
                />
                <KpiCard
                    title="Pending Orders"
                    value={pendingOrders}
                    icon={<Clock className="h-5 w-5" />}
                    sub="Need attention"
                />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="border-none shadow-sm rounded-2xl lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Revenue Overview</CardTitle>
                        <p className="text-sm text-muted-foreground">Last 14 days</p>
                    </CardHeader>
                    <CardContent className="h-65">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueSeries}>
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
                                    formatter={(val) => [`$${val}`, "Revenue"]}
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
                        <p className="text-sm text-muted-foreground">Latest activity</p>
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
                                <p className="text-sm">Orders will appear here once customers start placing them!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Menu Items */}
            <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-base">Your Menu Items</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage your restaurant's offerings</p>
                </CardHeader>
                <CardContent>
                    {recentMenuItems.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {recentMenuItems.map((item) => (
                                <MenuItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No menu items yet</p>
                            <p className="text-sm">Add items to your menu to start receiving orders!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Separator />
        </div>
    );
}