import { AdminUsersTable } from "@/components/modules/admin/admin-user-table";
import { adminUsersService } from "@/services/admin-user-service";


export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const { data, error } = await adminUsersService.getAllUsers();

    if (error || !data) {
        return (
            <div className="rounded-2xl border p-6">
                <h1 className="text-2xl font-bold">All Users</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error?.message ?? "Something went wrong."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold">All Users</h1>
                <p className="text-muted-foreground">
                    Manage approval & status for providers/customers.
                </p>
            </div>

            <AdminUsersTable initialUsers={data} />
        </div>
    );
}
