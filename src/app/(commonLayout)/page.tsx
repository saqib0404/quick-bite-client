import FaqSection from "@/components/modules/homepage/FaqSection";
import HomeCarousel from "@/components/modules/homepage/HomeCarousel";
import HowWeFunction from "@/components/modules/homepage/HowWeFunction";
import WhatWeOffer from "@/components/modules/homepage/WhatWeOffer";

export default function Home() {

    return (
        <div className="container mx-auto my-10 px-2">
            <h1 className="font-semibold text-center text-3xl mt-5 mb-3">Welcome to Quick Bites</h1>
            <HomeCarousel />
            <WhatWeOffer />
            <HowWeFunction />
            <FaqSection />
        </div>
    );
}
