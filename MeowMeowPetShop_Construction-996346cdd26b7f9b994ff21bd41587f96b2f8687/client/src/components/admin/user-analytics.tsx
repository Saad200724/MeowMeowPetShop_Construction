
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface UserStats {
  totalUsers: number;
  supabaseUsers: number;
  fallbackUsers: number;
  concurrentConnections: number;
  monthlyActiveUsers: number;
}

export function UserAnalytics() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    supabaseUsers: 0,
    fallbackUsers: 0,
    concurrentConnections: 0,
    monthlyActiveUsers: 0
  });

  useEffect(() => {
    // Get stats from localStorage and API
    const storedStats = localStorage.getItem('connection_stats');
    const supabaseConnections = parseInt(localStorage.getItem('supabase_connections') || '0');
    
    if (storedStats) {
      const parsed = JSON.parse(storedStats);
      setStats(prev => ({
        ...prev,
        totalUsers: parsed.total || 0,
        supabaseUsers: parsed.supabase || 0,
        fallbackUsers: parsed.fallback || 0,
        concurrentConnections: supabaseConnections
      }));
    }

    // Fetch additional stats from API
    fetch('/api/admin/user-stats')
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({
          ...prev,
          monthlyActiveUsers: data.monthlyActiveUsers || 0
        }));
      })
      .catch(console.error);
  }, []);

  const supabaseUsagePercent = (stats.concurrentConnections / 200) * 100;
  const monthlyUsagePercent = (stats.monthlyActiveUsers / 50000) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Badge variant="outline">{stats.totalUsers}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Across all authentication methods
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Supabase Users</CardTitle>
          <Badge variant="default">{stats.supabaseUsers}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.supabaseUsers}</div>
          <p className="text-xs text-muted-foreground">
            Using primary authentication
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fallback Users</CardTitle>
          <Badge variant="secondary">{stats.fallbackUsers}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.fallbackUsers}</div>
          <p className="text-xs text-muted-foreground">
            Using fallback authentication
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concurrent Connections</CardTitle>
          <Badge variant={supabaseUsagePercent > 90 ? "destructive" : "outline"}>
            {stats.concurrentConnections}/200
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.concurrentConnections}</div>
          <Progress value={supabaseUsagePercent} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {supabaseUsagePercent.toFixed(1)}% of Supabase limit
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.monthlyActiveUsers}</div>
          <Progress value={monthlyUsagePercent} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.monthlyActiveUsers}/50,000 ({monthlyUsagePercent.toFixed(1)}% of limit)
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Authentication Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Supabase Auth</span>
              <span className="text-sm font-medium">
                {stats.totalUsers > 0 ? ((stats.supabaseUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <Progress 
              value={stats.totalUsers > 0 ? (stats.supabaseUsers / stats.totalUsers) * 100 : 0} 
              className="h-2" 
            />
            <div className="flex justify-between items-center">
              <span className="text-sm">Fallback Auth</span>
              <span className="text-sm font-medium">
                {stats.totalUsers > 0 ? ((stats.fallbackUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <Progress 
              value={stats.totalUsers > 0 ? (stats.fallbackUsers / stats.totalUsers) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
