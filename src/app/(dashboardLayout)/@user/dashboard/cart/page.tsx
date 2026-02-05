import CartClient, { type CartLine } from "@/components/modules/cart/cart-client";
import { cartService } from "@/services/cart.service";
import { menuService } from "@/services/menu.service";

type CartItem = { menuItemId: string; quantity?: number };

export default async function CartPage() {
    const { data } = await cartService.getMyCart();

    const cart = data?.data ?? null;
    const items: CartItem[] = (cart?.items ?? []) as CartItem[];

    const initialLines: CartLine[] = await Promise.all(
        items.map(async (ci) => {
            const { data: m } = await menuService.getMenuItemById(ci.menuItemId, {
                cache: "no-store",
            });
            const menuItem = m && !Array.isArray(m) ? m : null;

            return {
                menuItemId: ci.menuItemId,
                quantity: ci.quantity ?? 1,
                menuItem: menuItem ?? {
                    id: ci.menuItemId,
                    name: "Item not found",
                    priceCents: 0,
                    imageUrl: null,
                },
            };
        })
    );
    return <CartClient initialLines={initialLines} />;
}
