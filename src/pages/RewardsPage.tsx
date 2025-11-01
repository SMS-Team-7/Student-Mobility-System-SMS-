import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

interface Activity {
  title?: string;
  type?: string;
  description?: string;
  note?: string;
  created_at?: string;
  timestamp?: string;
  amount?: number;
}

export default function RewardsPage() {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const authToken = token || localStorage.getItem("authToken");

  // UI states
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [hederaBalance, setHederaBalance] = useState<number | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Transfer modal state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState<number | "">("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const API = {
    base: "https://team-7-api.onrender.com",
    reward: "/reward/",
    balance: "/reward/balance/",
    hederaBalance: "/reward/hedera/balance/",
    hederaTransfer: "/reward/hedera/transfer/",
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, [authToken]);

  const fetchAll = async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchBalance(), fetchHedera(), fetchActivities()]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API.base}${API.balance}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Balance fetch failed");
      setBalance(typeof data.balance === "number" ? data.balance : 0);
    } catch (err) {
      console.error(err);
      setBalance(0);
    }
  };

  const fetchHedera = async () => {
    try {
      const res = await fetch(`${API.base}${API.hederaBalance}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("Failed to fetch Hedera balance");
      setHederaBalance(data.balance ?? data.hedera_balance ?? null);
    } catch (err) {
      console.error(err);
      setHederaBalance(null);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API.base}${API.reward}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("Failed to fetch activities");

      if (Array.isArray(data.transactions)) setActivities(data.transactions);
      else if (Array.isArray(data.activities)) setActivities(data.activities);
      else if (Array.isArray(data)) setActivities(data);
      else setActivities([]);
    } catch (err) {
      console.error(err);
      setActivities([]);
    }
  };

  const handleTransfer = async () => {
    if (!authToken) return setError("Not logged in");
    if (!transferRecipient || !transferAmount || Number(transferAmount) <= 0)
      return setError("Please enter a valid recipient and amount");

    setTransferLoading(true);
    setTransferSuccess(null);
    setError(null);

    try {
      const res = await fetch(`${API.base}${API.hederaTransfer}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          recipient: transferRecipient,
          amount: +transferAmount,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          body.detail || body.error || body.message || "Transfer failed";
        throw new Error(msg);
      }

      setTransferSuccess("✅ Transfer successful!");
      await Promise.all([fetchBalance(), fetchHedera(), fetchActivities()]);
      setTimeout(() => setIsTransferOpen(false), 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Transfer failed");
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-semibold">Rewards</h1>
        <button
          onClick={fetchAll}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <RefreshCw />
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <RefreshCw className="w-6 h-6 text-green-600" />
          </motion.div>
          <p className="mt-3 text-gray-500 text-sm">Fetching your rewards...</p>
        </div>
      ) : (
        <>
          {/* Balance Card */}
          <div className="bg-linear-to-br from-pri to-green-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-[15px] font-medium text-center opacity-90">
              Your Balance
            </p>
            <div className="flex justify-center items-center flex-col gap-3">
              <h2 className="text-4xl font-bold tracking-tight">
                {balance === null ? "—" : balance.toFixed(2)}
              </h2>
              <span className="text-sm opacity-80">tokens</span>
            </div>
            <p className="text-sm text-center font-medium  mt-2 opacity-90">
              Hedera: {hederaBalance == null ? "—" : hederaBalance}
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                className="bg-white text-black font-bold cursor-pointer px-4 py-2 rounded-full"
                onClick={() => navigate("/book-ride")}
              >
                Book a ride
              </button>
              <button
                className="bg-white text-black font-bold cursor-pointer px-4 py-2 rounded-full"
                onClick={() => navigate("/library")}
              >
                Read & Earn
              </button>
            </div>
          </div>

          {/* Action Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold">Refer & Farm</p>
                <p className="text-sm text-black/70">
                  Invite friends and earn extra tokens.
                </p>
              </div>
              <button
                className="text-sm px-3 py-2 font-semibold bg-green-50 text-green-700 rounded-lg"
                onClick={() => navigate("/refer")}
              >
                Share
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold">Daily Tasks</p>
                <p className="text-sm text-black/70">
                  Complete simple tasks to earn daily tokens.
                </p>
              </div>
              <button
                className="text-sm px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold cusor-pointer"
                onClick={() => navigate("/daily-tasks")}
              >
                View
              </button>
            </div>
          </div>

          {/* Activities */}
          <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Recent activity</h3>
              <button
                onClick={fetchActivities}
                className="text-sm px-3 py-2 font-semibold bg-green-50 text-green-700 rounded-lg"
              >
                Refresh
              </button>
            </div>

            {activities.length === 0 ? (
              <p className="text-sm text-black/70">
                No recent activity yet. Do some actions to earn tokens.
              </p>
            ) : (
              <ul className="space-y-3">
                {activities.slice(0, 6).map((a, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {a.title ?? a.type ?? "Activity"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.description ??
                          a.note ??
                          new Date(
                            a.created_at || a.timestamp || Date.now()
                          ).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className={`text-sm ${
                        a.amount && a.amount > 0
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {a.amount
                        ? a.amount > 0
                          ? +`  ${a.amount.toFixed(2)}`
                          : a.amount
                        : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/book-ride")}
              className="flex-1 py-3 rounded-full bg-green-600 font-semibold cursor-pointer text-white"
            >
              Book a ride
            </button>
            <button
              onClick={() => navigate("/library")}
              className="flex-1 font-semibold cursor-pointer py-3 rounded-full bg-pri/10 border border-pri text-pri"
            >
              Library
            </button>
          </div>

          {/* Error */}
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </>
      )}

      {/* Transfer Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h4 className="font-semibold mb-3">Transfer Tokens</h4>
            <label className="block text-xs text-gray-600">
              Recipient (username or wallet ID)
            </label>
            <input
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg"
            />

            <label className="block mt-3 text-xs text-gray-600">Amount</label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) =>
                setTransferAmount(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full mt-1 p-3 border rounded-lg"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setIsTransferOpen(false)}
                className="flex-1 py-2 rounded-full bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={transferLoading}
                className="flex-1 py-2 rounded-full bg-green-600 text-white"
              >
                {transferLoading ? "Sending..." : "Send"}
              </button>
            </div>

            {transferSuccess && (
              <p className="mt-3 text-sm text-green-600">{transferSuccess}</p>
            )}
            {error && !transferSuccess && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
