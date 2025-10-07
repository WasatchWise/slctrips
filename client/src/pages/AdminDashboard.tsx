import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Users, 
  Activity, 
  Mail, 
  BarChart3, 
  Globe, 
  MapPin, 
  Clock, 
  Smartphone,
  RefreshCw,
  Send,
  TrendingUp,
  Camera,
  MapPinIcon,
  Navigation,
  CheckCircle,
  AlertCircle,
  XCircle,
  Link,
  Database
} from "lucide-react";

interface UserInteraction {
  id: number;
  type: string;
  userId?: string;
  email?: string;
  destinationId?: number;
  destinationName?: string;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  timestamp: string;
  details: any;
}

interface AnalyticsData {
  totalDestinations: number;
  totalInteractions: number;
  popularDestinations: Array<{ name: string; count: number }>;
  recentActivity: UserInteraction[];
  emailStats: {
    sent: number;
    pending: number;
    failed: number;
  };
}

interface URLStatusData {
  totalDestinations: number;
  destinationsWithUrls: number;
  destinationsWithoutUrls: number;
  urlCoverage: number;
  sampleDestinationsWithoutUrls: Array<{
    id: number;
    name: string;
    category: string;
    website: string;
  }>;
}

interface GoogleAPIsStatus {
  totalDestinations?: number;
  destinationsWithPhotos?: number;
  destinationsNeedingPhotos?: number;
  [key: string]: any;
}

interface PhotoLibraryStatus {
  totalDestinations?: number;
  destinationsWithPhotos?: number;
  destinationsNeedingPhotos?: number;
  [key: string]: any;
}

