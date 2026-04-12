import type { AuthRecord } from "pocketbase";
import { create } from "zustand";

interface AuthState {
  userRecord: AuthRecord | null;
  isUserValid: boolean;
  adminRecord: AuthRecord | null;
  isAdminValid: boolean;
  isInitialized: boolean;
}

export const useAuthStore = create<AuthState>()(() => ({
  userRecord: null,
  isUserValid: false,
  adminRecord: null,
  isAdminValid: false,
  isInitialized: false,
}));
