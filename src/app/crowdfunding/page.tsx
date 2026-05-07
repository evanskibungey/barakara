'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Target, Users, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch, PaginatedData, extractRows } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Drive {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  status: string;
  cover_image_url?: string;
  creator?: { name: string };
}

export default function CrowdfundingPage() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<PaginatedData<Drive>>('/crowdfunding')
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setDrives(extractRows(res.data));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalRaised = drives.reduce((sum, d) => sum + d.raised, 0);
  const fundedDrives = drives.filter((d) => d.status === 'funded').length;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Milestone Drives</h1>
        <Button asChild>
          <Link href="/crowdfunding/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Start a New Drive
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {totalRaised.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all drives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drives.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Funded</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fundedDrives}</div>
            <p className="text-xs text-muted-foreground">Drives that reached their goal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {drives.map((drive) => {
          const progress = drive.goal > 0 ? (drive.raised / drive.goal) * 100 : 0;
          return (
            <Link href={`/crowdfunding/${drive.id}`} key={drive.id}>
              <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                <CardHeader className="p-0">
                  {drive.cover_image_url && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={drive.cover_image_url}
                        alt={drive.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-6 pb-0">
                    <CardTitle className="font-headline">{drive.title}</CardTitle>
                    <CardDescription className="pt-2">{drive.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Raised</span>
                    <span className="text-sm font-medium text-muted-foreground">Goal</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-primary">
                      Ksh {drive.raised.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      Ksh {drive.goal.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Contribute</Button>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
        {drives.length === 0 && (
          <div className="col-span-3 text-center text-muted-foreground py-12">
            No active drives. Be the first to start one!
          </div>
        )}
      </div>
    </div>
  );
}
