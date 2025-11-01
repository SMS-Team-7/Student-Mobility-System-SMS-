import { RiFileList3Fill } from "react-icons/ri";
import type { Book } from "./types";

type Props = {
  book: Book;
  onReadAgain: () => void;
};

export default function CompletedReadItem({ book, onReadAgain }: Props) {
  return (
    <div className="grid grid-cols-[29%_68%]  items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
      {/* cover + small check badge */}
      <div className="relative overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover rounded-md border"
        />
        <div className="absolute top-0 right-1 text-pri bg-white rounded text-xs">
          <RiFileList3Fill size={20} className="hidden" />
        </div>
        <div className="absolute right-0 bottom-0.5 text-xs text-white rounded-tr">
          {book.category === "NATURE" ? (
            <span className="bg-[#10b981] px-2 py-0.5 font-semibold rounded">
              {book.category}
            </span>
          ) : (
            <span className="bg-[#1e3a8a] px-2 py-0.5 font-semibold rounded">
              {book.category}
            </span>
          )}
        </div>
      </div>

      {/* details */}
      <div className="flex-1">
        <h4 className="font-semibold">{book.title}</h4>
        <p className="text-sm text-black/64 font-medium">by {book.author}</p>

        <div className="flex gap-2 mt-2">
          <div className="text-[11px] border whitespace-nowrap border-pri text-pri font-medium px-1.5 py-0.5 rounded-full">
            {book.daysReading ?? 0} Days Reading
          </div>
          <div className="text-[11px] border whitespace-nowrap border-pri text-pri font-medium px-1.5 py-0.5 rounded-full">
            {book.tokensReceived ?? 0} tokens received
          </div>
        </div>
        {/* Read Again button */}
        <div className="w-full mt-2">
          <button
            onClick={onReadAgain}
            className="w-full bg-[#dddddd] cursor-pointer text-black py-2 rounded-full font-semibold"
          >
            Read Again
          </button>
        </div>
      </div>
    </div>
  );
}
