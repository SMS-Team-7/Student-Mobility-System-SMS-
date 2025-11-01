import type { Books } from "../types";

export default function RelatedBookCard({ book, onClick }: { book: Books; onClick: (id: string | number) => void }) {
    return (
        <div
            onClick={() => onClick(book.id)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
            <img src={book.image} alt={book.title} className="w-10 h-10 rounded-md object-cover" />
            <div className="flex-1">
                <div className="text-sm font-medium">{book.title}</div>
                <div className="text-xs text-gray-500">{book.uploader || book.author}</div>
            </div>
            <div className={`text-sm font-semibold ${book.price === "Free" ? "text-green-600" : "text-gray-700"}`}>
                {book.price}
            </div>
        </div>
    );
}
