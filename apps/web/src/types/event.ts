export interface Event {
  id: number;
  title: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string;
  capacity: number;
  price: number;
  organizerId: number;
  createdAt: string;
  updatedAt: string;
}
