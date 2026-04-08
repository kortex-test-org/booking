import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices, createService, updateService, deleteService } from "@/services/services";
import type { Service } from "@/services/services";

export const servicesKey = ["services"] as const;

export function useServices() {
  return useQuery<Service[]>({ queryKey: servicesKey, queryFn: () => getServices(), retry: 1 });
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Service, keyof import("pocketbase").RecordModel>> }) =>
      updateService(id, data),
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
