import { Route } from "@/type";
import { Home, User, UtensilsCrossed, ClipboardList } from "lucide-react";

export const providerRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            { title: "Profile", url: "/provider-dashboard/profile", icon: User },
            { title: "My Restaurant", url: "/provider-dashboard/restaurant", icon: UtensilsCrossed },
            { title: "Orders", url: "/provider-dashboard/order", icon: ClipboardList },
            { title: "Home", url: "/", icon: Home },
        ],
    },
];
