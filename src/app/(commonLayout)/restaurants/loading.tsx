import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function RestaurantCardSkeleton() {
    return (
        <Card className="group overflow-hidden border-none shadow-md rounded-2xl">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 flex-1 rounded-full" />
                    <Skeleton className="h-6 flex-1 rounded-full" />
                </div>
            </div>
        </Card>
    );
}

export default function RestaurantsLoading() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <Skeleton className="h-10 w-80 mb-3" />
                    <Skeleton className="h-4 w-96" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <RestaurantCardSkeleton key={i} />
                    ))}
                </div>

                <div className="relative pb-12 flex justify-center">
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
                        ))}
                        <Skeleton className="h-10 w-10 rounded-lg" />
                    </div>
                </div>
            </div>
        </section>
    );
}
