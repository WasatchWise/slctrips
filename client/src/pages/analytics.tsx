import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CleanNavigation } from "@/components/clean-navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Mail, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/kit-analytics"],
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
        <CleanNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Authenticating...</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
        <CleanNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading analytics...</div>
        </div>
      </div>
    );
  }

  const kitStats = analytics?.kitStats || [];
  const totalSignups = analytics?.totalSignups || 0;
  const totalVotes = analytics?.totalVotes || 0;

  // Sort kits by popularity score
  const sortedKits = [...kitStats].sort((a, b) => b.popularityScore - a.popularityScore);

  // Prepare chart data
  const chartData = sortedKits.map(kit => ({
    name: kit.kitName.replace(' Kit', ''),
    signups: kit.signups,
    rank1: kit.rank1_votes,
    rank2: kit.rank2_votes,
    rank3: kit.rank3_votes,
    totalVotes: kit.totalVotes,
    popularityScore: kit.popularityScore,
  }));

  const pieData = sortedKits.slice(0, 5).map((kit, index) => ({
    name: kit.kitName.replace(' Kit', ''),
    value: kit.popularityScore,
    fill: ['#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'][index],
  }));

  const COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <CleanNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Kit Analytics Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Real-time data from user signups and ranked choice voting
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSignups}</div>
              <p className="text-xs text-muted-foreground">
                Email subscriptions across all kits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
              <p className="text-xs text-muted-foreground">
                Ranked choice preferences submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{sortedKits[0]?.kitName || 'No data'}</div>
              <p className="text-xs text-muted-foreground">
                Score: {sortedKits[0]?.popularityScore || 0} points
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rankings Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Kit Rankings & Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedKits.map((kit, index) => (
                <div key={kit.kitName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant={index < 3 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <h3 className="font-semibold">{kit.kitName}</h3>
                      <p className="text-sm text-slate-600">
                        {kit.signups} signups • {kit.totalVotes} votes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-600">
                      {kit.popularityScore} pts
                    </div>
                    <div className="text-xs text-slate-500">
                      Rank 1: {kit.rank1_votes} • Rank 2: {kit.rank2_votes} • Rank 3: {kit.rank3_votes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Signup & Vote Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="signups" fill="#0ea5e9" name="Signups" />
                  <Bar dataKey="totalVotes" fill="#8b5cf6" name="Total Votes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Kit Popularity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Business Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Bundle Opportunities</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Based on voting patterns, consider bundling:
                </p>
                <ul className="text-sm space-y-1">
                  {sortedKits.slice(0, 3).map((kit, index) => (
                    <li key={kit.kitName} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      {kit.kitName}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Development Priority</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Focus development on high-demand kits:
                </p>
                <ul className="text-sm space-y-1">
                  {sortedKits
                    .filter(kit => kit.signups > 0)
                    .slice(0, 3)
                    .map(kit => (
                    <li key={kit.kitName} className="flex justify-between">
                      <span>{kit.kitName}</span>
                      <span className="text-yellow-600">{kit.signups} interested</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}