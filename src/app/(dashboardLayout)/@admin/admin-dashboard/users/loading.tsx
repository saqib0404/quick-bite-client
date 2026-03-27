import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
    return (
        <div className="space-y-4">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="h-12 px-4 text-left">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                                <th className="h-12 px-4 text-left">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                                <th className="h-12 px-4 text-left">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                                <th className="h-12 px-4 text-left">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                                <th className="h-12 px-4 text-left">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                                <th className="h-12 px-4 text-left">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i} className="border-b hover:bg-transparent transition-colors">
                                    <td className="h-16 px-4">
                                        <Skeleton className="h-4 w-12" />
                                    </td>
                                    <td className="h-16 px-4">
                                        <Skeleton className="h-4 w-32" />
                                    </td>
                                    <td className="h-16 px-4">
                                        <Skeleton className="h-4 w-24" />
                                    </td>
                                    <td className="h-16 px-4">
                                        <Skeleton className="h-4 w-20" />
                                    </td>
                                    <td className="h-16 px-4">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </td>
                                    <td className="h-16 px-4">
                                        <Skeleton className="h-6 w-20 rounded" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
