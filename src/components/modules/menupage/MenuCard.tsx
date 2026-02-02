import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CircleX } from "lucide-react";
import { MenuItem } from "@/type";

function cuisineBadgeTone(cuisine: MenuItem["cuisine"]) {
    // Using the same family of colors you used in "What We Offer"
    switch (cuisine) {
        case "MEAT":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";
        case "FISH":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
        case "VEG":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
        case "VEGAN":
            return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
        default:
            return "bg-muted text-muted-foreground";
    }
}

export default function MenuCard({ item }: { item: MenuItem }) {
    return (
        <Card className="group h-full overflow-hidden border-none shadow-md transition-all duration-300 pb-2">
            <div className="relative h-56 w-full overflow-hidden">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
                        {item.name}
                    </CardTitle>

                    <div className="shrink-0 text-base font-semibold">
                       $ {item.priceCents}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                    {item.description ?? "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className={cuisineBadgeTone(item.cuisine)}>
                        {item.cuisine}
                    </Badge>

                    <Badge variant="secondary" className="text-xs">
                        {item.isAvailable ? (
                            <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Available
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1">
                                <CircleX className="h-3.5 w-3.5" />
                                Unavailable
                            </span>
                        )}
                    </Badge>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t p-4">
                <span className="text-sm text-muted-foreground">
                </span>

                <Link
                    href={`/menu-items/${item.id}`}
                    className="text-sm font-semibold text-primary group-hover:underline"
                >
                    View Details &rarr;
                </Link>
            </CardFooter>
        </Card>
    );
}
