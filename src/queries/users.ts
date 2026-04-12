import { useMutation, useQuery } from "@tanstack/react-query";
import { updateUserPassword, updateUserProfile } from "@/services/auth";
import { getUsers } from "@/services/users";

export const usersKey = ["users"] as const;

export function useUsers() {
  return useQuery({ queryKey: usersKey, queryFn: getUsers, retry: 1 });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: ({ userId, name }: { userId: string; name: string }) =>
      updateUserProfile(userId, name),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: ({
      userId,
      oldPassword,
      newPassword,
    }: {
      userId: string;
      oldPassword: string;
      newPassword: string;
    }) => updateUserPassword(userId, oldPassword, newPassword),
  });
}
