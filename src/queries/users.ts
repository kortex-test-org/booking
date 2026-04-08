import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users";

export const usersKey = ["users"] as const;

export function useUsers() {
  return useQuery({ queryKey: usersKey, queryFn: getUsers, retry: 1 });
}
