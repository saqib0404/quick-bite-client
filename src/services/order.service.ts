import { env } from "@/env";
import { MyOrder } from "@/type";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const orderService = {
  getMyOrders: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/orders/me`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return { data: null, error: { message: data?.message ?? "Failed to load orders." } };
      }

      const orders: MyOrder[] = Array.isArray(data?.data) ? data.data : [];

      return { data: orders, error: null as null | { message: string } };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
