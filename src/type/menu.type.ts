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

export type CreateMenuItemInput = {
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  isAvailable?: boolean;
  cuisine: CuisineType;
};

export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;

