import MenuCard from "@/components/modules/menupage/MenuCard";
import { menuService } from "@/services/menu.service";
import { MenuItem } from "@/type";

export default async function MenuPage() {
    const { data } = await menuService.getAllMenuItems(undefined, { cache: "no-store" });

    const items: MenuItem[] = Array.isArray(data) ? (data as MenuItem[]) : [];

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Menu <span className="text-primary">Items</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Browse meals and view details before ordering.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-2xl border h-[50vh] border-dashed p-10 text-center text-muted-foreground">
                        No menu items found.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
