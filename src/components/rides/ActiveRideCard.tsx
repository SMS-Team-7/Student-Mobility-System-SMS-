import { type Ride } from "./types";
import Pickup from "../../assets/home-icons/pickup.svg?react";
import DropOff from "../../assets/home-icons/dropoff.svg?react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

/**
 * ActiveRideCard
 * - top title "Active Ride" + status pill
 * - a rounded info card showing distance/time line and location icons
 * - driver row with avatar, name, car and plate
 * - Ride Completed big CTA and an explanatory note
 */

const ActiveRideCard = ({
  ride,
  onComplete,
}: {
  ride: Ride;
  onComplete: () => void;
}) => {
  const distance = ride.distanceKm ?? 0;
  const eta = ride.etaMinutes ?? 0;

  return (
    <div className="bg-black/2 rounded-xl shadow-sm p-5">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Active Ride</h2>
          </div>

          <div>
            <div className="bg-pri text-white text-xs px-3 py-0.5 rounded-full">
              In Progress
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Your ride is currently active. Track your trip in real time and stay
          updated until you reach your destination.
        </p>
      </div>

      {/* Locations summary */}
      <div className="mt-4 mb-5 bg-linear-to-b from-white via-white to-pri/12  border border-pri/60 shadow rounded-2xl p-4 ">
        <div className="flex items-center">
          <div className="flex flex-col items-center justify-center">
            <Pickup className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center text-gray-800 text-sm">
            <div>{distance} km</div>
            <div className="w-full px-2 my-0.5">
              <div className="w-full h-px bg-linear-to-r rounded-md from-[#ff3333]/64 via-[#a68d01]/64 to-pri "></div>
            </div>
            <div>{eta} minutes</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <DropOff className=" w-8 h-8" />
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="font-semibold text-sm text-gray-800">LOCATION A</div>
          <div className="font-semibold text-sm  text-gray-800">LOCATION B</div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={ride.driver.avatar ?? "/images/avatar-placeholder.png"}
            alt={ride.driver.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg">{ride.driver.name}</div>
              {ride.driver.verified && (
                <div className="text-blue-600 text-sm">
                  <RiVerifiedBadgeFill size={20} />
                </div>
              )}
            </div>
            <div className="text-sm text-black/70">{ride.driver.car}</div>
          </div>
        </div>

        <div className="text-xs text-black font-semibold px-3 py-0.5 rounded bg-grey">
          {ride.driver.plate}
        </div>
      </div>

      {/* Ride Completed CTA */}
      <div className="mt-4">
        <button
          onClick={onComplete}
          className="w-full bg-pri cursor-pointer text-white py-2 rounded-full font-semibold shadow"
        >
          Ride Completed
        </button>
      </div>

      <div className="mt-3 bg-grey p-3 rounded-md text-sm text-black">
        <strong>NOTE:</strong> Please tap{" "}
        <span className="text-blue-600 font-semibold">
          &quot;Ride Completed&quot;
        </span>{" "}
        only when your trip has ended. This action notifies the driver that
        you&apos;re about to alight.
      </div>
    </div>
  );
};

export default ActiveRideCard;
