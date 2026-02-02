"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ShoppingCart,
    ClipboardCheck,
    MapPinned,
    Store,
    Utensils,
    BadgeCheck,
    type LucideIcon,
} from "lucide-react";

function cn(...classes: Array<string | undefined | false | null>) {
    return classes.filter(Boolean).join(" ");
}

type Tone = "emerald" | "blue" | "yellow" | "purple";

type Step = {
    title: string;
    description: string;
    icon: LucideIcon;
    tone: Tone;
};

const toneClasses: Record<
    Tone,
    { card: string; iconWrap: string }
> = {
    emerald: {
        card: "bg-emerald-50 dark:bg-emerald-950/40",
        iconWrap:
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    },
    blue: {
        card: "bg-blue-50 dark:bg-blue-950/40",
        iconWrap:
            "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    },
    yellow: {
        card: "bg-yellow-50 dark:bg-yellow-950/40",
        iconWrap:
            "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400",
    },
    purple: {
        card: "bg-purple-50 dark:bg-purple-950/40",
        iconWrap:
            "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
    },
};

const USER_STEPS: Step[] = [
    {
        title: "Add to cart",
        description: "First, visit menus, then choose a food and add to cart.",
        icon: ShoppingCart,
        tone: "emerald",
    },
    {
        title: "Place order",
        description:
            "After adding to cart, go to your dashboard and then place order.",
        icon: ClipboardCheck,
        tone: "blue",
    },
    {
        title: "Track your food",
        description:
            "After confirming order, you can keep track of your food from your dashboard.",
        icon: MapPinned,
        tone: "yellow",
    },
];

const PROVIDER_STEPS: Step[] = [
    {
        title: "Register restaurant",
        description:
            "After creating a provider profile, go & register your restaurant.",
        icon: Store,
        tone: "emerald",
    },
    {
        title: "Add meals",
        description:
            "After successfully adding restaurant, go and upload your meals.",
        icon: Utensils,
        tone: "blue",
    },
    {
        title: "Confirm order",
        description:
            "After getting orders make sure to change its status based on situation from dashboard.",
        icon: BadgeCheck,
        tone: "purple",
    },
];

type Rect = { left: number; top: number; width: number; height: number };

function getRectRelativeTo(el: HTMLElement, parent: HTMLElement): Rect {
    const r = el.getBoundingClientRect();
    const p = parent.getBoundingClientRect();
    return {
        left: r.left - p.left,
        top: r.top - p.top,
        width: r.width,
        height: r.height,
    };
}

function buildOrthPath(opts: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    midX: number;
    elbowGap?: number;
}) {
    const { start, end, midX, elbowGap = 14 } = opts;
    const yElbow = end.y - elbowGap;

    return `M ${start.x} ${start.y}
          L ${midX} ${start.y}
          L ${midX} ${yElbow}
          L ${end.x} ${yElbow}
          L ${end.x} ${end.y}`;
}

const StepCard = React.forwardRef<
    HTMLDivElement,
    { step: Step; className?: string }
>(function StepCard({ step, className }, ref) {
    const t = toneClasses[step.tone];

    return (
        <Card
            ref={ref}
            className={cn(
                "border-0 shadow-sm rounded-2xl",
                t.card,
                className
            )}
        >
            <CardHeader className="flex flex-row items-center gap-4">
                <div className={cn("p-3 rounded-xl", t.iconWrap)}>
                    <step.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-foreground">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
                {step.description}
            </CardContent>
        </Card>
    );
});

