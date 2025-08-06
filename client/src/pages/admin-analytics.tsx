import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AdminAnalytics() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
          <p className="text-gray-600">Internal destination performance tracking and marketing opportunities</p>
        </div>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}