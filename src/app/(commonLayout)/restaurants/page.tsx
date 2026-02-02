import RestaurantCard from "@/components/modules/restaurant/RestaurantCard";
import { restaurantService } from "@/services/restaurant.service";
import { Restaurant } from "@/type";

export default async function RestaurantsPage() {
    const { data } = await restaurantService.getRestaurants({ cache: "no-store" });

    const restaurants: Restaurant[] = Array.isArray(data) ? data : [];

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

                {restaurants.length === 0 ? (
                    <div className="rounded-2xl h-[50vh] border border-dashed p-10 text-center text-muted-foreground">
                        No restaurants found.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
                        {restaurants.map((r) => (
                            <RestaurantCard key={r.id} restaurant={r} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
