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
