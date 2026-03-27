import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function OrderCardSkeleton() {
    return (
        <Card className="p-6 border-none shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <Skeleton className="h-6 w-64 mb-2" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-5 w-24 rounded-full mb-2" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                </div>
            </div>

            <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 flex-1 rounded" />
                <Skeleton className="h-8 flex-1 rounded" />
            </div>
        </Card>
    );
}

export default function ProviderOrdersLoading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <OrderCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
