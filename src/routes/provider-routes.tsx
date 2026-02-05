import { Route } from "@/type";
import { Home, User, UtensilsCrossed, ListOrdered, ShoppingBag } from "lucide-react";

export const providerRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            { title: "My Profile", url: "/provider-dashboard/profile", icon: User },
            { title: "My Restaurant", url: "/provider-dashboard/restaurant", icon: UtensilsCrossed },
            { title: "My Menus", url: "/provider-dashboard/menu-items", icon: ListOrdered },
            { title: "Orders", url: "/provider-dashboard/order", icon: ShoppingBag },
            { title: "Home", url: "/", icon: Home },
        ],
    },
];
