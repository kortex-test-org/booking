import type { RecordModel } from "pocketbase";
import type { BookingStatus } from "@/lib/constants";
import { pb, pbAdmin } from "./pb";
import type { TimeSlot } from "./time-slots";

export type { BookingStatus };

export interface Booking extends RecordModel {
  user: string;
  service: string;
  time_slot: string;
  status: BookingStatus;
  stripe_payment_id?: string;
}

export interface BookingWithExpand extends Booking {
  expand?: {
    time_slot?: TimeSlot;
  };
}

export async function createBooking(data: {
  user: string;
  service: string;
  time_slot: string;
  status: Booking["status"];
}): Promise<Booking> {
  return pbAdmin.collection("bookings").create<Booking>(data);
}

export async function getBookings(): Promise<Booking[]> {
  return pbAdmin.collection("bookings").getFullList<Booking>({
    expand: "user,service,time_slot",
  });
}

export async function getUserBookings(): Promise<BookingWithExpand[]> {
  return pb.collection("bookings").getFullList<BookingWithExpand>({
    requestKey: null,
    expand: "time_slot",
  });
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
): Promise<Booking> {
  return pb.collection("bookings").update<Booking>(id, { status });
}

export async function adminUpdateBookingStatus(
  id: string,
  status: Booking["status"],
): Promise<Booking> {
  return pbAdmin.collection("bookings").update<Booking>(id, { status });
}

export async function deleteBooking(id: string): Promise<void> {
  await pbAdmin.collection("bookings").delete(id);
}
