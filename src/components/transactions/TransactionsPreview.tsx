import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { RiEqualizerFill } from "react-icons/ri";
import FilterPanel from "./FilterPanel";
import { useAuthContext } from "../../context/AuthContext";
import { RefreshCw } from "lucide-react";

interface Transaction {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  type?: string;
  note?: string;
  date?: string;
  created_at?: string;
  timestamp?: string;
  time?: string;
  amount: number;
  positive?: boolean;
  favorite?: boolean;
}

const TransactionsPreview = () => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const authToken = token || localStorage.getItem("authToken");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    date: "all",
    direction: "all",
  });
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "https://team-7-api.onrender.com/reward/";

  useEffect(() => {
    if (!authToken) return;
    fetchTransactions();
  }, [authToken]);

  const fetchTransactions = async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("Failed to fetch transactions");

      let txList: Transaction[] = [];
      if (Array.isArray(data.transactions)) txList = data.transactions;
      else if (Array.isArray(data.activities)) txList = data.activities;
      else if (Array.isArray(data)) txList = data;

      const formatted = txList.map((t, i) => ({
        id: t.id ?? i.toString(),
        title: t.title ?? t.type ?? "Activity",
        subtitle: t.description ?? t.note ?? "No details",
        amount: typeof t.amount === "number" ? t.amount : 0,
        date:
          t.created_at ?? t.timestamp ?? new Date().toISOString().split("T")[0],
        time: new Date(
          t.created_at || t.timestamp || Date.now()
        ).toLocaleTimeString(),
        positive: t.amount ? t.amount >= 0 : false,
      }));

      setTransactions(formatted);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to load transactions");
    } finally {
      setLoading(false);
    }
  };

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filteredTx = transactions
    .filter((t) => {
      if (activeTab === "favorites") return t.favorite === true;
      return true;
    })
    .filter((t) => {
      if (filters.type !== "all" && t.type !== filters.type) return false;
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
        const txDate = new Date(t.date || "");
        return txDate >= weekAgo && txDate <= now;
      }

      if (filters.date === "month") {
        const now = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        const txDate = new Date(t.date || "");
        return txDate >= monthAgo && txDate <= now;
      }

      return true;
    })
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 3);

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-black text-2xl">Transactions</h2>
        <button
          aria-label="see-all"
          className="text-sm text-green-500"
          onClick={() => navigate("/transactions")}
        >
          See all
        </button>
      </div>

      {/* Tabs and Filter */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("recent")}
              className={`text-sm font-medium ${
                activeTab === "recent"
                  ? "text-pri bg-pri/20 py-1 px-3 rounded-3xl"
                  : "text-black/70"
              } pb-1`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`text-sm font-medium ${
                activeTab === "favorites"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-black/70"
              } pb-1`}
            >
              Favorites
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTransactions}
            aria-label="refresh"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <RefreshCw className="w-5 h-5 text-pri" />
          </button>
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            aria-label="filter"
            className="p-2 border-3 border-white/20 rounded-full "
          >
            <RiEqualizerFill className="w-5 h-5 text-pri" />
          </button>
        </div>
      </div>

      {/* Inline Filter Panel */}
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

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <RefreshCw className="w-6 h-6 text-green-600" />
          </motion.div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="space-y-3">
          {filteredTx.length === 0 ? (
            <p className="text-sm text-gray-500">No recent transactions yet.</p>
          ) : (
            filteredTx.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-3 rounded-lg"
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
                    <div className="font-semibold text-black/80">{t.title}</div>
                    <div className="text-sm text-[#000000]/48">
                      {t.subtitle}
                    </div>
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
                  <div className="text-xs text-[#000000]/48 mt-1">{t.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionsPreview;
