import type { LucideIcon } from "lucide-react";

export type RouteItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export type Route = {
  title: string;
  items: RouteItem[];
};
