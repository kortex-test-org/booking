import type { RecordModel } from "pocketbase";
import { pbAdmin } from "./pb";

export interface User extends RecordModel {
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  return pbAdmin.collection("users").getFullList<User>({ sort: "name" });
}
