import { Route } from "@/type";


export const adminRoutes: Route[] = [
    {
        title: "Your Dashboard",
        items: [
            {
                title: "My Profile",
                url: "/admin-dashboard/profile",
            },
            {
                title: "All Users",
                url: "/admin-dashboard/users",
            },
            {
                title: "All Orders",
                url: "/admin-dashboard/order",
            },
            {
                title: "Home",
                url: "/",
            },
        ],
    },
];
