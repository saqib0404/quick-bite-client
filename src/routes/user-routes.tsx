import { Route } from "@/type";

export const userRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            {
                title: "My Profile",
                url: "/dashboard/profile",
            },
            {
                title: "Cart",
                url: "/analytics",
            },
            {
                title: "Home",
                url: "/",
            },
        ],
    },
];
