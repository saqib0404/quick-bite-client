import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-8xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <h2 className="text-2xl font-semibold">
          Oops! Page not found
        </h2>

        <p className="text-muted-foreground">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back to something delicious 😋
        </p>

        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
