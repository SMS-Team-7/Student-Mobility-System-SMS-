// import { useEffect, useState } from "react";
// import type { Book } from "../types";

// const API_URL = "https://your-api.example.com/books"; // <-- replace with real endpoint

// export function useBooks() {
//     const [books, setBooks] = useState<Book[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         let mounted = true;
//         const fetchBooks = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const res = await fetch(API_URL);
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 const data = await res.json();
//                 // Expecting data as Book[]; map if needed
//                 if (mounted) setBooks(data);
//             } catch (err: any) {
//                 if (mounted) setError(err.message || "Failed to load");
//             } finally {
//                 if (mounted) setLoading(false);
//             }
//         };

//         fetchBooks();
//         return () => { mounted = false; };
//     }, []);

//     return { books, loading, error, setBooks };
// }
import { useEffect, useState } from "react";
import type { Book } from "../types";

const API_URL = "https://team-7-api.onrender.com/library/books/";

export function useBooks(searchQuery: string = "") {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                // Build URL with search parameter if provided
                const url = searchQuery
                    ? `${API_URL}?search=${encodeURIComponent(searchQuery)}`
                    : API_URL;

                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        // Add authorization header if needed
                        // 'Authorization': 'Bearer YOUR_TOKEN'
                    }
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();

                if (mounted) {
                    setBooks(data);
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err.message || "Failed to load");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchBooks();

        return () => { mounted = false; };
    }, [searchQuery]); // Re-fetch when search query changes

    return { books, loading, error, setBooks };
}