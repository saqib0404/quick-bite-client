"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, ShoppingBag, Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (sessionId) {
            setShowModal(true);
            // Add entrance animation
            setTimeout(() => setIsVisible(true), 100);
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-100/20 to-emerald-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                    ></div>
                ))}
            </div>

            <div className={`w-full max-w-2xl transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                    {/* Success ribbon */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>

                    <CardHeader className="text-center pb-6 pt-8">
                        {/* Animated checkmark */}
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg animate-pulse">
                            <CheckCircle2 className="h-10 w-10 text-white animate-bounce" />
                        </div>

                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-2">
                            Payment Successful!
                        </CardTitle>

                        <CardDescription className="text-lg text-gray-600 max-w-md mx-auto">
                            Your order has been confirmed and is being prepared with care. We're excited to serve you!
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 px-8 pb-8">
                        {/* Order summary */}
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                    <ShoppingBag className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                                    <p className="text-sm text-gray-600">Your delicious meal is on its way</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                    <span className="text-gray-600">Estimated time:</span>
                                    <span className="font-medium text-gray-900">25-35 mins</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    <span className="text-gray-600">Delivery to:</span>
                                    <span className="font-medium text-gray-900">Your address</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-emerald-600" />
                                    <span className="text-gray-600">Order ID:</span>
                                    <Badge variant="outline" className="text-xs">
                                        {sessionId?.slice(0, 8) || 'N/A'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Next steps */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Thank you for choosing Quick Bite! You will receive an email confirmation with your order details.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200">
                                    <Link href="/dashboard/order" className="flex items-center gap-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        Track My Order
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button variant="outline" asChild size="lg" className="border-emerald-200 hover:bg-emerald-50 transition-all duration-200">
                                    <Link href="/menu-items" className="flex items-center gap-2">
                                        <Star className="h-4 w-4" />
                                        Order Again
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Additional info */}
                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                Questions about your order? Contact our support team at{" "}
                                <a href="mailto:support@quickbite.com" className="text-emerald-600 hover:underline">
                                    support@quickbite.com
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}