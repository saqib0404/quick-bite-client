export type ReviewUser = {
    id: string;
    name: string;
    image?: string | null;
};

export type Review = {
    id: string;
    userId: string;
    menuItemId: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
    updatedAt: string;
    user: ReviewUser;
};
