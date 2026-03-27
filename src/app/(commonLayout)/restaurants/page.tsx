import RestaurantCard from "@/components/modules/restaurant/RestaurantCard";
import Pagination from "@/components/modules/common/Pagination";
import { restaurantService } from "@/services/restaurant.service";
import { Restaurant } from "@/type";

type Search = {
    page?: string;
};

const ITEMS_PER_PAGE = 6;

export default async function RestaurantsPage({
    searchParams,
}: {
    searchParams: Promise<Search> | Search;
}) {
    const sp = await Promise.resolve(searchParams);
    const currentPage = sp.page ? parseInt(sp.page, 10) : 1;

    const { data } = await restaurantService.getRestaurants({ cache: "no-store" });

    const allRestaurants: Restaurant[] = Array.isArray(data) ? data : [];
    const totalPages = Math.ceil(allRestaurants.length / ITEMS_PER_PAGE);
    const validPage = Math.min(Math.max(currentPage, 1), totalPages || 1);

    const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
    const restaurants = allRestaurants.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 ">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Restaurants <span className="text-primary">List</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Browse active restaurants and open one to see its menu items.
                    </p>
                </div>

                {allRestaurants.length === 0 ? (
                    <div className="rounded-2xl h-[50vh] border border-dashed p-10 text-center text-muted-foreground">
                        No restaurants found.
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                            {restaurants.map((r) => (
                                <RestaurantCard key={r.id} restaurant={r} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="relative pb-12">
                                <Pagination
                                    currentPage={validPage}
                                    totalPages={totalPages}
                                    baseUrl="/restaurants"
                                    queryParams={{}}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
