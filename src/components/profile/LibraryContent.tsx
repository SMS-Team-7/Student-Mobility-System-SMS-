import { useMemo, useState } from "react";
import CurrentReadItem from "./CurrentReadItem";
import CompletedReadItem from "./CompletedReadItem";
import type { Book } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Book1 from "../../assets/profile-icons/book1.jpg";
import Book2 from "../../assets/profile-icons/book2.jpg";
import Book3 from "../../assets/profile-icons/book3.jpg";
import Completed1 from "../../assets/profile-icons/completed1.jpg";
import Completed2 from "../../assets/profile-icons/completed2.jpg";
import Completed3 from "../../assets/profile-icons/completed3.jpg";
import BookIcon from "../../assets/profile-icons/book2.svg?react";
import { RiFlagFill } from "react-icons/ri";

/**
 * LibraryContent
 * - Shows Current Reads section (with Continue Reading)
 * - Shows Completed Reads section (with Read Again)
 * - Pagination controls (left arrow / page dots / right arrow)
 *
 * Replace mock arrays with API calls when ready.
 */

const MOCK_BOOKS: Book[] = [
  {
    id: "b1",
    title: "Beyond Profits",
    author: "Julian West",
    category: "BUSINESS",
    cover: Book1,
    description:
      "Redefines success through sustainable and human-centered business models.",
    progress: 52,
    completed: false,
  },
  {
    id: "b2",
    title: "The Billion Dollar Habit",
    author: "Clara Mendez",
    category: "BUSINESS",
    cover: Book2,
    description:
      "Unveils the daily rituals and mental models behind world-changing businesses.",
    progress: 34,
    completed: false,
  },
  {
    id: "b3",
    title: "Whispers of the Wild",
    author: "Amara Fields",
    category: "NATURE",
    cover: Book3,
    description:
      "A poetic journey into the untouched corners of nature, where every leaf has a story.",
    progress: 14,
    completed: false,
  },
  {
    id: "b1",
    title: "Beyond Profits",
    author: "Julian West",
    category: "BUSINESS",
    cover: Book1,
    description:
      "Redefines success through sustainable and human-centered business models.",
    progress: 52,
    completed: false,
  },

  // Completed reads
  {
    id: "c1",
    title: "Riversong",
    author: "Lena Brooks",
    category: "NATURE",
    cover: Completed1,
    completed: true,
    daysReading: 23,
    tokensReceived: 100,
  },
  {
    id: "c2",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "TECH",
    cover: Completed2,
    completed: true,
    daysReading: 23,
    tokensReceived: 100,
  },
  {
    id: "c3",
    title: "The Geography of Bliss",
    author: "Eric Weiner",
    category: "NATURE",
    cover: Completed3,
    completed: true,
    daysReading: 23,
    tokensReceived: 100,
  },
];

const LibraryContent = () => {
  const navigate = useNavigate();

  // two pages example — for real data you'd use backend pagination
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;

  // split into current vs completed arrays
  const currentReads = useMemo(
    () =>
      MOCK_BOOKS.filter((b) => !b.completed).slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      ),
    [page]
  );

  const completedReads = useMemo(
    () =>
      MOCK_BOOKS.filter((b) => b.completed).slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      ),
    [page]
  );

  const totalPages = 3; // match design (1 2 3). For live data compute from counts.

  // handlers
  const goToBook = (id: string) => {
    // navigate to book detail or reader page
    navigate(`/book/${id}`);
  };

  return (
    <div className="max-w-md bg-white rounded-md mx-auto">
      {/* CURRENT READS Header */}
      <div className="flex  rounded p-2 items-center gap-3 mt-6">
        <div className="">
          <BookIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl text-black font-bold">Current Reads</h2>
      </div>

      {/* Current Reads list */}
      <div className="mt-4 space-y-4">
        {currentReads.map((b) => (
          <CurrentReadItem
            key={b.id}
            book={b}
            onContinue={() => goToBook(b.id)}
          />
        ))}
      </div>

      {/* pagination row (current reads) */}
      <div className="flex items-center justify-between mt-6">
        <button
          aria-label="prev"
          className="w-10 h-10 flex cursor-pointer transition duration-200 ease-out hover:bg-pri hover:text-white items-center justify-center rounded-full border border-pri"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-3">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                page === n ? "bg-pri text-white" : "text-black"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          aria-label="next"
          className="w-10 h-10 flex cursor-pointer transition duration-200 ease-out hover:bg-pri hover:text-white items-center justify-center rounded-full border border-pri"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          <ChevronRight />
        </button>
      </div>

      {/* COMPLETED READS */}
      <div className="mt-10">
        <div className="flex bg-white/70 rounded-sm p-2 items-center gap-3">
          <div className="">
            <RiFlagFill className="w-7 h-7 text-pri" />
          </div>
          <h3 className="text-2xl font-bold">Completed Reads</h3>
        </div>

        <div className="mt-4 space-y-4">
          {completedReads.map((b) => (
            <CompletedReadItem
              key={b.id}
              book={b}
              onReadAgain={() => goToBook(b.id)}
            />
          ))}
        </div>

        {/* pagination for completed reads (shared with current for simplicity) */}
        <div className="flex items-center justify-between mt-6">
          <button
            aria-label="next-completed"
            className="w-10 h-10 flex cursor-pointer transition duration-200 ease-out hover:bg-pri hover:text-white items-center justify-center rounded-full border border-pri"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft />
          </button>

          <div className="flex items-center gap-3">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  page === n ? "bg-pri text-white" : " text-black"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            aria-label="next-completed"
            className="w-10 h-10 flex cursor-pointer transition duration-200 ease-out hover:bg-pri hover:text-white items-center justify-center rounded-full border border-pri"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryContent;
