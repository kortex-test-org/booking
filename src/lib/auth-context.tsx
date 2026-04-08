"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthRecord } from "pocketbase";
import { pb } from "@/services/pb";

interface AuthState {
  record: AuthRecord | null;
  isValid: boolean;
  isSuperuser: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthState>({
  record: null,
  isValid: false,
  isSuperuser: false,
  isInitialized: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    record: null,
    isValid: false,
    isSuperuser: false,
    isInitialized: false,
  });

  useEffect(() => {
    // Синхронизируем начальное состояние на клиенте
    setState({
      record: pb.authStore.record,
      isValid: pb.authStore.isValid,
      isSuperuser: pb.authStore.isSuperuser,
      isInitialized: true,
    });

    const unsubscribe = pb.authStore.onChange(() => {
      setState({
        record: pb.authStore.record,
        isValid: pb.authStore.isValid,
        isSuperuser: pb.authStore.isSuperuser,
        isInitialized: true,
      });
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
