import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Booking,
  adminUpdateBookingStatus,
  createBooking,
  deleteBooking,
  getBookings,
  getUserBookings,
  updateBookingStatus,
} from "@/services/bookings";

export const bookingsKey = ["bookings"] as const;
export const userBookingsKey = ["user-bookings"] as const;

export function useBookings() {
  return useQuery({ queryKey: bookingsKey, queryFn: getBookings, retry: 1 });
}

export function useUserBookings() {
  return useQuery({
    queryKey: userBookingsKey,
    queryFn: getUserBookings,
    retry: 1,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking["status"] }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKey });
      queryClient.invalidateQueries({ queryKey: userBookingsKey });
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
    },
  });
}

export function useAdminUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking["status"] }) =>
      adminUpdateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKey });
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKey });
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKey });
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
    },
  });
}
