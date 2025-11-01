import { Link } from "react-router-dom";
import type { Book } from "../types";

export default function BookCard({ book }: { book: Book }) {
    return (
        <Link to={`/book/${book.id}`} className="block">
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                    <img
                        src={book.coverUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=ECFDF5&color=10B981`}
                        alt={book.title}
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                        <div className="font-semibold text-sm">{book.title}</div>
                        <div className="text-xs text-gray-500">Uploaded by: {book.uploader}</div>
                    </div>
                </div>

                <div className="text-right">
                    <div className={`font-semibold ${book.price === "Free" ? "text-green-600" : "text-gray-800"}`}>
                        {book.price}
                    </div>
                    <div className="text-xs text-gray-400">{book.timeAgo}</div>
                </div>
            </div>
        </Link>
    );
}
