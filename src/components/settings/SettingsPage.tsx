import { motion } from "framer-motion";
import { useState } from "react";
import SettingSection from "./SettingSection";
import SettingToggle from "./SettingToggle";
import { useAuthContext } from "../../context/AuthContext";
import { Lock, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import ManagePaymentModal from "./ManagePaymentModal";

const SettingsPage = () => {
  const { user, updateUserPreferences, logout } = useAuthContext();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const navigate = useNavigate();

  const prefs = user?.preferences || {};

  // 🔹 Handles logout flow
  const handleLogout = () => {
    logout(); // Clears auth and user data
    navigate("/login"); // Redirect to login page (change if different route)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto py-6 space-y-6 text-gray-800"
    >
      {/* --- Account Info --- */}
      <SettingSection
        title="Account Information"
        subtitle="Manage your account details"
      >
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-3 hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3">
            <Lock className="text-green-600" size={22} />
            <span className="font-medium">Change Password / PIN</span>
          </div>
          <span className="text-gray-400">&gt;</span>
        </button>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="text-green-600" size={22} />
            <span className="font-medium">Manage Payment Method</span>
          </div>
          <span className="text-gray-400">&gt;</span>
        </button>
      </SettingSection>

      {/* --- Security --- */}
      <SettingSection
        title="Security & Privacy"
        subtitle="Control your security preferences"
      >
        <SettingToggle
          label="Biometrics"
          description="Use fingerprint or Face ID for verification"
          checked={!!prefs.biometrics}
          onChange={(checked) => updateUserPreferences({ biometrics: checked })}
        />

        <SettingToggle
          label="Two Factor Authentication (2FA)"
          description="Add extra protection to your account"
          checked={!!prefs.twoFA}
          onChange={(checked) => updateUserPreferences({ twoFA: checked })}
        />
      </SettingSection>

      {/* --- Preferences --- */}
      <SettingSection title="Preferences" subtitle="Customize your experience">
        <SettingToggle
          label="Dark Mode"
          description="Toggle light/dark theme"
          checked={!!prefs.darkMode}
          onChange={(checked) => {
            updateUserPreferences({ darkMode: checked });
            document.documentElement.classList.toggle("dark", checked);
          }}
        />

        <SettingToggle
          label="Notifications"
          description="Receive updates and alerts"
          checked={!!prefs.notifications}
          onChange={(checked) =>
            updateUserPreferences({ notifications: checked })
          }
        />

        {/* Language Selector */}
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="font-semibold text-gray-800">Language</div>
            <p className="text-sm text-gray-500">
              Select your preferred language
            </p>
          </div>

          <select
            value={prefs.language || "English"}
            onChange={(e) =>
              updateUserPreferences({ language: e.target.value })
            }
            className="border rounded-lg px-3 py-1 text-sm bg-gray-50 focus:outline-none"
          >
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
            <option>German</option>
          </select>
        </div>
      </SettingSection>

      {/* --- Logout --- */}
      <div className="pt-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold py-3 rounded-2xl shadow hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </motion.button>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
      {showPaymentModal && (
        <ManagePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </motion.div>
  );
};

export default SettingsPage;
