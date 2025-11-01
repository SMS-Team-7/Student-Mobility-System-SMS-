import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Pickup from "../../../assets/home-icons/pickup.svg?react";
import DropOff from "../../../assets/home-icons/dropoff.svg?react";

// 🔹 Type Definitions
interface Ride {
  id: number;
  driver_name: string;
  car_model: string;
  plate_number: string;
  price: number;
  eta: string;
  driver_image?: string;
  is_verified?: boolean;
}

interface LocationState {
  pickup?: string;
  dropoff?: string;
}

// 🔹 Backend Base URL
const BASE_URL = "https://team7-api.onrender.com"; //

export default function AvailableRides() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup = "Location A", dropoff = "Location B" } =
    (location.state as LocationState) || {};

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch available rides from backend ---
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`${BASE_URL}/ride/rides/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load rides (${res.status})`);
        }

        const data = await res.json();
        setRides(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong fetching rides.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-linear-to-b from-green-50 to-white"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <span className="font-semibold text-gray-800 text-sm">
          Ride Booking
        </span>
      </div>

      {/* Locations summary */}
      <div className="mx-4 mb-5 bg-white border border-pri/60 shadow rounded-2xl p-4">
        <div className="flex items-center">
          <div className="flex flex-col items-center justify-center">
            <Pickup className="w-9 h-10" />
          </div>
          <div className="flex-1 text-center text-gray-800 text-sm">
            <div>5 km</div>
            <div className="w-full px-2 my-0.5">
              <div className="w-full h-px bg-linear-to-r rounded-md from-[#ff3333]/64 via-[#a68d01]/64 to-pri"></div>
            </div>
            <div>3 minutes</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <DropOff className="w-9 h-10" />
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="font-semibold text-gray-800">{pickup}</div>
          <div className="font-semibold text-gray-800">{dropoff}</div>
        </div>
      </div>

      {/* Available Rides Section */}
      <div className="px-4">
        <h3 className="font-bold text-black mb-3 text-xl">Available Rides</h3>

        {loading ? (
          <div className="text-center text-gray-600 py-12">
            Loading rides...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : rides.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No rides available at the moment.
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <motion.div
                key={ride.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl shadow-sm p-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        ride.driver_image ||
                        "https://cdn-icons-png.flaticon.com/512/147/147144.png"
                      }
                      alt={ride.driver_name}
                      className="w-13 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-black">
                          {ride.driver_name}
                        </div>
                        {ride.is_verified && (
                          <RiVerifiedBadgeFill
                            size={18}
                            className="text-green-600"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-900">
                          {ride.car_model}
                        </div>
                        <div className="text-xs bg-[#c3c3c3] text-black font-medium inline-block mt-1 px-2 py-0.5 rounded">
                          {ride.plate_number}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      ${ride.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ride.eta || "soon"} away
                    </div>
                  </div>
                </div>

                <button
                  className="mt-3 w-full bg-pri font-semibold text-white py-2.5 rounded-xl text-[15px]"
                  onClick={() =>
                    navigate("/ride-details", {
                      state: { ride, pickup, dropoff },
                    })
                  }
                >
                  Select Ride
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
