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

let adminLogoutRedirect = "/admin/login";

export function logoutAdmin(redirectTo = "/admin/login") {
  adminLogoutRedirect = redirectTo;
  pbAdmin.authStore.clear();
}

export function consumeAdminLogoutRedirect(): string {
  const path = adminLogoutRedirect;
  adminLogoutRedirect = "/admin/login";
  return path;
}

export function logout() {
  pbUser.authStore.clear();
  pbAdmin.authStore.clear();
}

export async function updateUserProfile(userId: string, name: string) {
  return pbUser.collection("users").update(userId, { name });
}

export async function updateUserPassword(
  userId: string,
  oldPassword: string,
  newPassword: string,
) {
  return pbUser.collection("users").update(userId, {
    oldPassword,
    password: newPassword,
    passwordConfirm: newPassword,
  });
}
