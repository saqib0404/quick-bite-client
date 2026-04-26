import { Route } from "@/type";
import { Home, User, ShoppingCart, ClipboardList, BarChart3 } from "lucide-react";

export const userRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
            { title: "Profile", url: "/dashboard/profile", icon: User },
            { title: "Cart", url: "/dashboard/cart", icon: ShoppingCart },
            { title: "Orders", url: "/dashboard/order", icon: ClipboardList },
            { title: "Home", url: "/", icon: Home },
        ],
    },
];
