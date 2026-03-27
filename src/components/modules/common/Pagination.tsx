"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    queryParams?: Record<string, string>;
}

export default function Pagination({
    currentPage,
    totalPages,
    baseUrl,
    queryParams = {},
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageUrl = (page: number) => {
        const params = new URLSearchParams(queryParams);
        params.set("page", page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate range around current page
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                endPage = 4;
            }

            // Adjust if we're near the end
            if (currentPage > totalPages - 3) {
                startPage = totalPages - 3;
            }

            // Add ellipsis if needed
            if (startPage > 2) {
                pages.push("...");
            }

            // Add page range
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (endPage < totalPages - 1) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <nav className="flex items-center justify-center mt-12">
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <Link href={getPageUrl(currentPage - 1)}>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        className="h-10 w-10 rounded-lg"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {pages.map((page, idx) =>
                        page === "..." ? (
                            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-muted-foreground">
                                ...
                            </span>
                        ) : (
                            <Link key={page} href={getPageUrl(page as number)}>
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    className={`h-10 w-10 rounded-lg font-semibold transition-all ${
                                        currentPage === page
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "hover:bg-accent"
                                    }`}
                                >
                                    {page}
                                </Button>
                            </Link>
                        )
                    )}
                </div>

                {/* Next Button */}
                <Link href={getPageUrl(currentPage + 1)}>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        className="h-10 w-10 rounded-lg"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Results Info */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 text-center text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </div>
        </nav>
    );
}
