'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlusCircle, Users, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { apiFetch, PaginatedData, extractRows } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Chama {
  id: number;
  name: string;
  status: string;
  subscription_status: string;
  tier: string;
  renewal_date: string;
  chama_members_count?: number;
  stats?: {
    pool_value: number;
  };
}

export default function ChamasPage() {
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<PaginatedData<Chama>>('/chamas').then((res) => {
      if (res.status === 'success' && res.data) {
        setChamas(extractRows(res.data));
      }
    }).finally(() => setLoading(false));
  }, []);

  const totalMembers = chamas.reduce((sum, c) => sum + (c.chama_members_count ?? 0), 0);

  const getSubscriptionBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-900/50 text-green-300">Active</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Chama Circles</h1>
        <Button asChild>
          <Link href="/chamas/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Chama
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/reports">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Target Achievement</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Across all chamas</p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Across {chamas.length} chamas</p>
          </CardContent>
        </Card>
        <Link href="/crowdfunding">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Milestone drives</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crowdfunding">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chamas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chamas.length}</div>
              <p className="text-xs text-muted-foreground">Registered groups</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Your Chamas</CardTitle>
            <CardDescription>Manage your communal savings groups.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Members</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chamas.map((chama) => (
                  <TableRow key={chama.id}>
                    <TableCell className="font-medium">{chama.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {chama.chama_members_count ?? '—'}
                    </TableCell>
                    <TableCell>{getSubscriptionBadge(chama.subscription_status ?? 'active')}</TableCell>
                    <TableCell>
                      <Badge variant={chama.status === 'active' ? 'default' : 'secondary'}>
                        {chama.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/chamas/${chama.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {chamas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No chamas found. Create your first one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Group Performance Index</CardTitle>
            <CardDescription>An overview of the performance of each Chama circle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {chamas.map((chama) => (
              <Link
                href={`/chamas/${chama.id}`}
                key={chama.id}
                className="block p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{chama.name}</span>
                    <span className="capitalize">{chama.subscription_status}</span>
                  </div>
                  <Progress
                    value={chama.subscription_status === 'active' ? 100 : 50}
                    className="h-2"
                  />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
