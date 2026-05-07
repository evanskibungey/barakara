
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart as LineChartIcon, PieChart as PieChartIcon, Users, Target, DollarSign, Activity, TrendingUp, UserPlus, MousePointerClick } from 'lucide-react';
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


const kpiData = {
  totalChamas: 142,
  totalMembers: 1256,
  tvl: 45231890,
  mau: 987,
  retentionRate: 94.2,
  avgSessionTime: '12m 40s'
};

const userEngagementData = [
  { name: 'Jan', DAU: 400, WAU: 1200 },
  { name: 'Feb', DAU: 300, WAU: 1100 },
  { name: 'Mar', DAU: 500, WAU: 1300 },
  { name: 'Apr', DAU: 450, WAU: 1250 },
  { name: 'May', DAU: 600, WAU: 1400 },
  { name: 'Jun', DAU: 550, WAU: 1350 },
];

const financialOverviewData = [
  { name: 'Jan', MRR: 4800 },
  { name: 'Feb', MRR: 5200 },
  { name: 'Mar', MRR: 6100 },
  { name: 'Apr', MRR: 5900 },
  { name: 'May', MRR: 6500 },
  { name: 'Jun', MRR: 7100 },
];

const revenueBreakdownData = [
  { name: 'Starter', value: 40000 },
  { name: 'Growth', value: 120000 },
  { name: 'Scale', value: 250000 },
];

const featureUsageData = [
  { name: 'Chama Management', usage: 85 },
  { name: 'Crowdfunding', usage: 62 },
  { name: 'Loans', usage: 78 },
  { name: 'Marketplace', usage: 45 },
  { name: 'AI Assistant', usage: 55 },
];

const chamaGrowthData = [
  { name: 'Jan', NewChamas: 5 },
  { name: 'Feb', NewChamas: 8 },
  { name: 'Mar', NewChamas: 12 },
  { name: 'Apr', NewChamas: 10 },
  { name: 'May', NewChamas: 15 },
  { name: 'Jun', NewChamas: 18 },
]

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function AccountabilityPage() {
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
        <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1">Last Updated: Just Now</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpiData.mau.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+2.1% since last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpiData.retentionRate}%</div>
                <p className="text-xs text-green-400">High platform stickiness</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Members (30d)</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+150</div>
                <p className="text-xs text-muted-foreground">Organic growth trend</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpiData.avgSessionTime}</div>
                <p className="text-xs text-muted-foreground">+45s from last month</p>
            </CardContent>
        </Card>
      </div>

       <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  User Engagement Trends
                </CardTitle>
                <CardDescription>Daily vs. Weekly Active Users across all circles.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChartComponent data={userEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))'
                        }}
                    />
                    <Legend iconSize={10} />
                    <Bar dataKey="DAU" fill="hsl(var(--chart-1))" name="Daily Active" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="WAU" fill="hsl(var(--chart-2))" name="Weekly Active" radius={[4, 4, 0, 0]} />
                  </BarChartComponent>
                </ResponsiveContainer>
              </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Feature Adoption
                    </CardTitle>
                    <CardDescription>Percentage of active members using core platform modules.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChartComponent data={featureUsageData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))'
                                }}
                            />
                            <Bar dataKey="usage" name="Adoption %" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                        </BarChartComponent>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
       </div>

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
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={revenueBreakdownData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {revenueBreakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))'
                                }}
                            />
                            <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
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
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={financialOverviewData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))'
                                }}
                            />
                            <Legend iconSize={10}/>
                            <Line type="monotone" dataKey="MRR" name="MRR (KES)" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
