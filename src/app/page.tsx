'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Calendar, CircleUserRound, Bell } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiFetch, PaginatedData, extractRows } from '@/lib/api';

interface Event {
  id: number;
  title: string;
  type: 'Meeting' | 'Payout' | 'Deadline';
  scheduled_at: string;
  chama?: { name: string };
  amount?: number;
}

interface Transaction {
  id: number;
  description: string;
  type: string;
  amount: number;
  created_at: string;
  chama?: { name: string };
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [countdown, setCountdown] = useState('');
  const [nextEventDate, setNextEventDate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    apiFetch<PaginatedData<Transaction>>('/transactions?per_page=5').then((res) => {
      if (res.status === 'success' && res.data) setTransactions(extractRows(res.data));
    });
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const future = events
        .filter((e) => new Date(e.scheduled_at) > new Date())
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
      if (future.length > 0) setNextEventDate(new Date(future[0].scheduled_at));
    }
  }, [events]);

  useEffect(() => {
    if (!nextEventDate) return;
    const interval = setInterval(() => {
      const distance = nextEventDate.getTime() - Date.now();
      if (distance < 0) { clearInterval(interval); setCountdown('Event has passed'); return; }
      const d = Math.floor(distance / 86400000);
      const h = Math.floor((distance % 86400000) / 3600000);
      const m = Math.floor((distance % 3600000) / 60000);
      const s = Math.floor((distance % 60000) / 1000);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextEventDate]);

  const handleApology = () => {
    toast({ title: 'Apology Sent', description: 'Your meeting apology has been recorded.' });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-sans text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/transactions">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactions.length > 0
                  ? `Ksh ${transactions.reduce((s, t) => s + t.amount, 0).toLocaleString()}`
                  : '—'}
              </div>
              <p className="text-xs text-muted-foreground">From recent transactions</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/chamas">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chamas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Your groups</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crowdfunding">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crowdfunds</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Active drives</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crowdfunding">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Unread</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-sans">Recent Activity</CardTitle>
            <CardDescription>Recent transactions from your Chamas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.description}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {t.type} &middot;{' '}
                        {new Date(t.created_at).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${t.amount >= 0 ? 'text-green-400' : ''}`}
                    >
                      Ksh {Math.abs(t.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      No recent transactions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <Calendar /> Upcoming Events
            </CardTitle>
            <CardDescription>Your schedule of meetings, payouts, and deadlines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming events.
              </p>
            )}
            {events.length > 0 && nextEventDate && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  {events.find(
                    (e) => new Date(e.scheduled_at).getTime() === nextEventDate.getTime()
                  )?.title}
                </p>
                <p className="text-2xl font-bold font-mono tracking-wider my-2">
                  {countdown || 'Loading...'}
                </p>
                <Badge variant="secondary">
                  {nextEventDate.toLocaleDateString('en-KE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Badge>
              </div>
            )}
            {events.map((event) => {
              const Icon =
                event.type === 'Meeting'
                  ? CircleUserRound
                  : event.type === 'Payout'
                    ? DollarSign
                    : Bell;
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-3 border-b last:border-b-0"
                >
                  <Icon className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.scheduled_at).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'long',
                      })}
                      {event.chama && ` - ${event.chama.name}`}
                    </p>
                    {event.type === 'Meeting' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                            Can&apos;t make it?
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Meeting Apology</DialogTitle>
                            <DialogDescription>
                              This will notify the chairperson that you will be unable to attend.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="apology-reason" className="sr-only">
                                Reason for absence
                              </Label>
                              <Textarea
                                id="apology-reason"
                                placeholder="Please provide a brief explanation..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="ghost">
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button type="button" onClick={handleApology}>
                                Send Apology
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
