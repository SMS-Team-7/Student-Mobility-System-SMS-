import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import History from "../../assets/profile-icons/history.svg?react";
import MapMarker from "../../assets/profile-icons/MapMarker.svg?react";

import ViewAllRides from "./ViewAllRides";
import BookBus from "./BookBus";

export default function RidesContent() {
  const [subTab, setSubTab] = useState<"book" | "view">("book");

  return (
    <div>
      {/* --- Sub Tabs --- */}
      <div className="flex justify-around gap-3 bg-white my-3  rounded-full  mx-auto">
        <button
          onClick={() => setSubTab("book")}
          className={`w-1/2 py-2 rounded-full flex items-center gap-2 justify-center cursor-pointer font-medium text-sm transition ${
            subTab === "book"
              ? "bg-pri text-white border border-pri/70"
              : "text-black/60 hover:text-pri border border-pri/70"
          }`}
        >
          <MapMarker className="w-4 h-4" />
          <span>Book a Bus</span>
        </button>
        <button
          onClick={() => setSubTab("view")}
          className={`w-1/2 py-2 rounded-full flex items-center gap-2 justify-center cursor-pointer font-medium text-sm transition ${
            subTab === "view"
              ? "bg-pri text-white border border-pri/70"
              : "text-black/60 hover:text-pri border border-pri/70"
          }`}
        >
          <History className="w-4 h-4" />
          <span>View All Rides</span>
        </button>
      </div>

      {/* --- Sub Tab Content --- */}
      <AnimatePresence mode="wait">
        {subTab === "book" && (
          <motion.div
            key="book"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <BookBus />
          </motion.div>
        )}
        {subTab === "view" && (
          <motion.div
            key="view"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <ViewAllRides />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
