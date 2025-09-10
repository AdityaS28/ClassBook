import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";
import { authStorage } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      return res.data;
    },
    onSuccess: (data) => {
      authStorage.setToken(data.accessToken);
      authStorage.setUser(data.user);
      queryClient.setQueryData(["auth"], data);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description:
          error?.response?.data?.error?.message ||
          "Please check your credentials.",
        variant: "destructive",
      });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      const res = await axios.post(`${API_URL}/register`, data);
      return res.data;
    },
    onSuccess: (data) => {
      authStorage.setToken(data.accessToken);
      authStorage.setUser(data.user);
      queryClient.setQueryData(["auth"], data);
      toast({
        title: "Account created!",
        description: "Welcome to ClassBook. You can now book classes.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description:
          error?.response?.data?.error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve(); // optional backend logout
    },
    onSuccess: () => {
      authStorage.clear();
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    },
  });
};
