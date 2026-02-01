"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Frequently Asked <span className="text-primary">Questions</span>
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                    Everything you need to know about using our platform — from ordering
                    food to becoming a provider.
                </p>
            </div>

            {/* Accordion Container */}
            <div className="max-w-3xl mx-auto rounded-2xl border 
        bg-white/60 dark:bg-zinc-900/60 
        backdrop-blur supports-backdrop-filter:bg-white/50 
        dark:supports-backdrop-filter:bg-zinc-900/50 
        shadow-sm p-6">

                <Accordion type="single" collapsible className="w-full space-y-4">

                    {/* Q1 */}
                    <AccordionItem value="item-1" className="border-b border-border/50">
                        <AccordionTrigger className="text-left text-lg font-medium">
                            What does this website serve?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Our platform is built especially for food lovers who enjoy exploring
                            delicious meals from a variety of local providers. You can browse,
                            order, and enjoy freshly prepared food delivered right to your
                            doorstep. Beyond ordering, we also empower passionate cooks and
                            restaurants to join as food providers. If you love making great
                            food, you can register as a provider and start selling your dishes
                            to a wide audience through our platform.
                        </AccordionContent>
                    </AccordionItem>

                    {/* Q2 */}
                    <AccordionItem value="item-2" className="border-b border-border/50">
                        <AccordionTrigger className="text-left text-lg font-medium">
                            How do I register?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Getting started is simple. If you don’t already have an account,
                            head over to the registration page and create one using your email
                            and password, or sign up quickly with your Google account. During
                            registration, you can choose your role — whether you want to join
                            as a customer who orders food or as a food provider who sells
                            meals. This flexibility allows you to use the platform in the way
                            that suits you best.
                        </AccordionContent>
                    </AccordionItem>

                    {/* Q3 */}
                    <AccordionItem value="item-3" className="border-b border-border/50">
                        <AccordionTrigger className="text-left text-lg font-medium">
                            What payment methods are available?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            We currently offer Cash on Delivery (COD) as our payment method.
                            This means you only pay when your food arrives at your doorstep,
                            making the process simple and secure. You don’t have to worry about
                            online transactions or card safety — just enjoy your meal and pay
                            in cash upon delivery.
                        </AccordionContent>
                    </AccordionItem>

                    {/* Q4 */}
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-left text-lg font-medium">
                            How can I track my food order?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            After placing an order, you can easily track its progress directly
                            from your dashboard. The food provider updates the order status at
                            different stages — such as preparation, pickup, and delivery — so
                            you always know what’s happening. This real-time tracking helps you
                            stay informed and ensures there are no surprises about when your
                            food will arrive.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </section>
    )
}
