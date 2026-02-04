import AdminDashboardClient from "@/components/modules/dashboard/admin-dashboard-client";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

type SeriesRow<L extends string> = { date: string } & Record<L, number>;

function toDayKey(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildLastNDaysSeries<L extends string>(
  items: { createdAt: string }[],
  days: number,
  label: L
): SeriesRow<L>[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (days - 1));

  const map = new Map<string, number>();
  for (const it of items) {
    const key = toDayKey(it.createdAt);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  const series: SeriesRow<L>[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = toDayKey(d);

    series.push({
      date: key,
      [label]: map.get(key) ?? 0,
    } as SeriesRow<L>);
  }

  return series;
}

export default async function AdminDashboardPage() {
  const [usersRes, restaurantsRes, ordersRes] = await Promise.all([
    userService.getAllUsers(),
    userService.getRestaurants(),
    userService.getAllOrders(),
  ]);

  const users = usersRes.data ?? [];
  const restaurants = restaurantsRes.data ?? [];
  const orders = ordersRes.data ?? [];

  // KPIs
  const providers = users.filter((u) => u.role === "PROVIDER");
  const customers = users.filter((u) => u.role === "CUSTOMER");

  const approvedUsers = users.filter((u) => u.isApproved).length;
  const unapprovedUsers = users.filter((u) => !u.isApproved).length;

  const stats = {
    providers: providers.length,
    customers: customers.length,
    restaurants: restaurants.length,
    orders: orders.length,
    approvedUsers,
    unapprovedUsers,
  };

  // Charts (last 14 days)
  const usersSeries = buildLastNDaysSeries(users.map(u => ({ createdAt: u.createdAt })), 14, "users");
  const restaurantsSeries = buildLastNDaysSeries(restaurants.map(r => ({ createdAt: r.createdAt })), 14, "restaurants");
  const ordersSeries = buildLastNDaysSeries(orders.map(o => ({ createdAt: o.createdAt })), 14, "orders");

  // Recent lists
  const recentUsers = [...users].slice(0, 6);
  const recentRestaurants = [...restaurants].slice(0, 6);
  const recentOrders = [...orders].slice(0, 6);

  const error =
    usersRes.error?.message ||
    restaurantsRes.error?.message ||
    ordersRes.error?.message ||
    null;

  return (
    <AdminDashboardClient
      error={error}
      stats={stats}
      usersSeries={usersSeries}
      restaurantsSeries={restaurantsSeries}
      ordersSeries={ordersSeries}
      recentUsers={recentUsers}
      recentRestaurants={recentRestaurants}
      recentOrders={recentOrders}
    />
  );
}