function CascadingFlow({ steps }: { steps: Step[] }) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const card1Ref = React.useRef<HTMLDivElement | null>(null);
    const card2Ref = React.useRef<HTMLDivElement | null>(null);
    const card3Ref = React.useRef<HTMLDivElement | null>(null);

    const [paths, setPaths] = React.useState<{ p1: string; p2: string } | null>(
        null
    );

    const recompute = React.useCallback(() => {
        const container = containerRef.current;
        const c1 = card1Ref.current;
        const c2 = card2Ref.current;
        const c3 = card3Ref.current;
        if (!container || !c1 || !c2 || !c3) return;

        const r1 = getRectRelativeTo(c1, container);
        const r2 = getRectRelativeTo(c2, container);
        const r3 = getRectRelativeTo(c3, container);

        // card1 (right middle) -> card2 (top center)
        const start1 = { x: r1.left + r1.width, y: r1.top + r1.height * 0.5 };
        const end1 = { x: r2.left + r2.width * 0.5, y: r2.top };
        const midX1 = (start1.x + end1.x) / 2;

        // card2 (left middle) -> card3 (top center)
        const start2 = { x: r2.left, y: r2.top + r2.height * 0.5 };
        const end2 = { x: r3.left + r3.width * 0.5, y: r3.top };
        const midX2 = (start2.x + end2.x) / 2;

        setPaths({
            p1: buildOrthPath({ start: start1, end: end1, midX: midX1 }),
            p2: buildOrthPath({ start: start2, end: end2, midX: midX2 }),
        });
    }, []);

    React.useEffect(() => {
        recompute();

        const container = containerRef.current;
        if (!container) return;

        const ro = new ResizeObserver(() => recompute());
        ro.observe(container);

        if (card1Ref.current) ro.observe(card1Ref.current);
        if (card2Ref.current) ro.observe(card2Ref.current);
        if (card3Ref.current) ro.observe(card3Ref.current);

        return () => ro.disconnect();
    }, [recompute]);

    return (
        <>
            {/* Mobile: stacked with dashed vertical connectors */}
            <div className="md:hidden space-y-4">
                <StepCard step={steps[0]} />
                <div className="mx-auto h-6 w-px border-l-2 border-dashed border-border/70" />
                <StepCard step={steps[1]} />
                <div className="mx-auto h-6 w-px border-l-2 border-dashed border-border/70" />
                <StepCard step={steps[2]} />
            </div>

            {/* Desktop: cascading like the sketch */}
            <div
                ref={containerRef}
                className="relative hidden md:block min-h-135 w-full"
            >
                {/* dashed connector lines */}
                <svg className="pointer-events-none absolute inset-0" width="100%" height="100%">
                    {paths && (
                        <>
                            <path
                                d={paths.p1}
                                fill="none"
                                stroke="currentColor"
                                className="text-border/70 dark:text-border/50"
                                strokeWidth={2}
                                strokeDasharray="7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d={paths.p2}
                                fill="none"
                                stroke="currentColor"
                                className="text-border/70 dark:text-border/50"
                                strokeWidth={2}
                                strokeDasharray="7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </>
                    )}
                </svg>

                {/* Card placement: left-top, right-mid, left-bottom */}
                <StepCard
                    ref={card1Ref}
                    step={steps[0]}
                    className="absolute left-0 top-0 w-90 max-w-[44vw]"
                />

                <StepCard
                    ref={card2Ref}
                    step={steps[1]}
                    className="absolute right-0 top-40 w-105 max-w-[48vw]"
                />

                <StepCard
                    ref={card3Ref}
                    step={steps[2]}
                    className="absolute left-0 top-90 w-90 max-w-[44vw]"
                />
            </div>
        </>
    );
}

export default function HowWeFunction() {
    const [tab, setTab] = React.useState<"user" | "provider">("user");

    // helps connectors instantly re-align when tab changes
    React.useEffect(() => {
        const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
        return () => clearTimeout(t);
    }, [tab]);

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 mt-10">
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    How We <span className="text-primary">Function</span>
                </h2>
            </div>

            <div className="mx-auto max-w-5xl">
                <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                    <div className="flex justify-center">
                        <TabsList className="rounded-full bg-muted p-1">
                            <TabsTrigger
                                value="user"
                                className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                User
                            </TabsTrigger>
                            <TabsTrigger
                                value="provider"
                                className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                Provider
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="mt-10">
                        <TabsContent value="user" className="m-0">
                            <CascadingFlow steps={USER_STEPS} />
                        </TabsContent>
                        <TabsContent value="provider" className="m-0">
                            <CascadingFlow steps={PROVIDER_STEPS} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </section>
    );
}
