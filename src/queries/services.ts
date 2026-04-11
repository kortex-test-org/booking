import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Service } from "@/services/services";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "@/services/services";

export const servicesKey = ["services"] as const;

export function useServices() {
  return useQuery<Service[]>({
    queryKey: servicesKey,
    queryFn: () => getServices(),
    retry: 1,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => qc.invalidateQueries({ queryKey: servicesKey }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Service, keyof import("pocketbase").RecordModel>>;
    }) => updateService(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: servicesKey }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => qc.invalidateQueries({ queryKey: servicesKey }),
  });
}
