"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
    {
        title: "Hot & Fresh Burgers",
        subtitle: "Juicy bites delivered fast",
        image: "/restaurant1.jpg",
    },
    {
        title: "Healthy & Tasty Bowls",
        subtitle: "Balanced meals for every day",
        image: "/restaurant2.jpg",
    },
    {
        title: "Pizza Night Deals",
        subtitle: "Cheesy, crispy, irresistible",
        image: "/restaurant3.jpg",
    },
    {
        title: "The Wood-Fired Edit",
        subtitle: "Hand-stretched dough meets smoky perfection",
        image: "/restaurant4.jpg",
    },
    {
        title: "Family Feast Mode",
        subtitle: "Big slices, bigger savings, best shared",
        image: "/restaurant5.jpg",
    },
];

export default function HomeCarousel() {
    return (
        <section className="relative w-full">
            <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent>
                    {slides.map((s, idx) => (
                        <CarouselItem key={idx}>
                            {/* Hero slide */}
                            <div className="relative h-[50vh] w-full overflow-hidden">
                                <Image
                                    src={s.image}
                                    alt={s.title}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40" />

                                {/* Text */}
                                <div className="absolute inset-0 flex items-center justify-center px-6">
                                    <div className="max-w-2xl text-center text-white">
                                        <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                                            {s.title}
                                        </h1>
                                        <p className="mb-6 text-lg md:text-xl text-white/90">
                                            {s.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Controls */}
                <CarouselPrevious className="left-6" />
                <CarouselNext className="right-6" />
            </Carousel>
        </section>
    );
}
