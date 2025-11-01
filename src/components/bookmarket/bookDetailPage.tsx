


// import { useParams, useNavigate } from "react-router-dom";
// import { useBook } from "./hooks/usebookId";
// import ProgressBar from "./components/progressBar";
// import CTAButton from "./components/CTAButton";
// import { useCallback } from "react";
// import { ChevronLeft } from "lucide-react";

// function formatTimeAgo(dateString: string) {
//     const date = new Date(dateString);
//     const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

//     const intervals: any = {
//         year: 31536000,
//         month: 2592000,
//         day: 86400,
//         hour: 3600,
//         minute: 60,
//     };

//     for (let key in intervals) {
//         const interval = Math.floor(seconds / intervals[key]);
//         if (interval >= 1) {
//             return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
//         }
//     }
//     return "Just now";
// }

// export default function BookDetailPage() {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const { book, loading, error } = useBook(id || "");

//     const handleDownload = useCallback(() => {
//         if (!book?.file) return alert("No file available");
//         window.open(book.file, "_blank");
//     }, [book]);

//     const handleContinueReading = useCallback(() => {
//         navigate(`/reader/${book?.id}`);
//     }, [navigate, book]);

//     if (loading)
//         return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//     if (error || !book)
//         return <div className="min-h-screen flex items-center justify-center text-red-600">Error loading book</div>;

//     const isFree = book.is_free === true;
//     const uploader = book.uploaded_by?.username ?? "Unknown uploader";
//     const priceDisplay = isFree ? "Free" : `₦${book.price}`;
//     const timeAgo = formatTimeAgo(book.created_at);
//     const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//         book.title
//     )}&background=ECFDF5&color=10B981`;

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-[#E8FFF4] to-white">
//             <div className="max-w-md mx-auto py-6 px-4">

//                 {/* Header */}
//                 <div className="flex items-center gap-3 mb-4">
//                     <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/60"><ChevronLeft size={22} /></button>
//                     <div className="text-sm text-gray-700">Book Marketplace</div>
//                 </div>

//                 {/* Book Card */}
//                 <div className="bg-white rounded-xl p-4 shadow-md">
//                     <div className="flex items-start gap-4">
//                         <img src={image} alt={book.title} className="w-36 h-36 rounded-lg object-cover" />

//                         <div className="flex-1">
//                             <h1 className="font-bold text-lg">{book.title}</h1>
//                             <div className="text-xs text-gray-500 mt-1">
//                                 Uploaded by: {uploader} · {timeAgo}
//                             </div>
//                             <div className="mt-2 text-lg font-semibold">{priceDisplay}</div>
//                         </div>
//                     </div>

//                     <div className="mt-4 text-sm text-gray-700">
//                         <p>{book.description}</p>
//                     </div>

//                     <div className="mt-4">
//                         <CTAButton
//                             label={isFree ? "Download" : "Buy Book"}
//                             onClick={isFree ? handleDownload : () => alert("Add Payment Logic")}
//                         />
//                     </div>

//                     {/* Reading Section */}
//                     <div className="mt-5 p-3 bg-gray-50 rounded-lg">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <div className="text-sm font-semibold">Read Online</div>
//                                 <div className="text-xs text-gray-500">Earn tokens as you read</div>
//                             </div>
//                         </div>

//                         <div className="mt-3">
//                             <ProgressBar percent={0} />
//                         </div>

//                         <div className="mt-3">
//                             <CTAButton label="Start Reading" onClick={handleContinueReading} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useParams, useNavigate } from "react-router-dom";
import { useBook } from "./hooks/usebookId";
import ProgressBar from "./components/progressBar";
import CTAButton from "./components/CTAButton";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals: any = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (let key in intervals) {
        const interval = Math.floor(seconds / intervals[key]);
        if (interval >= 1) {
            return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
}

export default function BookDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { book: apiBook, loading } = useBook(id || "");
    const [localBook, setLocalBook] = useState<any>(null);

    // ✅ Check localStorage when API fails
    useEffect(() => {
        if (apiBook) return; // API worked

        const saved = JSON.parse(localStorage.getItem("uploadedBooks") || "[]");
        const found = saved.find((b: any) => b.id === id);

        if (found) setLocalBook(found);
    }, [apiBook, id]);

    const book = apiBook || localBook;

    const handleDownload = useCallback(() => {
        if (!book?.file && !book?.coverUrl)
            return alert("No file available");

        window.open(book.file || book.coverUrl, "_blank");
    }, [book]);

    const handleContinueReading = useCallback(() => {
        navigate(`/reader/${book?.id}`);
    }, [navigate, book]);

    if (loading && !localBook)
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!book)
        return <div className="min-h-screen flex items-center justify-center text-red-600">Book not found</div>;

    const isFree = book.price === "Free" || book.is_free === true;
    const uploader = book.uploader || book.uploaded_by?.username || "Unknown uploader";
    const priceDisplay = isFree ? "Free" : book.price;
    const timeAgo = book.timeAgo || formatTimeAgo(book.created_at);
    const image = book.coverUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=ECFDF5&color=10B981`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E8FFF4] to-white">
            <div className="max-w-md mx-auto py-6 px-4">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/60">
                        <ChevronLeft size={22} />
                    </button>
                    <div className="text-sm text-gray-700">Book Marketplace</div>
                </div>

                {/* Book Card */}
                <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="flex items-start gap-4">
                        <img src={image} alt={book.title} className="w-36 h-36 rounded-lg object-cover" />

                        <div className="flex-1">
                            <h1 className="font-bold text-lg">{book.title}</h1>
                            <div className="text-xs text-gray-500 mt-1">
                                Uploaded by: {uploader} · {timeAgo}
                            </div>
                            <div className="mt-2 text-lg font-semibold">{priceDisplay}</div>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-700">
                        <p>{book.description || "No description available."}</p>
                    </div>

                    <div className="mt-4">
                        <CTAButton
                            label={isFree ? "Download" : "Buy Book"}
                            onClick={isFree ? handleDownload : () => alert("Add Payment Logic")}
                        />
                    </div>

                    {/* Reading Section */}
                    <div className="mt-5 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold">Read Online</div>
                                <div className="text-xs text-gray-500">Earn tokens as you read</div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <ProgressBar percent={Number(localStorage.getItem(`reading-progress-${book.id}`)) || 0} />


                        </div>

                        <div className="mt-3">
                            <CTAButton label="Start Reading" onClick={handleContinueReading} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
