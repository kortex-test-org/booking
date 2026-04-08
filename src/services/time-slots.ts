import type { RecordModel } from "pocketbase";
import { pb, getAdminPb } from "./pb";

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

// Серверная функция с admin-авторизацией.
// Без admin-токена PocketBase возвращает [] для expand bookings_via_time_slot
// из-за правила API «только свои бронирования», поэтому все слоты
// выглядят свободными. Admin видит все бронирования.
export async function getTimeSlotsServer(): Promise<TimeSlot[]> {
  try {
    const adminPb = await getAdminPb();
    return await adminPb.collection("time_slots").getFullList<TimeSlot>({
      sort: "date,time",
      expand: "bookings_via_time_slot",
      batch: 500,
    });
  } catch (err) {
    console.error("getTimeSlotsServer: admin auth failed, falling back to unauthenticated request", err);
    // Запасной вариант: запрос без авторизации (бронирования будут скрыты)
    return pb.collection("time_slots").getFullList<TimeSlot>({
      sort: "date,time",
      expand: "bookings_via_time_slot",
      batch: 500,
    });
  }
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
