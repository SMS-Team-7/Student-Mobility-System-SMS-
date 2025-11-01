import { useState } from "react";
import { ChevronDown, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Pickup from "../../assets/home-icons/pickup.svg?react";
import DropOff from "../../assets/home-icons/dropoff.svg?react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Image from "../../assets/home-icons/rider1.svg";

// --- Sample Ride Data ---
const rides = [
  {
    id: 1,
    driverName: "First Driver",
    car: "Honda Accord",
    plate: "ABJ-123-GW",
    date: "19th June, 2025",
    fare: 300,
    tokens: 120,
    color: `text-pri`,
    avatar: Image,
    status: "Ongoing",
  },
  {
    id: 2,
    driverName: "Second Driver",
    car: "Toyota Camry",
    plate: "IKJ-345-AG",
    date: "20th June, 2025",
    fare: 500,
    tokens: 200,
    color: `text-blue-600`,
    avatar: Image,
    status: "Completed",
  },
  {
    id: 3,
    driverName: "Third Driver",
    car: "Kia Optima",
    plate: "ABC-999-LAG",
    date: "21st June, 2025",
    fare: 250,
    tokens: 100,
    color: `text-red-600`,
    avatar: Image,
    status: "Cancelled",
  },
];

// --- Filter Options ---
const statusFilters = ["All Rides", "Ongoing", "Completed", "Cancelled"];

const ViewAllRides = () => {
  const [filter, setFilter] = useState("All Rides");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // --- Filter logic ---
  const filteredRides =
    filter === "All Rides" ? rides : rides.filter((r) => r.status === filter);

  // --- Helper to get color styles for status badges ---
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-[#d7a500] text-white";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ongoing":
        return <Clock className="w-3.5 h-3.5" />;
      case "Completed":
        return <RiVerifiedBadgeFill className="w-3.5 h-3.5" />;
      case "Cancelled":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 relative">
      {/* --- Dropdown Filter Header --- */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1 font-semibold text-lg"
        >
          {filter}
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* --- Dropdown Menu --- */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-8 left-0 bg-white rounded-xl shadow-md w-44 z-10"
            >
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilter(status);
                    setDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                    filter === status
                      ? "text-pri font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Ride List --- */}
      <div className="space-y-4">
        {filteredRides.map((ride) => (
          <div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div
                className={`flex items-center mb-3 gap-1 text-xs px-2 py-1 rounded-full font-medium w-fit ${getStatusStyle(
                  ride.status
                )}`}
              >
                {getStatusIcon(ride.status)}
                {ride.status}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={ride.avatar ?? "/images/avatar-placeholder.png"}
                    alt={ride.driverName}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{ride.driverName}</div>
                        <RiVerifiedBadgeFill
                          size={16}
                          className={`${ride.color}`}
                        />
                        <div className="text-xs text-gray-500">{ride.date}</div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-3">
                        {ride.car}
                        <div className="text-xs bg-grey text-black px-2 py-0.5 rounded font-semibold">
                          {ride.plate}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ">
                      <div className="font-semibold mb-2 text-green-600">
                        #{ride.fare}
                      </div>
                      <div className="text-xs bg-[#d7a500] text-white px-2 py-0.5 rounded-full font-medium">
                        + {ride.tokens} token
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* small plate slug and horizontal colored progress line */}
              <div className="flex items-center mt-3">
                <div className="flex items-center gap-2 justify-center">
                  <Pickup className="w-4 h-4" />
                  <span className="text-xs font-semibold">Location A</span>
                </div>
                <div className="flex-1 text-center text-gray-800 text-sm">
                  <div className="w-full px-2 my-0.5">
                    <div className="w-full h-px bg-linear-to-r rounded-md from-[#ff3333]/64 via-[#a68d01]/64 to-pri "></div>
                  </div>
                </div>
                <div className="flex gap-3 items-center justify-center">
                  <DropOff className=" w-4 h-4" />
                  <span className="text-xs font-semibold">Location B</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllRides;
