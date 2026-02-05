export interface Restaurant {
    id: string;

    providerId: string;

    name: string;
    description?: string | null;
    phone?: string | null;

    addressLine: string;
    city: string;

    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}

export type RestaurantUpsertInput = {
    name: string;
    description?: string;
    phone?: string;
    addressLine: string;
    city: string;
    isActive: boolean;
};

