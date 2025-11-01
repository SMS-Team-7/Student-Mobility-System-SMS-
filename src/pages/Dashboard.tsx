import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import Deposit from "../assets/home-icons/deposit.svg?react";
import Withdraw from "../assets/home-icons/withdraw.svg?react";
import Copy from "../assets/home-icons/copy.svg?react";
import Wallet from "../assets/home-icons/wallet.svg?react";
import Refer1 from "../assets/home-icons/refer1.svg";
import Refer2 from "../assets/home-icons/refer2.svg";
import Ride from "../assets/home-icons/a.svg";
import Book from "../assets/home-icons/book.svg";
import Task from "../assets/home-icons/task.svg";
import { useAuthContext } from "../context/AuthContext";
import QRScannerModal from "../components/QRScannerModal";
import TransactionsPreview from "../components/transactions/TransactionsPreview";

const API_BASE = "https://team-7-api.onrender.com";

const Dashboard: React.FC = () => {
  const { user, token } = useAuthContext();
  const navigate = useNavigate();

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // UI STATES (kept your design & naming)
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [walletAddr] = useState("ASefjcxkndfJ2J...ELKdckj2");
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // reward balance state loaded from reward API
  const [rewardBalance, setRewardBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // computed change values
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [dollarChange, setDollarChange] = useState<number | null>(null);

  const toggleBalance = () => setBalanceVisible((s) => !s);
  const toggleCurrencyMenu = () => setShowCurrencyMenu((s) => !s);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  // Navigation handlers
  const onDeposit = () => navigate("/deposit");
  const onWithdraw = () => navigate("/withdraw");

  // Helper: prefer token from context, fallback to localStorage
  const authToken =
    token || localStorage.getItem("authToken") || localStorage.getItem("token");

  // Fetch the reward balance from the same endpoint as RewardsPage
  const fetchRewardBalance = async () => {
    if (!authToken) {
      setBalanceError("Not authenticated");
      setRewardBalance(null);
      setPercentChange(null);
      setDollarChange(null);
      return;
    }

    setLoadingBalance(true);
    setBalanceError(null);

    try {
      const res = await fetch(`${API_BASE}/reward/balance/, {
        headers: {
          Authorization: Bearer ${authToken},
        },
      }`);

      // attempt to parse JSON safely
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.warn("reward balance fetch failed", res.status, data);
        setBalanceError("");
        setRewardBalance(null);
        setPercentChange(null);
        setDollarChange(null);
        setLoadingBalance(false);
        return;
      }

      // common response shapes: { balance: number } or { amount: number } etc.
      const latest =
        typeof data.balance === "number"
          ? data.balance
          : typeof data.amount === "number"
            ? data.amount
            : typeof data.walletBalance === "number"
              ? data.walletBalance
              : null;

      if (latest === null) {
        setRewardBalance(null);
        setPercentChange(null);
        setDollarChange(null);
        setLoadingBalance(false);
        return;
      }

      // Compute percent/dollar change using the user's stored data as "previous"
      // If user.walletBalance isn't a number, fallback to no change (0)
      const prevRaw = user?.walletBalance;
      const prev = typeof prevRaw === "number" ? prevRaw : null;

      if (prev !== null && !Number.isNaN(prev)) {
        // if prev is zero, define percent change as 0 to avoid divide-by-zero
        if (prev === 0) {
          setPercentChange(0);
        } else {
          const pct = ((latest - prev) / Math.abs(prev)) * 100;
          setPercentChange(Number(pct.toFixed(2)));
        }
        setDollarChange(Number((latest - (prev ?? 0)).toFixed(2)));
      } else {
        // no previous stored (or not numeric) — show 0 changes
        setPercentChange(0);
        setDollarChange(0);
      }

      setRewardBalance(latest);
    } catch (err) {
      console.error("Error fetching reward balance:", err);
      setBalanceError("Network or server error");
      setRewardBalance(null);
      setPercentChange(null);
      setDollarChange(null);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Load balance on mount and when authToken changes
  useEffect(() => {
    if (authToken) fetchRewardBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  //
  // If rewardBalance available, use that; otherwise fallback to user.walletBalance or "0.00"
  const displayNumber =
    rewardBalance !== null
      ? rewardBalance
      : typeof user?.walletBalance === "number"
        ? user!.walletBalance
        : Number((0).toFixed(2));

  const displayBalance = balanceVisible
    ? `${displayNumber.toFixed(2)}`
    : "•••••";

  // Keep original balance string variable used throughout your markup
  const balance = `${displayBalance}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white px-4 sm:p-6 lg:p-10 font-sans text-grey">
      <div className=" max-w-md mx-auto">
        {/* Header */}
        <div className=" h-20 flex py-4 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar Section */}
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt="User avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-pri flex items-center justify-center text-white text-3xl font-bold border-2 border-white shadow">
                {user?.first_name?.charAt(0).toUpperCase() ||
                  user?.username?.charAt(0).toUpperCase() ||
                  "?"}
              </div>
            )}
            <div>
              <div className="font-bold text-black ">
                {user?.first_name || user?.last_name || user?.username}
              </div>
              <div className="text-xs text-gray-500">@{user?.username}</div>
            </div>
          </div>

          {/* HEADER RIGHT ICONS */}
          <div className="flex items-center gap-6">
            {/* bell with red dot */}
            <button aria-label="notifications" className="relative">
              <svg
                width="24"
                height="21"
                viewBox="0 0 24 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.2526 13.5955L21.3577 7.39555C20.7508 5.22709 19.4315 3.32197 17.6091 1.98268C15.7867 0.643382 13.5657 -0.0533218 11.2987 0.0031853C9.03179 0.0596924 6.84884 0.866171 5.09648 2.29457C3.34412 3.72298 2.12279 5.69143 1.6264 7.88738L0.154964 13.8858C-0.0406087 14.6829 -0.051205 15.5136 0.123975 16.3153C0.299155 17.1171 0.655536 17.8688 1.16622 18.5139C1.67691 19.159 2.32856 19.6805 3.07199 20.0391C3.81543 20.3977 4.63123 20.584 5.45782 20.5841H18.0295C18.8817 20.5841 19.7221 20.386 20.4833 20.0058C21.2446 19.6256 21.9055 19.0737 22.4132 18.3944C22.921 17.715 23.2613 16.9272 23.4071 16.0938C23.5529 15.2605 23.5 14.4049 23.2526 13.5955Z"
                  fill="black"
                />
              </svg>

              <span className="absolute -top-0.5 -right-0.5 block w-3 h-3 bg-red-500 rounded-full" />
            </button>

            {/* scan icon */}
            <button aria-label="scan" onClick={() => setShowQRScanner(true)}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26 13V16.25H0V13M9.75 0V3.25H3.25V9.75H0V0M16.25 3.25V0H26V9.75H22.75V3.25M22.75 19.5V22.75H16.25V26H26V19.5M3.25 19.5V22.75H9.75V26H0V19.5"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl overflow-hidden bg-linear-to-br from-pri/64 to-pri p-5 shadow-lg mb-4">
          <div className="flex items-center gap-4 justify-center">
            <div className="text-[15px] font-medium text-white/90">
              Your Balance
            </div>
            <button
              onClick={toggleBalance}
              aria-label="toggle-balance"
              className="text-white/90"
            >
              {balanceVisible ? (
                <RiEyeOffFill size={20} className="text-white" />
              ) : (
                <RiEyeFill size={20} className="text-white" />
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="bg-white/84 w-20 px-3 py-0.5 rounded-full flex items-center gap-2">
              <div className="w-4 h-4 bg-pri rounded-full flex items-center justify-center text-white text-xs font-bold">
                $
              </div>
              <div className="text-sm font-bold text-pri">{currency}</div>
            </div>
            <div>
              <button
                onClick={toggleCurrencyMenu}
                className="bg-white/84 w-6 h-6 flex items-center justify-center rounded-full"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.759049 0H9.24095C9.39109 3.33974e-05 9.53784 0.0464399 9.66266 0.133353C9.78748 0.220267 9.88477 0.343785 9.94222 0.488291C9.99967 0.632798 10.0147 0.791806 9.98542 0.945213C9.95614 1.09862 9.88386 1.23954 9.77771 1.35016L5.53676 5.76842C5.39439 5.9167 5.20132 6 5 6C4.79868 6 4.60561 5.9167 4.46324 5.76842L0.222287 1.35016C0.116142 1.23954 0.0438603 1.09862 0.0145794 0.945213C-0.0147015 0.791806 0.000333386 0.632798 0.0577829 0.488291C0.115232 0.343785 0.212517 0.220267 0.337339 0.133353C0.462161 0.0464399 0.608915 3.33974e-05 0.759049 0Z"
                    fill="#00C317"
                  />
                </svg>
              </button>
            </div>
            {showCurrencyMenu && (
              <div className="absolute mt-28 bg-white rounded shadow p-2 text-sm">
                <button
                  className="block w-full text-left px-2 py-1"
                  onClick={() => {
                    setCurrency("USD");
                    setShowCurrencyMenu(false);
                  }}
                >
                  USD
                </button>
                <button
                  className="block w-full text-left px-2 py-1"
                  onClick={() => {
                    setCurrency("HBAR");
                    setShowCurrencyMenu(false);
                  }}
                >
                  NGN
                </button>
              </div>
            )}
          </div>

          <div className="my-3 text-center">
            <div className="text-5xl font-bold text-white">
              {balanceVisible ? `${balance}` : "•••••"}
            </div>

            <div className="text-sm flex items-center gap-2 justify-center font-bold text-white/90 mt-1">
              <span>
                <svg
                  width="21"
                  height="13"
                  viewBox="0 0 21 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.6221 0.100403C19.0631 0.100403 19.4884 0.253749 19.8037 0.53009C20.1195 0.806801 20.2998 1.18504 20.2998 1.58282V4.42755L20.2861 4.57892C20.26 4.72833 20.1972 4.87077 20.1016 4.99591C19.9741 5.16252 19.7951 5.29123 19.5879 5.367C19.3806 5.44276 19.1524 5.46365 18.9326 5.42657C18.7129 5.38948 18.5088 5.29536 18.3467 5.15607H18.3457L17.2695 4.21271L13.5635 7.45978L13.5615 7.46173C12.9413 7.98031 12.1194 8.26828 11.2666 8.26837C10.4136 8.26837 9.59108 7.98044 8.9707 7.46173L8.96875 7.45978L8.79004 7.30255V7.30157C8.60912 7.15067 8.36569 7.06525 8.11133 7.06525C7.8569 7.06532 7.6135 7.15053 7.43262 7.30157L7.43359 7.30255L2.06934 12.0037C1.85224 12.1945 1.55932 12.2992 1.25684 12.2996C0.954502 12.2999 0.661923 12.1958 0.444336 12.0057C0.22623 11.8151 0.10103 11.5526 0.100586 11.2762C0.100273 10.9999 0.224978 10.7377 0.442383 10.5467L5.80664 5.8465L5.80859 5.84454C6.42875 5.32533 7.25131 5.03693 8.10449 5.03693C8.85096 5.03696 9.57372 5.258 10.1582 5.66095L10.4004 5.84454L10.4023 5.8465L10.5791 6.00177L10.6494 6.05646C10.8209 6.17466 11.0355 6.24004 11.2588 6.24005C11.5141 6.24005 11.7572 6.15358 11.9385 6.00177L15.623 2.77423L14.5664 1.84845C14.4048 1.70672 14.2926 1.52457 14.2471 1.32404C14.2015 1.12308 14.2255 0.914641 14.3145 0.726379C14.4033 0.538491 14.5525 0.379986 14.7412 0.269348C14.93 0.158799 15.151 0.100507 15.376 0.100403H18.6221Z"
                    fill="white"
                    stroke="white"
                  />
                </svg>
              </span>

              <span>
                {percentChange !== null && dollarChange !== null
                  ? `${percentChange.toFixed(2)}% (${dollarChange >= 0 ? "+" : ""
                  }${dollarChange.toFixed(2)})`
                  : "0.00% (+0.00)"}
              </span>
            </div>

            <div className="flex w-[90%] mx-auto gap-3 mt-4">
              <button
                onClick={onDeposit}
                className="flex-1 flex items-center gap-3 justify-center bg-white text-green-600 rounded-xl py-2 font-medium shadow-sm cursor-pointer"
              >
                <span>Deposit</span>
                <Deposit />
              </button>
              <button
                onClick={onWithdraw}
                className="flex-1 flex items-center gap-3 justify-center bg-white text-green-600 rounded-xl py-2 font-medium shadow-sm cursor-pointer"
              >
                <span>Withdraw</span>
                <Withdraw />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center">
              <div className="inline-flex items-center gap-1 bg-white/84 px-1 py-0.5 rounded-full text-[10px] text-pri">
                <div className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-pri">
                  <Wallet className="w-2 h-2 " />
                </div>
                <span className="truncate font-semibold max-w-40">
                  {walletAddr}
                </span>
              </div>
              <button
                className="bg-white/84 ml-3 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                onClick={() => copyToClipboard(walletAddr)}
                aria-label="copy-address"
              >
                <Copy className="w-2.5 h-2.5" />
              </button>
            </div>

            {copied && (
              <div className="mt-2 text-sm font-semibold text-white/90 text-center">
                Copied to Clipboard!
              </div>
            )}

            {balanceError && (
              <div className="mt-2 text-xs font-medium text-yellow-200 text-center">
                {balanceError}
              </div>
            )}
          </div>
        </div>

        {/* Cards: Refer & Earn, Book A Ride, Book Marketplace, Tasks and Rewards */}
        <div className="space-y-3 mb-4">
          <div className="rounded-xl border border-pri/20 relative overflow-hidden px-3 py-3 bg-linear-to-br from-[#08240C]/20 to-[#08240C]/10 flex items-start gap-3">
            <div className="relative z-2 w-14 h-14 rounded-lg flex items-center justify-center">
              <img src={Refer1} alt="" />
            </div>
            <div>
              <div className="font-bold text-black">Refer & Earn</div>
              <div className="text-sm w-[90%] relative z-2 text-black/64">
                Refer your friends to use Hedera Wallet, and start earning cash
                rewards up to $10
              </div>
            </div>
            <div className="absolute bottom-0 right-0 z-0">
              <img src={Refer2} alt="" />
            </div>
          </div>

          <button
            onClick={() => navigate("/book-ride")}
            className="w-full rounded-xl p-4 text-left bg-linear-to-br from-pri grid grid-cols-[70%_28%] gap-[2%] via-pri/70 to-pri/50 text-white font-bold shadow"
          >
            <div>
              Book A Ride
              <div className="text-sm font-normal opacity-85 mt-1">
                Tap, book, and go. Ride made simple.
              </div>
            </div>
            <div className="flex justify-end">
              <img src={Ride} alt="" />
            </div>
          </button>

          <button
            onClick={() => navigate("/book-market")}
            className="w-full rounded-xl p-4 text-left bg-linear-to-br from-[#001ac3] via-[#001ac3]/85 to-[#001ac3]/70 grid grid-cols-[79%_20%] gap-[1%] text-white font-bold shadow">
            <div>
              Book Marketplace
              <div className="text-sm font-normal opacity-85 mt-1">
                Discover and buy your favorite books in one place.
              </div>
            </div>
            <div className="flex justify-end">
              <img src={Book} alt="" className="w-[80%]" />
            </div>
          </button>

          {showQRScanner && (
            <QRScannerModal
              onClose={() => setShowQRScanner(false)}
              onResult={(data) => {
                console.log("QR Result:", data);
              }}
            />
          )}

          <button className="w-full rounded-xl p-4 text-left bg-linear-to-br from-[#00e5bf] to-[#00e5bf]/85 grid grid-cols-[70%_28%] gap-[2%] text-white font-bold shadow">
            <div>
              Tasks and Rewards
              <div className="text-sm font-normal opacity-85 mt-1">
                Finish tasks and unlock rewards.
              </div>
            </div>
            <div className="flex justify-end">
              <img src={Task} alt="" className="w-[50%]" />
            </div>
          </button>
        </div>

        {/* Transactions Header */}
        <TransactionsPreview />

        {showFilter && (
          <div className="mb-3 p-3 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Filters</div>
              <button
                onClick={() => setShowFilter(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              (filter UI stub — add checkboxes or selects here)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
