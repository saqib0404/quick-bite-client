import { Route } from "@/type";
import { Home, User, Users, ShoppingBag, BarChart3 } from "lucide-react";

export const adminRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            { title: "Dashboard", url: "/admin-dashboard", icon: BarChart3 },
            { title: "My Profile", url: "/admin-dashboard/profile", icon: User },
            { title: "All Users", url: "/admin-dashboard/users", icon: Users },
            { title: "All Orders", url: "/admin-dashboard/order", icon: ShoppingBag },
            { title: "Home", url: "/", icon: Home },
        ],
    },
];
