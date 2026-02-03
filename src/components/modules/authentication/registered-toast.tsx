"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function RegisteredToast() {
    const searchParams = useSearchParams();

    React.useEffect(() => {
        if (searchParams.get("registered") === "1") {
            toast.success("Account created successfully. Please login to continue.");
        }
    }, [searchParams]);

    return null;
}
