import type { RecordModel } from "pocketbase";
import { pb } from "./pb";

export interface Service extends RecordModel {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export async function getServices(options?: {
  requestKey?: string | null;
}): Promise<Service[]> {
  return pb
    .collection("services")
    .getFullList<Service>({ sort: "name", ...options });
}

export async function createService(
  data: Omit<Service, keyof import("pocketbase").RecordModel>,
): Promise<Service> {
  return pb.collection("services").create<Service>(data);
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, keyof import("pocketbase").RecordModel>>,
): Promise<Service> {
  return pb.collection("services").update<Service>(id, data);
}

export async function deleteService(id: string): Promise<void> {
  await pb.collection("services").delete(id);
}
