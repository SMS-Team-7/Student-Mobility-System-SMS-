export type Ride = {
  id: string;
  status: "active" | "completed" | "cancelled";
  pickupLabel: string;
  dropoffLabel: string;
  distanceKm?: number;
  etaMinutes?: number;
  color?: string;
  driver: {
    name: string;
    avatar?: string;
    car: string;
    plate: string;
    verified?: boolean;
  };
  fare?: number; // displayed for past rides
  tokens?: number;
  date?: string; // for past rides
};
