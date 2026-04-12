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

async function validateTokens() {
  if (pbUser.authStore.isValid) {
    await pbUser.collection("users").authRefresh().catch(() => {
      pbUser.authStore.clear();
    });
  }

  if (pbAdmin.authStore.isValid) {
    await pbAdmin.collection("_superusers").authRefresh().catch(() => {
      pbAdmin.authStore.clear();
    });
  }

  syncAuthState();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    syncAuthState();
    validateTokens();
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
