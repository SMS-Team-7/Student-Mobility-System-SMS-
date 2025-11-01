import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import Pen from "../../assets/profile-icons/edit2.svg?react";
import Calendar from "../../assets/profile-icons/calender.svg?react";
import Fire from "../../assets/profile-icons/fire.svg?react";
import Wallet from "../../assets/profile-icons/wallet.svg?react";
import User from "../../assets/profile-icons/userplus.svg?react";

// ------------------------------
// Profile Header Component
// ------------------------------
const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [showWallet, setShowWallet] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* ---------- Profile Header ---------- */}
      <motion.div
        className=" max-w-md mx-auto rounded-b-xl bg-green-50 p-3 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-5 items-center mb-4">
          <ChevronLeft
            size={28}
            onClick={() => navigate("/dashboard")}
            className="text-black cursor-pointer"
          />
          <span className="text-black text-sm font-medium">Profile</span>
        </div>
        {/* Top Section */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.name}
                className="w-17 h-17 rounded-full object-cover border-4 border-white shadow"
              />
            ) : (
              <div className="w-17 h-17 rounded-full bg-pri flex items-center justify-center text-white text-3xl font-bold border-2 border-white shadow">
                {user?.first_name?.charAt(0).toUpperCase() ||
                  user?.username?.charAt(0).toUpperCase() ||
                  "?"}
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold">
                {user?.first_name || user.last_name || user.username}
              </h2>
              <p className="text-gray-600 text-sm font-medium">{user.email}</p>
              {user.username && (
                <p className="text-gray-500 text-sm">@{user.username}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center gap-3 sm:gap-6 mt-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Fire className="w-5 h-5" />
              <span>
                <strong className="text-base">{user.streakDays || 0}</strong>{" "}
                Days Streak
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Active Since</span> <span className="grid"></span>
              </div>
              <span className="font-semibold text-xs">
                {user.activeSince || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-pri text-white py-2 px-5 rounded-xl flex gap-4 items-center justify-center cursor-pointer font-semibold shadow hover:bg-green-600 transition"
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <Pen />
            </div>
            Edit Profile
          </button>

          <div className="flex flex-1 justify-between">
            <button
              onClick={() => setShowWallet(true)}
              className="flex items-center justify-center gap-2 border border-gray-300 py-1.5 text-sm font-semibold cursor-pointer px-4 rounded-xl bg-white hover:bg-pri/15 hover:text-pri transition"
            >
              <Wallet className="text-green-600" />
              <span>View Wallet</span>
            </button>

            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center justify-center gap-2 border border-gray-300 py-1.5 text-sm font-semibold cursor-pointer px-4 rounded-xl bg-white hover:bg-gray-100 transition"
            >
              <User className="text-green-600" />
              <span>Invite Friends</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ---------- Edit Profile Modal ---------- */}
      <AnimatePresence>
        {/* ---------- Wallet Modal ---------- */}
        {showWallet && (
          <Modal onClose={() => setShowWallet(false)} title="Wallet Overview">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                ₦{user.walletBalance || "0.00"}
              </h2>
              <p className="text-gray-500">Total Wallet Balance</p>
            </div>
          </Modal>
        )}

        {/* ---------- Invite Friends Modal ---------- */}
        {showInvite && (
          <Modal onClose={() => setShowInvite(false)} title="Invite Friends">
            <p className="text-gray-600 mb-3 text-center">
              Share your referral link and earn rewards!
            </p>
            <div className="flex items-center justify-between border p-2 rounded-md">
              <span className="truncate text-sm text-gray-600">
                https://hedera/invite/{user.username || "user"}
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    ` https://yourapp.com/invite/${user.username || "user"}`
                  )
                }
                className="text-green-600 font-medium hover:underline"
              >
                Copy
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

// ------------------------------
// Reusable Modal Component
// ------------------------------
const Modal = ({ onClose, title, children }: any) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ProfileHeader;
