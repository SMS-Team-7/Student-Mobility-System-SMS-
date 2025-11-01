import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface RideData {
  id?: string;
  pickup: string;
  dropoff: string;
  pickup_lat?: number | null;
  pickup_lng?: number | null;
  dropoff_lat?: number | null;
  dropoff_lng?: number | null;
  status?: string;
}

interface RideContextProps {
  ride: RideData | null;
  setRide: (data: RideData | null) => void;
  clearRide: () => void;
}

export const RideContext = createContext<RideContextProps>({
  ride: null,
  setRide: () => {},
  clearRide: () => {},
});

export const RideProvider = ({ children }: { children: ReactNode }) => {
  const [ride, setRideState] = useState<RideData | null>(null);

  useEffect(() => {
    // Load saved ride on refresh
    const saved = localStorage.getItem("ride");
    if (saved) setRideState(JSON.parse(saved));
  }, []);

  const setRide = (data: RideData | null) => {
    setRideState(data);
    if (data) localStorage.setItem("ride", JSON.stringify(data));
    else localStorage.removeItem("ride");
  };

  const clearRide = () => {
    setRideState(null);
    localStorage.removeItem("ride");
  };

  return (
    <RideContext.Provider value={{ ride, setRide, clearRide }}>
      {children}
    </RideContext.Provider>
  );
};
