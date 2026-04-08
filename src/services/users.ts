import type { RecordModel } from "pocketbase";
import { pb } from "./pb";

export interface User extends RecordModel {
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  return pb.collection("users").getFullList<User>({ sort: "name" });
}
