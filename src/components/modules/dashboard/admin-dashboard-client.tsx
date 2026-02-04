"use client";

import * as React from "react";
import {
    BarChart3,
    Users,
    Store,
    ShoppingBag,
    BadgeCheck,
    BadgeX,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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

type Props = {
    error: string | null;
    stats: {
        providers: number;
        customers: number;
        restaurants: number;
        orders: number;
        approvedUsers: number;
        unapprovedUsers: number;
    };
    usersSeries: { date: string; users: number }[];
    restaurantsSeries: { date: string; restaurants: number }[];
    ordersSeries: { date: string; orders: number }[];
    recentUsers: {
        id: string;
        name: string;
        email: string;
        role: "CUSTOMER" | "PROVIDER";
        isApproved: boolean;
        createdAt: string;
    }[];
    recentRestaurants: {
        id: string;
        name: string;
        city: string;
        createdAt: string;
    }[];
    recentOrders: {
        id: string;
        createdAt: string;
    }[];
};

function fmtDateShort(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

function KpiCard({
    title,
    value,
    icon,
    sub,
}: {
    title: string;
    value: number;
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

function ChartCard({
    title,
    data,
    dataKey,
}: {
    title: string;
    data: any[];
    dataKey: string;
}) {
    return (
        <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">Last 14 days</p>
            </CardHeader>
            <CardContent className="h-65">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(v) => fmtDateShort(v)}
                            tick={{ fontSize: 12 }}
                            interval={2}
                        />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip
                            labelFormatter={(v) => fmtDateShort(String(v))}
                            formatter={(val) => [val, dataKey]}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            strokeWidth={2}
                            fillOpacity={0.15}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboardClient(props: Props) {
    const {
        error,
        stats,
        usersSeries,
        restaurantsSeries,
        ordersSeries,
        recentUsers,
        recentRestaurants,
        recentOrders,
    } = props;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of platform activity and approvals.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm">Analytics</span>
                </div>
            </div>

            {error ? (
                <Alert>
                    <AlertTitle>Failed to load some data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : null}

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <KpiCard title="Providers" value={stats.providers} icon={<Users className="h-5 w-5" />} />
                <KpiCard title="Customers" value={stats.customers} icon={<Users className="h-5 w-5" />} />
                <KpiCard title="Restaurants" value={stats.restaurants} icon={<Store className="h-5 w-5" />} />
                <KpiCard title="Orders" value={stats.orders} icon={<ShoppingBag className="h-5 w-5" />} />
                <KpiCard
                    title="Approved users"
                    value={stats.approvedUsers}
                    icon={<BadgeCheck className="h-5 w-5" />}
                />
                <KpiCard
                    title="Unapproved users"
                    value={stats.unapprovedUsers}
                    icon={<BadgeX className="h-5 w-5" />}
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-3">
                <ChartCard title="New users" data={usersSeries} dataKey="users" />
                <ChartCard title="New restaurants" data={restaurantsSeries} dataKey="restaurants" />
                <ChartCard title="New orders" data={ordersSeries} dataKey="orders" />
            </div>

            {/* Recent tables */}
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Recent users</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentUsers.map((u) => (
                            <div key={u.id} className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="font-medium truncate">{u.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{u.role}</Badge>
                                    <Badge variant={u.isApproved ? "default" : "outline"}>
                                        {u.isApproved ? "Approved" : "Pending"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Recent restaurants</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentRestaurants.map((r) => (
                            <div key={r.id} className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="font-medium truncate">{r.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {r.city} • {fmtDateShort(r.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base">Recent orders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.map((o) => (
                            <div key={o.id} className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="font-medium truncate">Order #{o.id.slice(0, 8)}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {fmtDateShort(o.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Separator />
            <p className="text-xs text-muted-foreground">
                
            </p>
        </div>
    );
}
