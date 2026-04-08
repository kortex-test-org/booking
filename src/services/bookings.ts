import type { RecordModel } from "pocketbase";
import { pb } from "./pb";

export interface Booking extends RecordModel {
  user: string;
  service: string;
  time_slot: string;
  status: "pending" | "paid" | "cancelled";
  stripe_payment_id?: string;
}

export async function createBooking(data: {
  user: string;
  service: string;
  time_slot: string;
  status: Booking["status"];
}): Promise<Booking> {
  return pb.collection("bookings").create<Booking>(data);
}

export async function getBookings(): Promise<Booking[]> {
  return pb.collection("bookings").getFullList<Booking>({
    expand: "user,service,time_slot",
  });
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  return pb.collection("bookings").getFullList<Booking>({
    filter: `user = "${userId}"`,
    expand: "service,time_slot",
    sort: "-created",
  });
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<Booking> {
  return pb.collection("bookings").update<Booking>(id, { status });
}

export async function deleteBooking(id: string): Promise<void> {
  await pb.collection("bookings").delete(id);
}
