export type Location = {
  id: string;
  locationTitle: string;
  lat: number;
  lng: number;
};

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: "upcoming" | "ongoing" | "completed";
  locations?: Location[];
};
