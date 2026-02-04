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
                url: "/analytics",
            },
            {
                title: "Orders",
                url: "/analytics",
            },
            {
                title: "Home",
                url: "/",
            },
        ],
    },
];
