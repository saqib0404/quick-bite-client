import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function OrderCardSkeleton() {
    return (
        <Card className="rounded-2xl overflow-hidden">
            <div className="p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-4">
                {/* Menu item */}
                <div className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />
                    <div className="flex-1">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-12 rounded-full" />
                            <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                    </div>
                </div>

                <Skeleton className="h-px w-full" />

                <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-56" />
                </div>

                <Skeleton className="h-20 w-full rounded-lg" />
            </div>
        </Card>
    );
}

export default function OrdersLoading() {
    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <OrderCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
