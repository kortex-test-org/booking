import { pb } from "./pb";

export async function loginUser(email: string, password: string) {
  return pb.collection("users").authWithPassword(email, password);
}

export async function loginAdmin(email: string, password: string) {
  return pb.collection("_superusers").authWithPassword(email, password);
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return pb.collection("users").create({
    name: data.name,
    email: data.email,
    password: data.password,
    passwordConfirm: data.password,
  });
}

export function logout() {
  pb.authStore.clear();
}
