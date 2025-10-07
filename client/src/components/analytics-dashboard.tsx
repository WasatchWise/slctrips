import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { TrendingUp, Phone, Globe, Mail, Eye } from "lucide-react";

interface DestinationAnalytics {
  id: number;
  name: string;
  category: string;
  drive_time_text: string;
  website: string;
  phone: string;
  total_interactions: number;
  detail_views: number;
  website_clicks: number;
  phone_clicks: number;
  last_interaction: string;
}

interface MarketingOpportunity {
  id: number;
  name: string;
  category: string;
  drive_time_text?: string;
  website?: string;
  phone?: string;
  rating?: number;
  total_clicks?: number;
  opportunity_type: string;
}

interface AnalyticsResponse {
  timeframe?: string;
  topDestinations?: DestinationAnalytics[];
}

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("30");

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery<AnalyticsResponse>({
    queryKey: ["/api/analytics/destinations", timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/destinations?timeframe=${timeframe}`);
      return response.json();
    },
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<MarketingOpportunity[]>({
    queryKey: ["/api/marketing/opportunities"],
    queryFn: async () => {
      const response = await fetch('/api/marketing/opportunities');
      if (!response.ok) return [];
      return response.json();
    },
  });

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'zero_clicks': return 'destructive';
      case 'high_traffic': return 'default';
      case 'moderate_traffic': return 'secondary';
      case 'low_traffic': return 'outline';
      default: return 'outline';
    }
  };

  const getOpportunityLabel = (type: string) => {
    switch (type) {
      case 'zero_clicks': return 'Zero Clicks';
      case 'high_traffic': return 'High Traffic';
      case 'moderate_traffic': return 'Moderate Traffic';
      case 'low_traffic': return 'Low Traffic';
      default: return type;
    }
  };

  if (analyticsLoading || opportunitiesLoading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Destination Analytics</h1>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top Performing Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Destinations ({analyticsData?.timeframe})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData?.topDestinations?.slice(0, 10).map((destination: DestinationAnalytics) => (
              <div key={destination.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{destination.name}</h3>
                  <p className="text-sm text-gray-600">{destination.category} • {destination.drive_time_text}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {destination.detail_views}
                  </div>
                  {destination.website_clicks > 0 && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {destination.website_clicks}
                    </div>
                  )}
                  {destination.phone_clicks > 0 && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {destination.phone_clicks}
                    </div>
                  )}
                  <Badge variant="secondary">{destination.total_interactions} total</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Marketing Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Zero Click Destinations */}
            <div>
              <h3 className="font-semibold mb-3 text-red-600">Zero Clicks - Outreach Needed</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(opportunities || []).filter((opp) => opp.opportunity_type === 'zero_clicks')
                  .slice(0, 20).map((opportunity) => (
                  <div key={opportunity.id} className="p-3 border rounded-lg bg-red-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{opportunity.name}</h4>
                        <p className="text-xs text-gray-600">{opportunity.category} • {opportunity.drive_time_text}</p>
                        {opportunity.rating && (
                          <p className="text-xs text-yellow-600">★ {opportunity.rating}/5</p>
                        )}
                      </div>
                      <Badge variant={getOpportunityColor(opportunity.opportunity_type)}>
                        {getOpportunityLabel(opportunity.opportunity_type)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {opportunity.website && (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Visit Website
                        </Button>
                      )}
                      {opportunity.phone && (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Call: {opportunity.phone}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High Traffic Destinations */}
            <div>
              <h3 className="font-semibold mb-3 text-green-600">High Traffic - Partnership Ready</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(opportunities || []).filter((opp) => opp.opportunity_type === 'high_traffic')
                  .slice(0, 20).map((opportunity) => (
                  <div key={opportunity.id} className="p-3 border rounded-lg bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{opportunity.name}</h4>
                        <p className="text-xs text-gray-600">{opportunity.category} • {opportunity.drive_time_text}</p>
                        <p className="text-xs text-green-600">{opportunity.total_clicks} clicks</p>
                        {opportunity.rating && (
                          <p className="text-xs text-yellow-600">★ {opportunity.rating}/5</p>
                        )}
                      </div>
                      <Badge variant={getOpportunityColor(opportunity.opportunity_type)}>
                        {getOpportunityLabel(opportunity.opportunity_type)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {opportunity.website && (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Partnership Proposal
                        </Button>
                      )}
                      {opportunity.phone && (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Call: {opportunity.phone}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(opportunities || []).filter((opp) => opp.opportunity_type === 'zero_clicks').length || 0}
            </div>
            <p className="text-xs text-gray-600">Zero-Click Destinations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(opportunities || []).filter((opp) => opp.opportunity_type === 'high_traffic').length || 0}
            </div>
            <p className="text-xs text-gray-600">High-Traffic Destinations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(opportunities || []).filter((opp) => opp.website).length || 0}
            </div>
            <p className="text-xs text-gray-600">Have Websites</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {(opportunities || []).filter((opp) => opp.phone).length || 0}
            </div>
            <p className="text-xs text-gray-600">Have Phone Numbers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}