// import { useEffect, useState } from "react";
// import type { Book } from "../types";

// const API_URL = "https://team-7-api.onrender.com/library/books/";

// export function useBook(id: string | number | undefined) {
//     const [book, setBook] = useState<Book | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (!id) return;

//         let mounted = true;
//         const fetchBook = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const res = await fetch(`${API_URL}${id}`);
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);

//                 const data = await res.json();
//                 if (mounted) setBook(data);
//             } catch (err: any) {
//                 if (mounted) setError(err.message);
//             } finally {
//                 if (mounted) setLoading(false);
//             }
//         };

//         fetchBook();
//         return () => { mounted = false };
//     }, [id]);

//     return { book, loading, error };
// }
// import { useEffect, useState } from "react";
// import type { Book } from "../book";

// const API_URL = "https://team-7-api.onrender.com/library/books/";

// export function useBook(id: string | number | undefined) {
//     const [book, setBook] = useState<Book | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (!id) return;

//         let mounted = true;

//         const fetchBook = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const res = await fetch(`${API_URL}${id}`);
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);

//                 const data = await res.json();
//                 const bookData = data.book ?? data.data ?? data;

//                 if (mounted) setBook(bookData);
//             } catch (err: any) {
//                 if (mounted) setError(err.message);
//             } finally {
//                 if (mounted) setLoading(false);
//             }
//         };

//         fetchBook();
//         return () => { mounted = false };
//     }, [id]);

//     return { book, loading, error };
// }
import { useEffect, useState } from "react";
import type { Book } from "../book";

function mapApiBook(apiBook: any): Book {
    return {
        ...apiBook,
        coverUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiBook.title)}&background=ECFDF5&color=10B981`,
        price: apiBook.is_free ? "Free" : apiBook.price,
        uploaded_by: apiBook.uploaded_by || { id: 0, username: "Unknown" },
    };
}

export function useBook(id: string) {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        async function fetchBook() {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://team-7-api.onrender.com/library/books/${id}/`
                );

                if (!res.ok) throw new Error("Failed to fetch book");

                const data = await res.json();


                console.log("BOOK RESPONSE =>", data); // 👈 ADD THIS
                setBook(data);

                setBook(mapApiBook(data));
            } catch (err) {
                setError("Could not load book");
            } finally {
                setLoading(false);
            }
        }

        fetchBook();
    }, [id]);

    return { book, loading, error };
}