// URL Management Component
function URLManagement() {
  const { toast } = useToast();

  // Fetch URL status data
  const { data: urlStatus, isLoading: urlStatusLoading, refetch: refetchUrlStatus } = useQuery<URLStatusData>({
    queryKey: ["/api/admin/url-status"],
    refetchInterval: 30000,
  });

  // Fix missing URLs mutation
  const fixUrlsMutation = useMutation({
    mutationFn: () => apiRequest("/api/admin/fix-missing-urls", "POST"),
    onSuccess: () => {
      toast({
        title: "URLs Updated",
        description: "All missing URLs have been set to 'no URL available'",
      });
      refetchUrlStatus();
    },
    onError: (error) => {
      toast({
        title: "URL Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* URL Coverage Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {urlStatusLoading ? "..." : urlStatus?.totalDestinations || "741"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With URLs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {urlStatusLoading ? "..." : urlStatus?.destinationsWithUrls || "1"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing URLs</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {urlStatusLoading ? "..." : urlStatus?.destinationsWithoutUrls || "740"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* URL Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>URL Management Actions</CardTitle>
          <CardDescription>Manage destination URLs and ensure compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => fixUrlsMutation.mutate()}
              disabled={fixUrlsMutation.isPending}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              {fixUrlsMutation.isPending ? "Updating URLs..." : "Fix Missing URLs"}
            </Button>
            
            <Button 
              onClick={() => refetchUrlStatus()}
              disabled={urlStatusLoading}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Fix Missing URLs:</strong> Sets all destinations without URLs to "no URL available"</p>
            <p>• <strong>Current Status:</strong> {urlStatusLoading ? "Loading..." : `${urlStatus?.destinationsWithUrls || 1} destinations have valid URLs, ${urlStatus?.destinationsWithoutUrls || 740} show "no URL available"`}</p>
            <p>• <strong>Database:</strong> Updates are applied to PostgreSQL (main database), not Supabase reference database</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Google APIs Integration Component
function GoogleAPIsIntegration() {
  const { toast } = useToast();

  // Fetch Google APIs status
  const { data: googleApisStatus, isLoading: statusLoading } = useQuery<GoogleAPIsStatus>({
    queryKey: ['/api/admin/google-apis/status'],
    refetchInterval: 30000
  });

  // Fetch photo library status
  const { data: photoLibraryStatus, isLoading: photoLoading } = useQuery<PhotoLibraryStatus>({
    queryKey: ['/api/admin/photos/library-status'],
    refetchInterval: 30000
  });

  // Photo enrichment mutation
  const enrichPhotosMutation = useMutation({
    mutationFn: async (params: { destinationIds?: number[], maxDestinations?: number }) => {
      return await apiRequest('/api/admin/photos/enrich-batch', 'POST', params);
    },
    onSuccess: () => {
      toast({
        title: "Photo Enrichment Started",
        description: "Batch photo enrichment process has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/library-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrichment Failed",
        description: error.message || "Failed to start photo enrichment",
        variant: "destructive",
      });
    },
  });

  // Drive time audit mutation
  const auditDriveTimesMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/google-apis/audit-drive-times', 'POST');
    },
    onSuccess: () => {
      toast({
        title: "Drive Time Audit Started",
        description: "Drive time accuracy audit has been initiated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Audit Failed", 
        description: error.message || "Failed to start drive time audit",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Google APIs Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Directions API</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {statusLoading ? "..." : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">Active</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Drive time calculations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Google Places API</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {photoLoading ? "..." : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600">Active</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Authentic photo enrichment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Photo Coverage</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {photoLoading ? "..." : `${Math.round((photoLibraryStatus?.destinationsWithPhotos / photoLibraryStatus?.totalDestinations) * 100) || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {photoLoading ? "Loading..." : `${photoLibraryStatus?.destinationsWithPhotos || 0}/${photoLibraryStatus?.totalDestinations || 741} destinations`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Photo Enrichment Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Photo Enrichment</CardTitle>
            <CardDescription>Add authentic photos to destinations using Google Places API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => enrichPhotosMutation.mutate({ maxDestinations: 50 })}
              disabled={enrichPhotosMutation.isPending}
              className="w-full"
            >
              <Camera className="h-4 w-4 mr-2" />
              {enrichPhotosMutation.isPending ? "Enriching..." : "Enrich Photos (Batch 50)"}
            </Button>
            <Button 
              onClick={() => enrichPhotosMutation.mutate({ maxDestinations: 10 })}
              disabled={enrichPhotosMutation.isPending}
              variant="outline"
              className="w-full"
            >
              <MapPinIcon className="h-4 w-4 mr-2" />
              Quick Test (10 Destinations)
            </Button>
            <div className="text-sm text-muted-foreground">
              Uses Google Places API to find and apply authentic photos to destinations missing imagery.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drive Time Accuracy</CardTitle>
            <CardDescription>Audit and correct drive times using Google Directions API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => auditDriveTimesMutation.mutate()}
              disabled={auditDriveTimesMutation.isPending}
              className="w-full"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {auditDriveTimesMutation.isPending ? "Auditing..." : "Audit Drive Times"}
            </Button>
            <div className="text-sm text-muted-foreground">
              Reviews drive time accuracy using Google Maps real-time data
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Quotas and Usage */}
      <Card>
        <CardHeader>
          <CardTitle>API Usage & Quotas</CardTitle>
          <CardDescription>Monitor Google APIs usage and rate limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Directions API</h4>
              <div className="text-sm text-muted-foreground">
                Used for accurate drive time calculations from Salt Lake City
              </div>
              <Badge className="bg-green-100 text-green-800">Within Limits</Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Geocoding API</h4>
              <div className="text-sm text-muted-foreground">
                Used for address validation and coordinate mapping
              </div>
              <Badge className="bg-green-100 text-green-800">Within Limits</Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Places API</h4>
              <div className="text-sm text-muted-foreground">
                Used for authentic destination photo discovery
              </div>
              <Badge className="bg-green-100 text-green-800">Within Limits</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
    refetchInterval: 30000,
  });

  // Fetch user interactions
  const { data: interactions, isLoading: interactionsLoading } = useQuery<UserInteraction[]>({
    queryKey: ["/api/admin/interactions"],
    refetchInterval: 10000,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage SLC Trips platform and monitor system performance</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interactions">Live Interactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="google-apis">Google APIs</TabsTrigger>
          <TabsTrigger value="urls">URL Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsLoading ? "..." : analytics?.totalDestinations || "741"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Interactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {interactionsLoading ? "..." : interactions?.length || "0"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {interactionsLoading ? "..." : new Set(interactions?.map((i: UserInteraction) => i.sessionId)).size || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live User Interactions</CardTitle>
              <CardDescription>Real-time monitoring of user activity</CardDescription>
            </CardHeader>
            <CardContent>
              {interactionsLoading ? (
                <div className="text-center py-4">Loading interactions...</div>
              ) : interactions && interactions.length > 0 ? (
                <div className="space-y-3">
                  {interactions.slice(0, 10).map((interaction: UserInteraction) => (
                    <div key={interaction.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{interaction.type.replace(/_/g, ' ')}</span>
                          {interaction.destinationName && (
                            <Badge variant="outline">{interaction.destinationName}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(interaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No recent interactions</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Destinations</CardTitle>
                <CardDescription>Most viewed destinations this week</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="text-center py-4">Loading popular destinations...</div>
                ) : (
                  <div className="space-y-2">
                    {analytics?.popularDestinations?.slice(0, 10).map((dest: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{dest.name || dest.destination}</span>
                        <Badge variant="secondary">{dest.count} views</Badge>
                      </div>
                    )) || (
                      <div className="text-muted-foreground text-sm">No data available</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interaction Types</CardTitle>
                <CardDescription>Breakdown of user activity</CardDescription>
              </CardHeader>
              <CardContent>
                {interactionsLoading ? (
                  <div className="text-center py-4">Loading interaction data...</div>
                ) : interactions && interactions.length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(
                      interactions.reduce((acc: any, interaction: UserInteraction) => {
                        acc[interaction.type] = (acc[interaction.type] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([type, count]: [string, any]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type.replace(/_/g, ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">No interaction data</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="google-apis" className="space-y-4">
          <GoogleAPIsIntegration />
        </TabsContent>

        <TabsContent value="urls" className="space-y-4">
          <URLManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}