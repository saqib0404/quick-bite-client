import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Food Blogger",
        content: "Quick Bites has revolutionized my dining experience. The food quality is exceptional, and the delivery is always on time. Highly recommended!",
        rating: 5,
    },
    {
        name: "Mike Chen",
        role: "Busy Professional",
        content: "As someone with a hectic schedule, Quick Bites saves me so much time. The tracking feature keeps me updated, and the food never disappoints.",
        rating: 5,
    },
    {
        name: "Emily Rodriguez",
        role: "Student",
        content: "Affordable, delicious, and convenient. Quick Bites makes it easy to enjoy great meals without leaving my dorm. The variety is amazing!",
        rating: 5,
    },
    {
        name: "David Thompson",
        role: "Restaurant Owner",
        content: "Partnering with Quick Bites has been fantastic for my business. The platform is user-friendly and helps me reach more customers.",
        rating: 5,
    },
    {
        name: "Lisa Park",
        role: "Home Chef",
        content: "I love exploring new cuisines through Quick Bites. The quality control is impressive, and the customer service is top-notch.",
        rating: 5,
    },
    {
        name: "James Wilson",
        role: "Fitness Enthusiast",
        content: "Quick Bites offers healthy options that fit my lifestyle. The nutritional information helps me make informed choices.",
        rating: 5,
    },
];

export default function TestimonialSection() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 mt-10">
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    What Our <span className="text-primary">Customers Say</span>
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                    Don't just take our word for it. Here's what our satisfied customers have to say about their Quick Bites experience.
                </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="border-0 shadow-sm rounded-2xl bg-card">
                        <CardContent className="p-6">
                            {/* Rating */}
                            <div className="flex mb-4">
                                {Array.from({ length: testimonial.rating }, (_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-muted-foreground mb-4 italic">
                                "{testimonial.content}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}