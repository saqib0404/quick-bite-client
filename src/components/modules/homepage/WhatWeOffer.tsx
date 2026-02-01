import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Bike, MapPinned, MessageCircle } from "lucide-react"

export default function WhatWeOffer() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 mt-10">
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    What We <span className="text-primary">Offer</span>
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                    Delicious meals, delivered fast, with full control and easy support —
                    everything you need in one place.
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Good Food Quality */}
                <Card className="border-0 shadow-sm rounded-2xl 
          bg-emerald-50 dark:bg-emerald-950/40">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl 
              bg-emerald-100 text-emerald-600 
              dark:bg-emerald-900/50 dark:text-emerald-400">
                            <Utensils className="w-6 h-6" />
                        </div>
                        <CardTitle>Good Food Quality</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        We prepare meals using fresh ingredients and maintain high hygiene
                        standards so every bite is healthy and delicious.
                    </CardContent>
                </Card>

                {/* Fast Delivery */}
                <Card className="border-0 shadow-sm rounded-2xl 
          bg-blue-50 dark:bg-blue-950/40">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl 
              bg-blue-100 text-blue-600 
              dark:bg-blue-900/50 dark:text-blue-400">
                            <Bike className="w-6 h-6" />
                        </div>
                        <CardTitle>Fast Delivery</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Our delivery partners ensure your food reaches you quickly and
                        safely while it's still hot and fresh.
                    </CardContent>
                </Card>

                {/* Food Tracking */}
                <Card className="border-0 shadow-sm rounded-2xl 
          bg-yellow-50 dark:bg-yellow-950/40">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl 
              bg-yellow-100 text-yellow-600 
              dark:bg-yellow-900/50 dark:text-yellow-400">
                            <MapPinned className="w-6 h-6" />
                        </div>
                        <CardTitle>Live Food Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Track your order in real time — from the kitchen to your doorstep —
                        so you always know when to expect your meal.
                    </CardContent>
                </Card>

                {/* Easy Communication */}
                <Card className="border-0 shadow-sm rounded-2xl 
          bg-purple-50 dark:bg-purple-950/40">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 rounded-xl 
              bg-purple-100 text-purple-600 
              dark:bg-purple-900/50 dark:text-purple-400">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <CardTitle>Easy Communication</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Need help? Chat with support or contact the restaurant easily for
                        special requests, updates, or delivery instructions.
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
