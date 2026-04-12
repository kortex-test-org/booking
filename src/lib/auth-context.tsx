"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { pbAdmin, pbUser } from "@/services/pb";
import { useAuthStore } from "./auth-store";

function syncAuthState() {
  useAuthStore.setState({
    userRecord: pbUser.authStore.record,
    isUserValid: pbUser.authStore.isValid,
    adminRecord: pbAdmin.authStore.record,
    isAdminValid: pbAdmin.authStore.isValid,
    isInitialized: true,
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    syncAuthState();
    const unsubUser = pbUser.authStore.onChange(syncAuthState);
    const unsubAdmin = pbAdmin.authStore.onChange(syncAuthState);
    return () => {
      unsubUser();
      unsubAdmin();
    };
  }, []);

  return <>{children}</>;
}

export function useAuth() {
  return useAuthStore();
}
