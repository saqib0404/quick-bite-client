import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MenuItemCardSkeleton() {
    return (
        <Card className="group h-full overflow-hidden border-none shadow-md pb-2">
            <Skeleton className="h-56 w-full" />

            <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-16" />
                </div>

                <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-9/12" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="border-t pt-4 flex justify-end">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </Card>
    );
}

export default function MenuItemsLoading() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <Skeleton className="h-10 w-56 mb-3" />
                        <Skeleton className="h-4 w-80" />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Skeleton className="h-10 flex-1 md:flex-none md:w-40 rounded-md" />
                        <Skeleton className="h-10 flex-1 md:flex-none md:w-40 rounded-md" />
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <MenuItemCardSkeleton key={i} />
                    ))}
                </div>

                <div className="relative mt-12 pb-12 flex justify-center">
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
