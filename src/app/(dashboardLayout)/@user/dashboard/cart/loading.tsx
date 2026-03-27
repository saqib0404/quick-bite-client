import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CartItemSkeleton() {
    return (
        <Card className="p-4 border-none shadow-sm">
            <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-24 mb-3" />
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default function CartLoading() {
    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
            {/* Header */}
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-32 mb-4" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <CartItemSkeleton key={i} />
                    ))}
                </div>

                {/* Summary and Checkout */}
                <div className="space-y-4">
                    <Card className="p-4 border-none shadow-sm">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </Card>

                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
