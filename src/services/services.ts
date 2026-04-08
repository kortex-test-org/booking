import type { RecordModel } from "pocketbase";
import { pb } from "./pb";

export interface Service extends RecordModel {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export async function getServices(): Promise<Service[]> {
  return pb.collection("services").getFullList<Service>({ sort: "name" });
}
