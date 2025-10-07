import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Phone, Globe, Mail, User, Building2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BusinessSubmission {
  id: number;
  name: string;
  category: string;
  address: string;
  website: string;
  phone: string;
  email: string;
  description: string;
  highlights: string;
  hours: string;
  pricing: string;
  seasonality: string;
  contactName: string;
  businessRole: string;
  status: string;
  reviewNotes: string;
  reviewedBy: string;
  reviewedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSubmissions() {
  const [selectedSubmission, setSelectedSubmission] = useState<BusinessSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<BusinessSubmission[]>({
    queryKey: ["/api/admin/submissions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, reviewNotes }: { id: number; status: string; reviewNotes: string }) => {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes }),
      });
      if (!response.ok) throw new Error("Failed to update submission");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
      toast({
        title: "Status Updated",
        description: "Submission status has been updated successfully.",
      });
      setSelectedSubmission(null);
      setReviewNotes("");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update submission status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (status: string) => {
    if (selectedSubmission) {
      updateStatusMutation.mutate({
        id: selectedSubmission.id,
        status,
        reviewNotes,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const pendingSubmissions = submissions.filter((s: BusinessSubmission): s is BusinessSubmission => s.status === "pending");
  const reviewedSubmissions = submissions.filter((s: BusinessSubmission): s is BusinessSubmission => s.status !== "pending");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Submissions</h1>
          <p className="text-slate-600">Review and manage destination submissions from businesses</p>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-600">Pending Review</p>
                  <p className="text-2xl font-bold text-slate-900">{pendingSubmissions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-600">Approved</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {submissions.filter((s: BusinessSubmission) => s.status === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-slate-900">{submissions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({reviewedSubmissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">All caught up!</h3>
                  <p className="text-slate-600">No pending submissions to review.</p>
                </CardContent>
              </Card>
            ) : (
              pendingSubmissions.map((submission: BusinessSubmission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onReview={setSelectedSubmission}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-4">
            {reviewedSubmissions.map((submission: BusinessSubmission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onReview={setSelectedSubmission}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Submission: {selectedSubmission?.name}</DialogTitle>
              <DialogDescription>
                Review the business submission and update its status
              </DialogDescription>
            </DialogHeader>

            {selectedSubmission && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Business Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{selectedSubmission.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{selectedSubmission.category}</Badge>
                      </div>
                      {selectedSubmission.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span>{selectedSubmission.address}</span>
                        </div>
                      )}
                      {selectedSubmission.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-500" />
                          <span>{selectedSubmission.phone}</span>
                        </div>
                      )}
                      {selectedSubmission.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-slate-500" />
                          <a href={selectedSubmission.website} target="_blank" rel="noopener noreferrer" 
                             className="text-teal-600 hover:underline">
                            {selectedSubmission.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span>{selectedSubmission.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span>{selectedSubmission.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span>{selectedSubmission.businessRole}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>Submitted {format(new Date(selectedSubmission.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Description</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {selectedSubmission.description}
                  </p>
                </div>

                {selectedSubmission.highlights && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Key Highlights</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                      {selectedSubmission.highlights}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedSubmission.hours && (
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Hours</h5>
                      <p className="text-sm text-slate-600">{selectedSubmission.hours}</p>
                    </div>
                  )}
                  {selectedSubmission.pricing && (
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Pricing</h5>
                      <p className="text-sm text-slate-600">{selectedSubmission.pricing}</p>
                    </div>
                  )}
                  {selectedSubmission.seasonality && (
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Seasonality</h5>
                      <p className="text-sm text-slate-600">{selectedSubmission.seasonality}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Review Notes</h4>
                  <Textarea
                    placeholder="Add notes about your decision..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusUpdate("approved")}
                    disabled={updateStatusMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={updateStatusMutation.isPending}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => setSelectedSubmission(null)}
                    variant="outline"
                    disabled={updateStatusMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function SubmissionCard({ 
  submission, 
  onReview, 
  getStatusColor, 
  getStatusIcon 
}: { 
  submission: BusinessSubmission;
  onReview: (submission: BusinessSubmission) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{submission.name}</CardTitle>
            <CardDescription className="mt-1">
              {submission.category} • Submitted by {submission.contactName}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(submission.status)}>
            {getStatusIcon(submission.status)}
            <span className="ml-1 capitalize">{submission.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {submission.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(submission.createdAt), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {submission.email}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onReview(submission)}
          >
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}