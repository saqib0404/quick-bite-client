import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Phone } from "lucide-react";

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
                    <Skeleton className="h-4 w-9/12" />
                </div>
                <div className="flex gap-2 mb-4">
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

export default function RestaurantDetailsLoading() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="inline-flex items-center gap-2 mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>

                {/* Restaurant Info */}
                <div className="mt-8">
                    <Skeleton className="h-10 w-80 mb-3" />
                    <Skeleton className="h-4 w-full max-w-2xl mb-6" />

                    {/* Address and Phone Cards */}
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <Card className="p-5 border-none shadow-sm">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-5 border-none shadow-sm">
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-16 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Menu Items Section */}
                <div className="mt-12 border-t pt-8">
                    <Skeleton className="h-8 w-56 mb-6" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <MenuItemCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
