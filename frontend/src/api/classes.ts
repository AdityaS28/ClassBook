import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Class,
  CreateClassRequest,
  Session,
  CreateSessionRequest,
} from "@/types/class";
import { toast } from "@/hooks/use-toast";
import { authStorage } from "@/lib/auth";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to add auth headers
export const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${authStorage.getToken()}`,
});

export const useClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async (): Promise<Class[]> => {
      const res = await fetch(`${API_URL}/admin/get_classes`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch classes");
      return res.json();
    },
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClassRequest): Promise<Class> => {
      const res = await fetch(`${API_URL}/admin/classes`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create class");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast({
        title: "Class created",
        description: "New class has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create class",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async (): Promise<Session[]> => {
      const res = await fetch(`${API_URL}/user/sessions`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionRequest): Promise<Session> => {
      const res = await fetch(`${API_URL}/admin/sessions`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "Session created",
        description: "New session has been successfully scheduled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create session",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useSessionById = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: async (): Promise<Session | null> => {
      const res = await fetch(`${API_URL}/user/sessions/${sessionId}/bookings`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch session");
      return res.json();
    },
    enabled: !!sessionId,
  });
};

// Booking a session
export const useBookSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number) => {
      const res = await fetch(`${API_URL}/user/sessions/${sessionId}/book`, {
        method: "POST",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to book session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "Session booked",
        description: "You have successfully booked this session.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Cancel a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number) => {
      const res = await fetch(`${API_URL}/user/sessions/${sessionId}/cancel`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};
