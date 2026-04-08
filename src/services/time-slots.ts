import type { RecordModel } from "pocketbase";
import { pb } from "./pb";

export interface TimeSlot extends RecordModel {
  service: string;
  date: string;
  time: string;
}

export async function getTimeSlots(): Promise<TimeSlot[]> {
  return pb.collection("time_slots").getFullList<TimeSlot>({
    sort: "date,time",
    expand: "service,bookings_via_time_slot",
  });
}

export async function createTimeSlot(data: {
  service: string;
  date: string;
  time: string;
}): Promise<TimeSlot> {
  return pb.collection("time_slots").create<TimeSlot>(data);
}

export async function deleteTimeSlot(id: string): Promise<void> {
  await pb.collection("time_slots").delete(id);
}
