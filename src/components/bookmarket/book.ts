// // export interface ChapterProgress {
// //     current: number;
// //     total: number;
// // }

// // export interface Books {
// //     id: string | number;
// //     title: string;
// //     author?: string;
// //     uploader?: string;
// //     price: string;          // e.g. "Free" or "$4"
// //     image: string;          // image URL
// //     description?: string;
// //     progress?: number;      // percent 0-100 (optional)
// //     chapter?: ChapterProgress;
// //     relatedBooks?: Books[];
// }

export interface Book {
    id: string | number;
    title: string;
    author?: string;
    uploader?: string;
    price: number | string;
    image: string;
    description?: string;
    uploaded_by: {
        id: number;
        username: string;
    };
    is_free: boolean;
    progress?: number;
    category?: number;
    created_at: string;
    file: string;
    chapter?: {
        current: number;
        total: number;
    };
    relatedBooks?: Book[];
}



