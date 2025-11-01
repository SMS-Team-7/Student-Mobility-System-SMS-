import { useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import LibraryContent from "../components/profile/LibraryContent";
import { motion, AnimatePresence } from "framer-motion";
import RidesContent from "../components/rides/RidesContent";
import SettingsPage from "../components/settings/SettingsPage";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("library");
  return (
    <div className=" space-y-5">
      <ProfileHeader />

      {/* REST */}
      <div className="py-5 px-4">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LibraryContent />
            </motion.div>
          )}
          {activeTab === "rides" && (
            <motion.div
              key="rides"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RidesContent />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
