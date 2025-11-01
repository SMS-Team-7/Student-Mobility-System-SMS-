import type { Book } from "./types";

type Props = {
  book: Book;
  onContinue: () => void;
};

export default function CurrentReadItem({ book, onContinue }: Props) {
  const progress = Math.max(0, Math.min(100, book.progress ?? 0));

  return (
    <div className="grid grid-cols-[32%_65%] gap-4 bg-white rounded-xl py-4 px-3 shadow-sm">
      {/* Left: cover + category tag */}
      <div className="relative overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className=" object-cover w-full h-full rounded-lg border"
        />
        {/* category tag bottom-left */}
        <div className="absolute right-0 bottom-1 text-white text-xs ">
          {book.category === "BUSINESS" ? (
            <span className="bg-[#1e3a8a] px-2 py-1 font-semibold rounded">
              {book.category}
            </span>
          ) : (
            <span className="bg-[#10b981] px-2 py-1 font-semibold rounded">
              {book.category}
            </span>
          )}
        </div>
      </div>

      {/* Middle: details */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className=" font-semibold">{book.title}</h4>
            <p className="text-sm text-gray-600 font-medium">
              by {book.author}
            </p>
          </div>

          {/* progress pill (right) */}
          <div className="whitespace-nowrap font-medium">
            <div className="border rounded-full px-3 py-1 text-xs text-pri">
              {progress}% Complete
            </div>
          </div>
        </div>
        {book.description && (
          <p className="text-sm text-black/60 mt-2 line-clamp-2">
            {book.description}
          </p>
        )}

        {/* progress bar */}
        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Continue Reading button */}
        <div className="mt-4">
          <button
            onClick={onContinue}
            className="w-full bg-green-500 cursor-pointer text-white font-semibold py-2 rounded-full shadow-md"
          >
            Continue Reading
          </button>
        </div>
      </div>
    </div>
  );
}
