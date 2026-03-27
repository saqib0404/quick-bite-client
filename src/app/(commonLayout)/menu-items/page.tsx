import MenuCard from "@/components/modules/menupage/MenuCard";
import MenuFilters from "@/components/modules/menupage/MenuFilters";
import Pagination from "@/components/modules/common/Pagination";
import { menuService } from "@/services/menu.service";
import { CuisineType, MenuItem } from "@/type";

type Search = {
    cuisine?: string;
    minPrice?: string;
    page?: string;
};

const ITEMS_PER_PAGE = 8;

export default async function MenuPage({
    searchParams,
}: {
    searchParams: Promise<Search> | Search;
}) {
    const sp = await Promise.resolve(searchParams);

    const cuisine =
        sp.cuisine && ["MEAT", "FISH", "VEG", "VEGAN"].includes(sp.cuisine)
            ? (sp.cuisine as CuisineType)
            : undefined;

    const minPrice =
        sp.minPrice && !Number.isNaN(parseInt(sp.minPrice, 10))
            ? parseInt(sp.minPrice, 10)
            : undefined;

    const currentPage = sp.page ? parseInt(sp.page, 10) : 1;

    const { data } = await menuService.getAllMenuItems(
        { cuisine, minPrice },
        { cache: "no-store" }
    );

    const allItems: MenuItem[] = Array.isArray(data) ? (data as MenuItem[]) : [];
    const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
    const validPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
    
    const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
    const items = allItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const queryParams: Record<string, string> = {};
    if (sp.cuisine) queryParams.cuisine = sp.cuisine;
    if (sp.minPrice) queryParams.minPrice = sp.minPrice;

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Menu Items</h1>
                        <p className="text-muted-foreground mt-2">
                            Browse meals and view details before ordering.
                        </p>
                    </div>

                    <MenuFilters
                        initialCuisine={(sp.cuisine as any) ?? "ALL"}
                        initialMinPrice={sp.minPrice ?? ""}
                    />
                </div>

                {allItems.length === 0 ? (
                    <div className="rounded-2xl h-[50vh] border border-dashed p-10 text-center text-muted-foreground">
                        No menu items found.
                    </div>
                ) : (
                    <>
                        <div className="grid mb-10 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item: MenuItem) => (
                                <MenuCard key={item.id} item={item} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="relative pb-12">
                                <Pagination
                                    currentPage={validPage}
                                    totalPages={totalPages}
                                    baseUrl="/menu-items"
                                    queryParams={queryParams}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
