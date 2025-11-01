export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  positive: boolean;
  time: string;
  date: string;
  type?: string;
  favorite?: boolean;
};

export const transactions: Transaction[] = [
  // 🔹 Today
  {
    id: "t1",
    title: "Transport",
    subtitle: "Asero - Obantoko (5km)",
    amount: -20,
    positive: false,
    time: "19:19",
    date: "2025-10-28",
    type: "withdrawal",
  },
  {
    id: "t2",
    title: "Reward From Task",
    subtitle: "Reading a Novel in 24 hours",
    amount: 10,
    positive: true,
    time: "18:14",
    date: "2025-10-28",
    type: "reward",
    favorite: true,
  },

  // 🔹 Yesterday
  {
    id: "t3",
    title: "Login Reward",
    subtitle: "Daily login reward",
    amount: 10,
    positive: true,
    time: "09:14",
    date: "2025-10-27",
    type: "login",
  },
  {
    id: "t4",
    title: "Book Purchase",
    subtitle: "The Subtle Art of Not Giving a F*ck",
    amount: -15,
    positive: false,
    time: "16:42",
    date: "2025-10-27",
    type: "purchase",
  },

  // 🔹 Past few days
  {
    id: "t5",
    title: "Referral Bonus",
    subtitle: "Earned from inviting @Tomiwa",
    amount: 25,
    positive: true,
    time: "14:37",
    date: "2025-10-26",
    type: "reward",
    favorite: true,
  },
  {
    id: "t6",
    title: "Task Completion",
    subtitle: "Watched 3 sponsored videos",
    amount: 12,
    positive: true,
    time: "11:25",
    date: "2025-10-25",
    type: "reward",
  },
  {
    id: "t7",
    title: "Book Marketplace",
    subtitle: "Sold ‘Atomic Habits’",
    amount: 18,
    positive: true,
    time: "09:10",
    date: "2025-10-25",
    type: "sale",
  },
  {
    id: "t8",
    title: "Ride Payment",
    subtitle: "Obantoko - Camp Junction",
    amount: -10,
    positive: false,
    time: "20:05",
    date: "2025-10-24",
    type: "ride",
  },
  {
    id: "t9",
    title: "Marketplace Purchase",
    subtitle: "Stationery bundle (5 items)",
    amount: -35,
    positive: false,
    time: "17:20",
    date: "2025-10-23",
    type: "purchase",
    favorite: true,
  },
  {
    id: "t10",
    title: "Weekly Login Streak",
    subtitle: "7-day streak reward",
    amount: 8,
    positive: true,
    time: "10:02",
    date: "2025-10-22",
    type: "reward",
  },
  {
    id: "t11",
    title: "Wallet Top-Up",
    subtitle: "Via bank transfer",
    amount: 50,
    positive: true,
    time: "15:30",
    date: "2025-10-21",
    type: "deposit",
    favorite: true,
  },
  {
    id: "t12",
    title: "Book Marketplace",
    subtitle: "Bought ‘Rich Dad Poor Dad’",
    amount: -22,
    positive: false,
    time: "09:44",
    date: "2025-10-20",
    type: "purchase",
  },
  {
    id: "t13",
    title: "Task Payout",
    subtitle: "Completed reading challenge",
    amount: 30,
    positive: true,
    time: "19:00",
    date: "2025-10-19",
    type: "reward",
  },
];
