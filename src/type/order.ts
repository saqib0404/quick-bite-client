import { CuisineType } from "./menu.type";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type ProviderOrder = {
  id: string;
  status: OrderStatus;
  totalCents: number;
  notes?: string | null;
  deliveryAddressSnapshot?: any;
  createdAt: string;
  updatedAt: string;

  customerId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };

  restaurantId: string;
  restaurant?: {
    id: string;
    name: string;
    isActive: boolean;
  };

  menuItemId: string;
  menuItem?: {
    id: string;
    name: string;
    cuisine: CuisineType;
    isAvailable: boolean;
    imageUrl?: string | null;
    priceCents?: number;
  };
};
