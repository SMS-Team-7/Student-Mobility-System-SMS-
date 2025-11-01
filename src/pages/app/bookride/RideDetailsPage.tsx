import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Edit from "../../../assets/home-icons/edit.svg?react";
import Phone from "../../../assets/home-icons/phone.svg?react";
import Time from "../../../assets/home-icons/time.svg?react";
import Moneybag from "../../../assets/home-icons/moneybag.svg?react";
import PickupIcon from "../../../assets/home-icons/pickup.svg?react";
import DropoffIcon from "../../../assets/home-icons/dropoff.svg?react";

interface Ride {
  id: number;
  name: string;
  car: string;
  plate: string;
  price: string;
  eta: string;
  img: string;
}

interface LocationState {
  ride?: Ride;
  pickup?: string;
  dropoff?: string;
}

const RideDetailsPage = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    ride,
    pickup = "Location A",
    dropoff = "Location B",
  } = (location.state as LocationState) || {};

  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-600">No ride selected.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 text-pri underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const handleCallDriver = () => {
    setShowConfirm(false);
    window.location.href = `tel:${+2347022112233}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-linear-to-b from-green-50 to-white flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-7">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <span className="font-semibold text-black text-sm">Ride Booking</span>
      </div>

      {/* Content */}
      <div className="px-5 mt-6">
        {/* Trip Details */}
        <div className="flex justify-between items-start mb-5">
          <h2 className="text-xl font-bold text-gray-900">Trip Details</h2>
          <button
            onClick={() => navigate("/book-ride")}
            className="text-green-600 text-sm flex items-center gap-2"
          >
            <Edit />
            <span>Edit</span>
          </button>
        </div>

        {/* Pickup and Drop-off */}
        <div className="relative pl-6 mb-8">
          <PickupIcon className="absolute top-1 left-0" />

          <DropoffIcon className="absolute bottom-1 left-0" />

          {/* Line connector */}
          <div className="absolute left-2 top-6 bottom-6 w-0.5 bg-linear-to-b rounded-md from-[#ff3333]/64 via-[#a68d01]/64 to-pri" />
          {/* Pickup */}
          <div className="mb-6 ml-5">
            <div className="">
              <p className="text-gray-700 text-sm">Pick Up</p>
              <div className=" font-semibold text-gray-900">{pickup}</div>
            </div>
          </div>

          {/* Drop-off */}
          <div className="ml-5">
            <div className="">
              <p className="text-gray-700 text-sm">Drop-off</p>
              <div className=" font-semibold text-gray-900">{dropoff}</div>
            </div>
          </div>
        </div>

        {/* Driver Information */}
        <div>
          <h3 className="font-bold text-xl text-black mb-4">
            Driver Information
          </h3>

          <div className="flex items-center justify-between bg-white shadow-sm rounded-2xl px-4 py-5 border border-gray-100">
            {/* Left - Driver */}
            <div className="flex items-center gap-3">
              <div className="w-15 h-15 rounded-full border-2 border-pri">
                <img src={ride.img} className="w-full h-full object-fit" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{ride.name}</h4>
                  <RiVerifiedBadgeFill className="text-blue-500" size={18} />
                </div>
                <p className="text-sm text-gray-600">{ride.car}</p>
                <p className="text-xs bg-grey font-medium text-gray-800 inline-block mt-1 px-2 py-0.5 rounded">
                  {ride.plate}
                </p>
              </div>
            </div>

            {/* Right - Call */}
            <button
              onClick={() => setShowConfirm(true)}
              className="border border-pri rounded-full p-2"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>

          {/* Ride details */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Time />
                Estimated Time Arrival
              </div>
              <p className="font-medium text-gray-800">{ride.eta}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center font-bold gap-2 text-gray-700 text-[15px]">
                <Moneybag />
                Total Fare Amount
              </div>
              <p className="font-semibold text-green-600">{ride.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-auto px-5 mb-10  space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            navigate("/ride-payment", {
              state: {
                rider: {
                  name: ride.name,
                  img: ride.name,
                },
              },
            })
          }
          className="w-full bg-green-600 text-white py-3 rounded-full font-semibold"
        >
          Continue
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-semibold"
        >
          Cancel
        </motion.button>
      </div>

      {/* Confirm Call Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-11/12 max-w-sm rounded-2xl p-6 text-center shadow-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              Call {ride.name}?
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              You’re about to call your driver at{" "}
              <span className="font-medium text-gray-800">
                {+2347011223311}
              </span>
              .
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCallDriver}
                className="px-5 py-2 rounded-full bg-pri text-white font-semibold"
              >
                Call
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RideDetailsPage;
