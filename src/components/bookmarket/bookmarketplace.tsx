
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import CategoryPill from "./components/categoryPill";
import BookCard from "./components/bookcard";
import { useBooks } from "./hooks/usebooks";
import type { Book } from "./types";
import { upload, bookImg } from "../../assets/images";
import UploadBookForm from "./components/uploadBookForm";
import { Palette, Briefcase, Wrench, Leaf, Atom, Building } from "lucide-react";

// ✅ Time-ago formatter
function formatTimeAgo(dateString: string) {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals: Record<string, number> = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const key in intervals) {
        const value = Math.floor(seconds / intervals[key]);
        if (value > 0) return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }

    return "Just now";
}

// ✅ Convert API book format to your UI format
function mapApiBook(b: any): Book {
    return {
        id: b.id,
        title: b.title,
        uploader: b.uploaded_by?.username || b.user?.username || "Unknown",
        price: b.is_free ? "Free" : `₦${b.price}`,
        coverUrl: b.file || null,
        timeAgo: formatTimeAgo(b.created_at),
        category: b.book_type || "other"
    };
}

const CATEGORY_LIST = [
    { id: "arts", label: "Arts", icon: <Palette size={22} /> },
    { id: "business", label: "Business", icon: <Briefcase size={22} /> },
    { id: "mechanics", label: "Mechanics", icon: <Wrench size={22} /> },
    { id: "nature", label: "Nature", icon: <Leaf size={22} /> },
    { id: "physics", label: "Physics", icon: <Atom size={22} /> },
    { id: "engineering", label: "Engineering", icon: <Building size={22} /> }
];

const TABS = ["All", "Free", "Paid"];

export default function BookMarketplacePage() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeTab, setActiveTab] = useState("All");
    const [showUploadForm, setShowUploadForm] = useState(false);

    // ✅ Local book list so we can add freshly-uploaded books instantly
    const [booksList, setBooksList] = useState<Book[]>([]);

    const { books, loading, error } = useBooks(debouncedQuery);

    // ✅ Sync local list with server results when loaded
    useEffect(() => {
        setBooksList(books.map(mapApiBook));
    }, [books]);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timeout);
    }, [query]);

    const filtered = useMemo(() => {
        let list = booksList;

        if (activeCategory !== "all")
            list = list.filter((b) => b.category === activeCategory);

        if (activeTab === "Free")
            list = list.filter((b) => b.price === "Free");

        if (activeTab === "Paid")
            list = list.filter((b) => b.price !== "Free");

        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                (b) =>
                    b.title.toLowerCase().includes(q) ||
                    b.uploader.toLowerCase().includes(q)
            );
        }

        return list;
    }, [booksList, activeCategory, activeTab, query]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#E8FFF4] via-[#E9FFF6] to-white">
            <Header onSearch={setQuery} query={query} />

            {/* Banner */}
            <div className="px-4 mt-2">
                <div className="relative w-full h-40 rounded-2xl bg-gradient-to-r from-[#00C317] to-[#16A34A] text-white flex items-center overflow-hidden">
                    <div className="pl-4 font-bold text-lg">
                        Upload Your <br /> Books
                    </div>

                    <img src={bookImg} alt="books" className="absolute left-1/2 bottom-0 w-40 h-20 -translate-x-1/2 -translate-y-1/2" />

                    <button
                        onClick={() => setShowUploadForm(true)}
                        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full"
                    >
                        <img src={upload} alt="upload" className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="mt-4 px-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Categories</h3>
                    <p className="text-xs text-blue-600 cursor-pointer">See all</p>
                </div>

                <div className="flex gap-3 overflow-x-auto py-2">
                    {CATEGORY_LIST.map((c) => (
                        <CategoryPill
                            key={c.id}
                            label={c.label}
                            Icon={c.icon}
                            active={activeCategory === c.id}
                            onClick={() => setActiveCategory(c.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 mt-3">
                <div className="flex gap-3 bg-white p-2 rounded-full">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`flex-1 text-sm py-1 rounded-full font-medium ${activeTab === t ? "bg-green-600 text-white" : "text-gray-600"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Book List */}
            <div className="px-4 mt-4 space-y-3 pb-32">
                {loading && <p className="text-center text-sm text-gray-500">Loading...</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {!loading && filtered.length === 0 && <p className="text-center text-sm text-gray-400">No books found.</p>}
                {filtered.map((b) => (
                    <BookCard key={b.id} book={b} />
                ))}
            </div>

            {/* Upload Modal */}
            {showUploadForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <UploadBookForm
                        onClose={() => setShowUploadForm(false)}
                        onUploadSuccess={(newBook: any) => {
                            const mapped = mapApiBook(newBook);
                            setBooksList((prev) => [mapped, ...prev]); // ✅ Add new to top
                            setShowUploadForm(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
