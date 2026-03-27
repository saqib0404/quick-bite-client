import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderMenuLoading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="rounded-lg border p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="border-b bg-muted/50">
                        <tr>
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
                                <Skeleton className="h-4 w-16" />
                            </th>
                            <th className="h-12 px-4 text-left">
                                <Skeleton className="h-4 w-16" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <tr key={i} className="border-b">
                                <td className="h-16 px-4">
                                    <Skeleton className="h-4 w-32" />
                                </td>
                                <td className="h-16 px-4">
                                    <Skeleton className="h-4 w-20" />
                                </td>
                                <td className="h-16 px-4">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </td>
                                <td className="h-16 px-4">
                                    <Skeleton className="h-4 w-16" />
                                </td>
                                <td className="h-16 px-4">
                                    <Skeleton className="h-6 w-16 rounded" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
