import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTimeSlot,
  deleteTimeSlot,
  getTimeSlots,
} from "@/services/time-slots";

export const timeSlotsKey = ["time_slots"] as const;

export function useTimeSlots() {
  return useQuery({ queryKey: timeSlotsKey, queryFn: getTimeSlots, retry: 1 });
}

export function useCreateTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTimeSlot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: timeSlotsKey }),
  });
}

export function useDeleteTimeSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTimeSlot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: timeSlotsKey }),
  });
}
