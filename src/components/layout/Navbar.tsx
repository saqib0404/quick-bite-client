"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, User, LayoutDashboard, LogOut } from "lucide-react";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ModeToggle } from "./ModeToggle";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: { title: string; url: string };
    signup: { title: string; url: string };
  };
}

type SessionLike = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
} | null;

const Navbar = ({
  logo = {
    url: "/",
    src: "/burger.png",
    alt: "logo",
    title: "Quick Bite",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Menus", url: "/menu-items" },
    { title: "Restaurants", url: "/restaurants" },
    { title: "Dashboard", url: "/dashboard" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Register", url: "/register" },
  },
  className,
}: Navbar1Props) => {
  const router = useRouter();

  const [session, setSession] = React.useState<SessionLike>(null);
  const [loadingSession, setLoadingSession] = React.useState(true);
  const [loggingOut, setLoggingOut] = React.useState(false);

  // Get session on client
  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res: any = await (authClient as any).getSession?.();
        const sess = res?.data ?? res ?? null;

        if (mounted) setSession(sess);
      } catch {
        if (mounted) setSession(null);
      } finally {
        if (mounted) setLoadingSession(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const user = session?.user;
  const isAuthed = !!user;

  const initials =
    user?.name?.trim()?.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await (authClient as any).signOut?.();
      setSession(null);
      router.push("/login");
      router.refresh();
    } catch {

    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section className={cn("py-4", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">{logo.title}</span>
            </a>

            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Auth area */}
            {loadingSession ? (
              <Button variant="outline" size="sm" disabled>
                Loading...
              </Button>
            ) : isAuthed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      {user?.image ? <AvatarImage src={user.image} alt={user?.name ?? "Profile"} /> : null}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium leading-none">{user?.name ?? "User"}</p>
                    {user?.email ? (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                    ) : null}
                  </div>

                  <DropdownMenuSeparator />

                  {/* <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem> */}

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 focus:text-red-500"
                    disabled={loggingOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
            </a>

            <div className="flex items-center gap-2">
              <ModeToggle />

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>

                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <img src={logo.src} className="max-h-8 dark:invert" alt={logo.alt} />
                        <span className="text-base font-semibold">{logo.title}</span>
                      </a>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-6 p-4">
                    <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    {/* Mobile auth section */}
                    {loadingSession ? (
                      <Button variant="outline" disabled>
                        Loading...
                      </Button>
                    ) : isAuthed ? (
                      <>
                        <Separator />
                        <div className="flex flex-col gap-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>

                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>

                          <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium text-red-500 hover:bg-muted disabled:opacity-60"
                          >
                            <LogOut className="h-4 w-4" />
                            {loggingOut ? "Logging out..." : "Logout"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

export { Navbar };
