import { Route } from "@/type";
import { Home, User, ShoppingCart, ShoppingBag } from "lucide-react";

export const userRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            { title: "My Profile", url: "/dashboard/profile", icon: User },
            { title: "Cart", url: "/dashboard/cart", icon: ShoppingCart },
            { title: "My Orders", url: "/dashboard/order", icon: ShoppingBag },
            { title: "Home", url: "/", icon: Home },
        ],
    },
];
