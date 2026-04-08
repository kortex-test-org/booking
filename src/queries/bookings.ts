import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteBooking,
  getBookings,
  updateBookingStatus,
  type Booking,
} from "@/services/bookings";

export const bookingsKey = ["bookings"] as const;

export function useBookings() {
  return useQuery({ queryKey: bookingsKey, queryFn: getBookings, retry: 1 });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking["status"] }) =>
      updateBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKey }),
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingsKey }),
  });
}
