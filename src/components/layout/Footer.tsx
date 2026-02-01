import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto grid gap-10 px-6 py-14 md:grid-cols-4">
                {/* Brand */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold tracking-tight">🍔 Quick Bite</h2>
                    <p className="text-sm text-muted-foreground">
                        Discover & order delicious meals from your favorite restaurants.
                    </p>
                </div>

                {/* Explore */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide">
                        Explore
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Restaurants
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Menu Items
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                My Orders
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* For Providers */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide">
                        For Restaurants
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Manage Menu
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Orders
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide">
                        Company
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Quick Bite. All rights reserved.
            </div>
        </footer>
    );
}
