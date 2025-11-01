import { type Ride } from "./types";
import Pickup from "../../assets/home-icons/pickup.svg?react";
import DropOff from "../../assets/home-icons/dropoff.svg?react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const PastRideItem = ({ ride }: { ride: Ride }) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={ride.driver.avatar ?? "/images/avatar-placeholder.png"}
          alt={ride.driver.name}
          className="w-14 h-14 rounded-full object-cover border"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold">{ride.driver.name}</div>
                <RiVerifiedBadgeFill size={16} className={`${ride.color}`} />
                <div className="text-xs text-gray-500">{ride.date}</div>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-3">
                {ride.driver.car}
                <div className="text-xs bg-grey text-black px-2 py-0.5 rounded font-semibold">
                  {ride.driver.plate}
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
          <span className="text-xs font-semibold">{ride.pickupLabel}</span>
        </div>
        <div className="flex-1 text-center text-gray-800 text-sm">
          <div className="w-full px-2 my-0.5">
            <div className="w-full h-px bg-linear-to-r rounded-md from-[#ff3333]/64 via-[#a68d01]/64 to-pri "></div>
          </div>
        </div>
        <div className="flex gap-3 items-center justify-center">
          <DropOff className=" w-4 h-4" />
          <span className="text-xs font-semibold">{ride.dropoffLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default PastRideItem;
