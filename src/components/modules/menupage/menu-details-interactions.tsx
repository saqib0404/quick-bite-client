"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Star, Trash2, Pencil, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { addToCartAction, createOrUpdateReviewAction, deleteReviewAction } from "@/app/(commonLayout)/menu-items/[id]/action";
import { Review } from "@/type";


function Stars({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < value ? "fill-current" : ""}`}
                />
            ))}
        </div>
    );
}

export function MenuDetailsInteractions(props: {
    menuItemId: string;
    isAvailable: boolean;
    isCustomer: boolean;
    userId: string | null;
    reviews: Review[];
}) {
    const router = useRouter();
    const [qty, setQty] = React.useState(1);

    const myReview = React.useMemo(() => {
        if (!props.userId) return null;
        return props.reviews.find((r) => r.userId === props.userId) ?? null;
    }, [props.reviews, props.userId]);

    const [rating, setRating] = React.useState<number>(myReview?.rating ?? 5);
    const [comment, setComment] = React.useState<string>(myReview?.comment ?? "");
    const [reviewOpen, setReviewOpen] = React.useState(false);

    React.useEffect(() => {

        setRating(myReview?.rating ?? 5);
        setComment(myReview?.comment ?? "");
    }, [myReview]);

    const [isPending, startTransition] = React.useTransition();
    const [isCartPending, startCartTransition] = React.useTransition();

    const canSeeActions = props.isCustomer && !!props.userId;

    async function handleAddToCart() {
        startCartTransition(async () => {
            const toastId = toast.loading("Adding to cart...");
            const res = await addToCartAction(props.menuItemId, qty);

            if (!res.ok) {
                toast.error(res.message, { id: toastId });
                return;
            }

            toast.success(res.message, { id: toastId });
            router.refresh();
        });
    }

    async function handleSaveReview() {
        startTransition(async () => {
            const toastId = toast.loading(myReview ? "Updating review..." : "Posting review...");

            const res = await createOrUpdateReviewAction({
                menuItemId: props.menuItemId,
                rating,
                comment: comment.trim() ? comment.trim() : undefined,
            });

            if (!res.ok) {
                toast.error(res.message, { id: toastId });
                return;
            }

            toast.success(res.message, { id: toastId });
            setReviewOpen(false);
            router.refresh();
        });
    }

    async function handleDeleteReview(reviewId: string) {
        startTransition(async () => {
            const toastId = toast.loading("Deleting review...");
            const res = await deleteReviewAction(props.menuItemId, reviewId);

            if (!res.ok) {
                toast.error(res.message, { id: toastId });
                return;
            }

            toast.success(res.message, { id: toastId });
            router.refresh();
        });
    }

    return (
        <div className="mt-8 space-y-8">
            {canSeeActions && (
                <Card className="p-4 md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-base font-semibold">Add to cart</h3>
                            <p className="text-sm text-muted-foreground">
                                Quantity and add this item to your cart.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                >
                                    -
                                </Button>
                                <div className="min-w-10 text-center text-sm font-medium">{qty}</div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                                >
                                    +
                                </Button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                disabled={!props.isAvailable || isCartPending}
                                className="gap-2"
                            >
                                {isCartPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                                {props.isAvailable ? "Add to Cart" : "Unavailable"}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Reviews */}
            {(props.reviews.length > 0 || canSeeActions) && (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold">Reviews</h3>
                            <p className="text-sm text-muted-foreground">
                                {props.reviews.length ? "What people are saying." : "No reviews yet."}
                            </p>
                        </div>

                        {canSeeActions && (
                            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        {myReview ? <Pencil className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                                        {myReview ? "Edit your review" : "Add a review"}
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{myReview ? "Update your review" : "Write a review"}</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Rating</Label>
                                            <div className="flex items-center gap-2">
                                                {([1, 2, 3, 4, 5] as const).map((v) => (
                                                    <Button
                                                        key={v}
                                                        type="button"
                                                        variant={rating === v ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setRating(v)}
                                                    >
                                                        {v}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Comment (optional)</Label>
                                            <Textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your experience…"
                                                className="min-h-28"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Note: You can only review items you have ordered. If you haven’t ordered yet, we’ll ask you to place an order first.
                                            </p>
                                        </div>

                                        <Button onClick={handleSaveReview} disabled={isPending} className="w-full">
                                            {isPending ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Saving…
                                                </span>
                                            ) : (
                                                "Save Review"
                                            )}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {props.reviews.length > 0 && <Separator />}

                    {props.reviews.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-2">
                            {props.reviews.map((r) => {
                                const isMine = props.userId && r.userId === props.userId;

                                return (
                                    <Card key={r.id} className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={r.user?.image ?? ""} />
                                                    <AvatarFallback>
                                                        {(r.user?.name ?? "U").slice(0, 1).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium leading-none">{r.user?.name ?? "User"}</div>
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {new Date(r.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {isMine && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete your review?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteReview(r.id)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <Stars value={r.rating} />
                                            {isMine && <Badge variant="secondary">Your review</Badge>}
                                        </div>

                                        {r.comment ? (
                                            <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>
                                        ) : null}
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
