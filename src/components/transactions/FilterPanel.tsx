interface Props {
  filters: {
    type: string;
    date: string;
    direction: string;
  };
  onChange: (key: string, value: string) => void;
}

const FilterPanel = ({ filters, onChange }: Props) => {
  return (
    <div className="p-3 bg-white rounded-lg shadow-md space-y-3 text-sm">
      {/* Type Filter */}
      <div>
        <label className="block text-gray-600 mb-1 font-medium">Type</label>
        <div className="flex gap-2 flex-wrap">
          {["all", "deposit", "withdrawal", "reward", "transfer"].map((t) => (
            <button
              key={t}
              onClick={() => onChange("type", t)}
              className={`px-3 py-1 rounded-full border text-xs ${
                filters.type === t
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-gray-600 mb-1 font-medium">Date</label>
        <div className="flex gap-2">
          {["all", "today", "week", "month"].map((d) => (
            <button
              key={d}
              onClick={() => onChange("date", d)}
              className={`px-3 py-1 rounded-full border text-xs ${
                filters.date === d
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {d === "all"
                ? "All time"
                : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Direction Filter */}
      <div>
        <label className="block text-gray-600 mb-1 font-medium">
          Direction
        </label>
        <div className="flex gap-2">
          {["all", "income", "expense"].map((dir) => (
            <button
              key={dir}
              onClick={() => onChange("direction", dir)}
              className={`px-3 py-1 rounded-full border text-xs ${
                filters.direction === dir
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {dir.charAt(0).toUpperCase() + dir.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
