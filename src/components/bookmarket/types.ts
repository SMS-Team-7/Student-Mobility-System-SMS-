export type Book = {
    id: string;
    title: string;
    uploader: string;
    price: string;      // "Free" or "$10"
    timeAgo: string;    // "10 hours ago", "Yesterday"
    coverUrl?: string;  // optional cover image
    category?: string;
    isPaid?: boolean;
};


