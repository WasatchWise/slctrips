import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Temporarily disable authentication to prevent white screen
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null
  };
}
