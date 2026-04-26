"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (sessionId) {
            setShowModal(true);
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-800">Payment Successful!</CardTitle>
                    <CardDescription className="text-green-600">
                        Your order has been confirmed and is being prepared.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center text-sm text-gray-600">
                        Thank you for your purchase. You will receive an email confirmation shortly.
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                            <Link href="/dashboard/order">
                                View My Orders
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/dashboard/menu">
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}