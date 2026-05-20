'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, TrendingUp, UserPlus, MousePointerClick } from 'lucide-react';
import {
  LineChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
} from 'recharts';
import { BarChart as BarChartComponent } from '@/components/ui/chart';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

// ── Types matching backend response shapes ──────────────────────────────────

interface KpiData {
  mau: number;
  retentionRate: number;
  newMembers: number;
  totalChamas: number;
  totalMembers: number;
  tvl: number;
}

interface EngagementPoint { name: string; DAU: number; WAU: number; }
interface GrowthPoint     { name: string; MRR: number; }
interface RevenuePoint    { name: string; value: number; }
interface FeaturePoint    { name: string; usage: number; }

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

function StatSkeleton() {
  return <Skeleton className="h-8 w-24" />;
}

export default function AccountabilityPage() {
  const [kpis, setKpis]               = useState<KpiData | null>(null);
  const [engagement, setEngagement]   = useState<EngagementPoint[]>([]);
  const [growth, setGrowth]           = useState<GrowthPoint[]>([]);
  const [revenue, setRevenue]         = useState<RevenuePoint[]>([]);
  const [features, setFeatures]       = useState<FeaturePoint[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<KpiData>('/accountability/kpis'),
      apiFetch<EngagementPoint[]>('/accountability/engagement'),
      apiFetch<GrowthPoint[]>('/accountability/growth'),
      apiFetch<RevenuePoint[]>('/accountability/revenue'),
      apiFetch<FeaturePoint[]>('/accountability/feature-adoption'),
    ]).then(([kpiRes, engRes, growthRes, revenueRes, featureRes]) => {
      if (kpiRes.status === 'success' && kpiRes.data)         setKpis(kpiRes.data);
      if (engRes.status === 'success' && engRes.data)         setEngagement(engRes.data);
      if (growthRes.status === 'success' && growthRes.data)   setGrowth(growthRes.data);
      if (revenueRes.status === 'success' && revenueRes.data) setRevenue(revenueRes.data);
      if (featureRes.status === 'success' && featureRes.data) setFeatures(featureRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Monitoring & BI Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track platform usage, user engagement, and growth metrics.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {loading ? 'Loading…' : 'Live Data'}
        </Badge>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-2xl font-bold">{kpis?.mau?.toLocaleString() ?? '—'}</div>
            )}
            <p className="text-xs text-muted-foreground">Distinct users with transactions in 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-2xl font-bold">{kpis?.retentionRate ?? '—'}%</div>
            )}
            <p className="text-xs text-green-400">Month-over-month active user retention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Members (30d)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-2xl font-bold">+{kpis?.newMembers?.toLocaleString() ?? '—'}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {kpis ? `${kpis.totalMembers.toLocaleString()} total members` : 'Loading…'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-2xl font-bold">
                KES {kpis ? (kpis.tvl / 100).toLocaleString() : '—'}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Across {kpis?.totalChamas ?? '—'} active chamas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row 1 ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              User Engagement Trends
            </CardTitle>
            <CardDescription>Average Daily vs. Weekly Active Users per month.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[300px] w-full" /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChartComponent data={engagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Legend iconSize={10} />
                  <Bar dataKey="DAU" fill="hsl(var(--chart-1))" name="Daily Active" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="WAU" fill="hsl(var(--chart-2))" name="Weekly Active" radius={[4, 4, 0, 0]} />
                </BarChartComponent>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Feature Adoption
            </CardTitle>
            <CardDescription>% of registered members using each platform module.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[300px] w-full" /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChartComponent data={features} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={130} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="usage" name="Adoption %" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                </BarChartComponent>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Charts Row 2 ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Revenue Breakdown by Tier
            </CardTitle>
            <CardDescription>Distribution of MRR across subscription plans.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[300px] w-full" /> : revenue.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                No active subscriptions yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenue.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`KES ${(value / 100).toLocaleString()}`, 'MRR']}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Growth & Revenue Momentum
            </CardTitle>
            <CardDescription>Monthly Recurring Revenue (KES) trend over time.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[300px] w-full" /> : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [`KES ${(value / 100).toLocaleString()}`, 'MRR']}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend iconSize={10} />
                  <Line
                    type="monotone"
                    dataKey="MRR"
                    name="MRR (KES)"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
