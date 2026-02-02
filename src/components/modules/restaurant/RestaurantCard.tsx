import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { Restaurant } from "@/type";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
    return (
        <Card className="group h-full overflow-hidden border-none shadow-md transition-all duration-300 pb-2">
            <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1 text-xl font-bold transition-colors group-hover:text-primary">
                    {restaurant.name}
                </CardTitle>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                        variant="secondary"
                        className={
                            restaurant.isActive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                : "bg-muted text-muted-foreground"
                        }
                    >
                        {restaurant.isActive ? "Active" : "Inactive"}
                    </Badge>

                    <Badge variant="secondary" className="text-xs">
                        {restaurant.city}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                    {restaurant.description ?? "No description provided."}
                </p>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="line-clamp-2">
                            {restaurant.addressLine}, {restaurant.city}
                        </span>
                    </div>

                    {restaurant.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{restaurant.phone}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-end border-t p-4">
                <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="text-sm font-semibold text-primary group-hover:underline"
                >
                    View Restaurant &rarr;
                </Link>
            </CardFooter>
        </Card>
    );
}
