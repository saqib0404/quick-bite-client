import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { userService } from "@/services/user.service";

export default async function DashboardLayout({
    admin,
    provider,
    user,
}: {
    admin: React.ReactNode;
    provider: React.ReactNode;
    user: React.ReactNode;
}) {
    const { data } = await userService.getSession();

    const role = data?.user?.role ?? "";

    return (
        <SidebarProvider>
            <AppSidebar user={{ role }} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4">
                    {role === "ADMIN" ? admin : role === "PROVIDER" ? provider : user}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
