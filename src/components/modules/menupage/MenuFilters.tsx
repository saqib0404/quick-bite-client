"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FilterX } from "lucide-react";

type Cuisine = "ALL" | "MEAT" | "FISH" | "VEG" | "VEGAN";

export default function MenuFilters({
    initialCuisine = "ALL",
    initialMinPrice = "",
}: {
    initialCuisine?: Cuisine;
    initialMinPrice?: string; // cents as string
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const [cuisine, setCuisine] = React.useState<Cuisine>(initialCuisine);
    const [minPrice, setMinPrice] = React.useState<string>(initialMinPrice);

    function applyFilters() {
        const params = new URLSearchParams(sp.toString());

        // cuisine
        if (!cuisine || cuisine === "ALL") params.delete("cuisine");
        else params.set("cuisine", cuisine);

        // minPrice (cents)
        const cleaned = minPrice.replace(/[^\d]/g, "");
        if (!cleaned) params.delete("minPrice");
        else params.set("minPrice", cleaned);

        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
    }

    function clearFilters() {
        const params = new URLSearchParams(sp.toString());
        params.delete("cuisine");
        params.delete("minPrice");
        router.replace(pathname);
        setCuisine("ALL");
        setMinPrice("");
    }

    return (
        <div className="flex flex-wrap items-end justify-end gap-3">
            <div className="w-42.5">
                <label className="mb-1 block text-xs text-muted-foreground">Cuisine</label>
                <Select value={cuisine} onValueChange={(v) => setCuisine(v as Cuisine)}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="MEAT">MEAT</SelectItem>
                        <SelectItem value="FISH">FISH</SelectItem>
                        <SelectItem value="VEG">VEG</SelectItem>
                        <SelectItem value="VEGAN">VEGAN</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-42.5">
                <label className="mb-1 block text-xs text-muted-foreground">
                    Min Price (cents)
                </label>
                <Input
                    className="h-10"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    inputMode="numeric"
                    placeholder="e.g. 1000"
                />
            </div>

            <Button className="h-10" onClick={applyFilters}>
                Apply
            </Button>

            <Button
                className="h-10"
                variant="outline"
                onClick={clearFilters}
                title="Clear filters"
            >
                <FilterX className="h-4 w-4" />
            </Button>
        </div>
    );
}
