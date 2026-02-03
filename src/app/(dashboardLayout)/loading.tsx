import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingCard() {
    return (
        <Card className="overflow-hidden border-none shadow-md">
            <Skeleton className="h-56 w-full" />
            <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-16" />
                </div>

                <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-9/12" />
                </div>

                <div className="mt-5 flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="mt-6 border-t pt-4 flex justify-end">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </Card>
    );
}

export default function Loading() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-3">
                    <Skeleton className="h-9 w-56" />
                    <Skeleton className="h-4 w-105 max-w-full" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <LoadingCard key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
