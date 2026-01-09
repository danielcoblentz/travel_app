export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: "upcoming" | "ongoing" | "completed";
};
