import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Booking, BookSessionRequest, Session } from "@/types/class";
import { getHeaders } from "@/api/classes";

const API_URL = import.meta.env.VITE_API_URL;

// ----------------------
// Fetch all upcoming sessions
// GET /user/sessions
// ----------------------
export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async (): Promise<Session[]> => {
      const { data } = await axios.get(`${API_URL}/user/sessions`, {
        headers: getHeaders(),
      });
      return data;
    },
  });
};

// ----------------------
// Fetch a single session by ID
// GET /user/sessions/:sessionId
// ----------------------
export const useSessionById = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: async (): Promise<Session> => {
      const { data } = await axios.get(
        `${API_URL}/user/sessions/${sessionId}`,
        { headers: getHeaders() }
      );
      return data;
    },
    enabled: !!sessionId,
  });
};

// ----------------------
// Fetch bookings for a session
// GET /user/sessions/:sessionId/bookings
// ----------------------
export const useSessionBookings = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", sessionId, "bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const { data } = await axios.get(
        `${API_URL}/user/sessions/${sessionId}/bookings`,
        { headers: getHeaders() }
      );
      return data;
    },
    enabled: !!sessionId,
  });
};

// ----------------------
// Fetch logged-in user's bookings
// GET /user/bookings
// ----------------------
export const useMyBookings = () => {
  return useQuery({
    queryKey: ["bookings", "my"],
    queryFn: async (): Promise<Booking[]> => {
      const { data } = await axios.get(`${API_URL}/user/bookings`, {
        headers: getHeaders(),
      });

      // Transform backend shape -> frontend shape
      return data.map((b: any) => ({
        id: b.id,
        status: "CONFIRMED", // backend doesn’t send, default it
        bookedAt: b.createdAt,
        session: {
          id: b.session.id,
          date: b.session.dateTime, // full datetime, you can split later
          time: new Date(b.session.dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          className: b.session.class.name,
          instructor: "TBD", // backend doesn’t send yet
        },
      }));
    },
  });
};


// ----------------------
// Book a session
// POST /user/sessions/:sessionId/book
// ----------------------
export const useBookSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId }: BookSessionRequest): Promise<Booking> => {
      const { data } = await axios.post(
        `${API_URL}/user/sessions/${sessionId}/book`,
        {},
        { headers: getHeaders() }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "Session booked!",
        description: "You've successfully booked your spot in this class.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description:
          error?.response?.data?.error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

// ----------------------
// Cancel a booking
// DELETE /user/sessions/:sessionId/cancel
// ----------------------
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      await axios.delete(`${API_URL}/user/sessions/${sessionId}/cancel`, {
        headers: getHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation failed",
        description:
          error?.response?.data?.error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};
