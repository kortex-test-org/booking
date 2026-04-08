import PocketBase from "pocketbase";

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

/**
 * Создаёт серверный PocketBase-клиент с admin-авторизацией.
 * Используется только в Server Components / Server Actions, не на клиенте.
 */
export async function getAdminPb(): Promise<PocketBase> {
  const adminPb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  await adminPb.collection("_superusers").authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL ?? "",
    process.env.POCKETBASE_ADMIN_PASSWORD ?? ""
  );
  return adminPb;
}
