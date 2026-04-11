import type { AuthRecord } from "pocketbase";
import { create } from "zustand";

interface AuthState {
  record: AuthRecord | null;
  isValid: boolean;
  isSuperuser: boolean;
  isInitialized: boolean;
}

export const useAuthStore = create<AuthState>()(() => ({
  record: null,
  isValid: false,
  isSuperuser: false,
  isInitialized: false,
}));
