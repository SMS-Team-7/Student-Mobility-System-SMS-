import { useParams, useNavigate } from "react-router-dom";
import { useBook } from "../hooks/usebookId";
import { ChevronLeft } from "lucide-react";

export default function BookReaderPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { book, loading, error } = useBook(id || "");

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
            Loading book...
        </div>
    );

    if (error || !book) return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
            Failed to load book
        </div>
    );

    const fileUrl = book.file; // ✅ your PDF URL from Supabase

    if (!fileUrl) return (
        <div className="min-h-screen flex items-center justify-center text-red-500 text-center p-4">
            ❌ This book has no readable file
        </div>
    );

    // ✅ Google PDF viewer
    const pdfViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;

    return (
        <div className="min-h-screen bg-white">

            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white rounded-full shadow"
                >
                    <ChevronLeft size={20} />
                </button>
                <h2 className="font-semibold text-lg">{book.title}</h2>
            </div>

            {/* PDF Viewer */}
            <iframe
                src={pdfViewerUrl}
                className="w-full h-[90vh]"
                title="PDF Reader"
            ></iframe>

        </div>
    );
}
