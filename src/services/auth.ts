import { pbAdmin, pbUser } from "./pb";

export async function loginUser(email: string, password: string) {
  return pbUser.collection("users").authWithPassword(email, password);
}

export async function loginAdmin(email: string, password: string) {
  return pbAdmin.collection("_superusers").authWithPassword(email, password);
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return pbUser.collection("users").create({
    name: data.name,
    email: data.email,
    password: data.password,
    passwordConfirm: data.password,
  });
}

export function logoutUser() {
  pbUser.authStore.clear();
}

export function logoutAdmin() {
  pbAdmin.authStore.clear();
}

export function logout() {
  pbUser.authStore.clear();
  pbAdmin.authStore.clear();
}
