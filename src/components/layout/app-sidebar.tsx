import * as React from "react";
import Link from "next/link";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

import { Route } from "@/type";
import { adminRoutes } from "@/routes/admin-routes";
import { userRoutes } from "@/routes/user-routes";
import { providerRoutes } from "@/routes/provider-routes";

export function AppSidebar({
    user,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    user: { role: string };
}) {
    let routes: Route[] = [];

    switch (user.role) {
        case "ADMIN":
            routes = adminRoutes;
            break;
        case "CUSTOMER":
            routes = userRoutes;
            break;
        case "PROVIDER":
            routes = providerRoutes;
            break;
        default:
            routes = [];
            break;
    }

    return (
        <Sidebar {...props}>
            <SidebarContent>
                {routes.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <SidebarMenuItem key={item.url}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url} className="flex items-center gap-2">
                                                    {Icon ? <Icon className="h-4 w-4" /> : null}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
