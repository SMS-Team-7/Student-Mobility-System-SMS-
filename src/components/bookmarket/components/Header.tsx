
import { Search } from "lucide-react";

export default function Header({
    onSearch,
    query,
}: {
    onSearch: (q: string) => void;
    query: string;
}) {
    return (
        <div className="pt-6 pb-4 px-4">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 flex-1 shadow-sm">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search"
                        className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                    />
                </div>
                <button
                    aria-label="filters"
                    className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center"
                >
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none">
                        <path d="M6 10h12M10 6h4M8 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
