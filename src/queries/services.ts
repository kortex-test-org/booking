import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/services/services";

export const servicesKey = ["services"] as const;

export function useServices() {
  return useQuery({ queryKey: servicesKey, queryFn: getServices, retry: 1 });
}
