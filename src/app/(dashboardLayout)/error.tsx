"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const isDev = process.env.NODE_ENV !== "production";

    return (
        <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-14">
            {/* soft background */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background via-background to-muted/30" />

            <Card className="w-full max-w-xl border-none shadow-lg">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-2xl">Something went wrong</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                An unexpected error occurred. You can try again or go back home.
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Tip box */}
                    <div className="rounded-2xl border bg-card p-4">
                        <p className="text-sm text-muted-foreground">
                            If this keeps happening, it might be a temporary network issue or a backend error.
                            Try refreshing, then check your API logs.
                        </p>
                    </div>

                    {/* Dev-only details */}
                    {isDev && (
                        <details className="rounded-2xl border bg-muted/30 p-4">
                            <summary className="cursor-pointer text-sm font-medium text-foreground">
                                Developer details
                            </summary>
                            <div className="mt-3 space-y-2">
                                <pre className="max-h-48 overflow-auto rounded-xl bg-background p-3 text-xs text-muted-foreground">
                                    {error?.message || "No error message"}
                                </pre>
                                {error?.digest && (
                                    <p className="text-xs text-muted-foreground">
                                        Digest: <span className="font-mono">{error.digest}</span>
                                    </p>
                                )}
                            </div>
                        </details>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        asChild
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>

                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => reset()}
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
