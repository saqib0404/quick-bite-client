export type CuisineType = "MEAT" | "FISH" | "VEG" | "VEGAN";

export interface MenuItem {
    id: string;
    restaurantId: string;

    name: string;
    description?: string | null;
    priceCents: number;
    imageUrl?: string | null;
    isAvailable: boolean;

    cuisine: CuisineType;

    createdAt?: string;
    updatedAt?: string;
}
