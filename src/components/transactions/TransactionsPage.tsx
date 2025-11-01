import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MoveDownLeft, MoveUpRight, ChevronLeft } from "lucide-react";
import { RiEqualizerFill } from "react-icons/ri";
import FilterPanel from "./FilterPanel";

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  positive: boolean;
  date: string;
  time: string;
  favorite?: boolean;
}

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    type: "all",
    date: "all",
    direction: "all",
  });

  // Fetch transactions (replace with your backend endpoint)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("https://team-7-api.onrender.com/api/rewards", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (data?.data) setTransactions(data.data);
      })
      .catch((err) => console.error("Failed to fetch transactions:", err))
      .finally(() => setLoading(false));
  }, []);

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filteredTx = transactions
    .filter((t) => {
      if (activeTab === "favorites") return t.favorite === true;
      return true;
    })
    .filter((t) => {
      if (filters.direction === "income" && !t.positive) return false;
      if (filters.direction === "expense" && t.positive) return false;
      if (filters.date === "today") {
        const today = new Date().toISOString().split("T")[0];
        return t.date === today;
      }
      if (filters.date === "week") {
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        const txDate = new Date(t.date);
        return txDate >= weekAgo && txDate <= now;
      }
      if (filters.date === "month") {
        const now = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        const txDate = new Date(t.date);
        return txDate >= monthAgo && txDate <= now;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 70, damping: 15 }}
      className="fixed inset-0 bg-gray-50 p-4 overflow-y-auto z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-black">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold">Transactions</h2>
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          aria-label="filter"
          className="p-2 bg-white rounded-full shadow"
        >
          <RiEqualizerFill className="w-5 h-5 text-pri" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setActiveTab("recent")}
          className={`text-sm font-medium ${
            activeTab === "recent"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          } pb-1`}
        >
          Recent
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`text-sm font-medium ${
            activeTab === "favorites"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          } pb-1`}
        >
          Favorites
        </button>
      </div>

      {/* Inline Filter */}
      {showFilter && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-3"
        >
          <FilterPanel filters={filters} onChange={handleFilterChange} />
        </motion.div>
      )}

      {/* Transactions */}
      {loading ? (
        <p className="text-center text-gray-500 mt-6">Loading...</p>
      ) : filteredTx.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">No transactions found</p>
      ) : (
        <div className="space-y-3">
          {filteredTx.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    t.positive ? "bg-pri/14" : "bg-red-100"
                  }`}
                >
                  {t.positive ? (
                    <MoveDownLeft className="text-pri" />
                  ) : (
                    <MoveUpRight className="text-[#f60202]" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-black">{t.title}</div>
                  <div className="text-sm text-gray-500">{t.subtitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`${
                    t.positive ? "text-green-600" : "text-red-500"
                  } font-medium`}
                >
                  {t.amount > 0 ? +`${t.amount}` : t.amount}
                </div>
                <div className="text-xs text-gray-400 mt-1">{t.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TransactionsPage;
