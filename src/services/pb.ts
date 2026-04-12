import PocketBase, { LocalAuthStore } from "pocketbase";

export const pbUser = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL,
  new LocalAuthStore("pb_user_auth"),
);

export const pbAdmin = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL,
  new LocalAuthStore("pb_admin_auth"),
);

// pb is an alias for pbUser — all user-facing services use this
export const pb = pbUser;

// Sync user auth state to cookie so API routes can read the token server-side
if (typeof window !== "undefined") {
  pbUser.authStore.onChange(() => {
    document.cookie = pbUser.authStore.exportToCookie({
      httpOnly: false,
      path: "/",
      secure: window.location.protocol === "https:",
      sameSite: "Lax",
    });
  }, true);
}

/**
 * Создаёт серверный PocketBase-клиент с admin-авторизацией.
 * Используется только в Server Components / Server Actions, не на клиенте.
 */
export async function getAdminPb(): Promise<PocketBase> {
  const adminPb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  await adminPb
    .collection("_superusers")
    .authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL ?? "",
      process.env.POCKETBASE_ADMIN_PASSWORD ?? "",
    );
  return adminPb;
}
