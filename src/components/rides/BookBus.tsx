import { useState } from "react";
import ActiveRideCard from "./ActiveRideCard";
import PastRideItem from "./PastRideItem";
import RewardsSummary from "./RewardsSummary";
import type { Ride } from "./types";
import Image from "../../assets/home-icons/rider1.svg";

/**
 * RidesContent
 * - Top tab action buttons (Book A Bus / View All Rides)
 * - Active Ride card (if active ride exists)
 * - Past Rides list
 * - Rewards summary box
 *
 * Replace mock data with API fetch when ready.
 */

const MOCK_RIDES: Ride[] = [
  {
    id: "r-active",
    status: "active",
    pickupLabel: "Location A",
    dropoffLabel: "Location B",
    distanceKm: 5,
    etaMinutes: 3,
    driver: {
      name: "Second Driver",
      avatar: Image,
      car: "Toyota Camry",
      plate: "IKJ-345-AG",
      verified: true,
    },
  },
  {
    id: "r1",
    status: "completed",
    pickupLabel: "Location A",
    dropoffLabel: "Location B",
    color: `text-pri`,
    driver: {
      name: "First Driver",
      avatar: Image,
      car: "Honda Accord",
      plate: "ABJ-123-GW",
      verified: true,
    },
    fare: 300,
    tokens: 120,
    date: "2025-06-19",
  },
  {
    id: "r2",
    status: "completed",
    pickupLabel: "Location A",
    dropoffLabel: "Location B",
    color: `text-blue-600`,
    driver: {
      name: "Second Driver",
      avatar: Image,
      car: "Toyota Camry",
      plate: "IKJ-345-AG",
      verified: true,
    },
    fare: 600,
    tokens: 120,
    date: "2025-07-24",
  },
  {
    id: "r3",
    status: "completed",
    pickupLabel: "Location A",
    dropoffLabel: "Location B",
    color: `text-blue-600`,
    driver: {
      name: "Better Driver",
      avatar: Image,
      car: "Honda Accord",
      plate: "ABJ-123-GW",
      verified: true,
    },
    fare: 500,
    tokens: 120,
    date: "2025-10-11",
  },
];

const BookBus = () => {
  // will be replaced with API state
  const [rides] = useState<Ride[]>(MOCK_RIDES);

  // find the active ride (if any)
  const activeRide = rides.find((r) => r.status === "active");
  const pastRides = rides.filter((r) => r.status === "completed");

  const handleMarkCompleted = (rideId: string) => {
    // In a real app: call backend to mark complete, refetch rides
    alert(`Ride ${rideId} marked completed (stub).`);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Tab action buttons */}

      {/* Active Ride section */}
      {activeRide ? (
        <ActiveRideCard
          ride={activeRide}
          onComplete={() => handleMarkCompleted(activeRide.id)}
        />
      ) : (
        <div className="p-4 bg-white rounded-xl shadow-sm text-gray-500">
          No active rides
        </div>
      )}

      {/* Past Rides */}
      <div>
        <h3 className="text-xl font-bold">Past Rides</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          View details of your completed trips and keep track of your ride
          history.
        </p>

        <div className="space-y-4">
          {pastRides.map((r) => (
            <PastRideItem key={r.id} ride={r} />
          ))}
        </div>
      </div>

      {/* Rewards summary */}
      <RewardsSummary totalEarned={3200} redeemed={1680} available={1520} />
    </div>
  );
};
export default BookBus;
