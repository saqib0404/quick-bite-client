export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type UserAddresses = unknown;

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
    status?: string | null;
    isApproved: boolean;
    createdAt: string;
    phone?: string | null;
    businessName?: string | null;
};

export interface UserMe {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
    addresses?: UserAddresses | null;
    businessName?: string | null;
    role: UserRole;
    status?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export type UpdateMeInput = {
    name?: string;
    phone?: string | null;
    image?: string | null;
    addresses?: UserAddresses | null;
    businessName?: string | null;
};
