import { Route } from "@/type";

export const providerRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            {
                title: "My Profile",
                url: "/provider-dashboard/profile",
            },
            {
                title: "My Restaurant",
                url: "/provider-dashboard/restaurant",
            },
            {
                title: "My Menus",
                url: "/provider-dashboard/menu-items",
            },
            {
                title: "Orders",
                url: "/provider-dashboard/order",
            },
            {
                title: "Home",
                url: "/",
            },
        ],
    },
];
