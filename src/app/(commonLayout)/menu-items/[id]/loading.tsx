import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function MenuDetailsLoading() {
    return (
        <section className="py-16 px-4 min-h-[70svh] md:px-8 lg:px-16">
            <div className="mx-auto max-w-5xl">
                <div className="inline-flex items-center gap-2 mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    {/* Image */}
                    <Card className="overflow-hidden border-none shadow-md">
                        <div className="relative aspect-4/3 w-full bg-muted">
                            <Skeleton className="w-full h-full" />
                        </div>
                    </Card>

                    {/* Details */}
                    <div className="space-y-5">
                        {/* Title and Price */}
                        <div className="flex items-start justify-between gap-4">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-8 w-20" />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-9/12" />
                        </div>
                    </div>
                </div>

                {/* Interactions Section */}
                <div className="mt-12 border-t pt-8">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
