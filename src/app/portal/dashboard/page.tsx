'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { portalFetch, getPortalUser, clearPortalSession } from '@/lib/portal-api';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Loader2, LogOut, Users, TrendingUp, Wallet, Bell, BellDot,
  AlertCircle, CheckCircle2, Clock, CreditCard, Building2,
  PiggyBank, HandCoins, Calendar, Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContributionAnalysis {
  status: string;
  current_period: string;
  current_period_status: string;
  current_period_paid: number;
  expected_amount: number;
  balance_due: number;
  advance_balance: number;
  periods_expected: number;
  periods_paid: number;
  periods_missed: number;
  missed_periods: string[];
  days_overdue: number;
  last_paid_period: string | null;
  last_paid_date: string | null;
  last_paid_amount: number | null;
  frequency: string;
}

interface Membership {
  chama_id: number;
  chama_name: string;
  chama_logo?: string;
  pool_id?: string;
  role: string;
  status: string;
  contribution_status: string;
  contribution_analysis?: ContributionAnalysis;
  joined_at?: string;
  total_saved: number;
  active_loan?: { id: number; amount: number; amount_paid: number; status: string; next_payment_date?: string } | null;
  next_payout?: { amount: number; scheduled_date: string } | null;
}

interface Contribution {
  id: number;
  chama_name?: string;
  period: string;
  amount: number;
  status: string;
  payment_method?: string;
  paid_at?: string;
  reference_id?: string;
}

interface Loan {
  id: number;
  chama_name?: string;
  amount: number;
  amount_paid: number;
  interest_rate: number;
  status: string;
  purpose?: string;
  repayment_period?: number;
  next_payment_date?: string;
  application_date?: string;
}

interface Notification {
  id: number;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface DashboardData {
  profile: {
    id: number; name: string; member_id?: string; phone: string;
    email?: string; avatar_url?: string; location?: string;
    occupation?: string; kyc_status?: string;
  };
  summary: {
    chamas_count: number; total_saved: number;
    total_wallet_balance: number; active_loans_count: number;
    unread_notifications: number;
  };
  memberships: Membership[];
  contributions: Contribution[];
  loans: Loan[];
  notifications: Notification[];
}

type StkStatus = 'idle' | 'loading' | 'pending' | 'success' | 'failed';

function statusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === 'paid' || s === 'good_standing' || s === 'active' || s === 'completed')
    return <Badge className="bg-green-900/50 text-green-300 border-green-700/40 text-xs">{status}</Badge>;
  if (s === 'pending')
    return <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-700/40 text-xs">{status}</Badge>;
  if (s === 'overdue' || s === 'rejected' || s === 'needs_attention')
    return <Badge variant="destructive" className="text-xs">{status}</Badge>;
  return <Badge variant="outline" className="text-xs">{status}</Badge>;
}

function contributionStatusBadge(status: string) {
  switch (status) {
    case 'up_to_date':
      return <Badge className="bg-green-900/50 text-green-300 border-green-700/40 text-xs">Up to Date</Badge>;
    case 'advance':
      return <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700/40 text-xs">Advance</Badge>;
    case 'partial':
      return <Badge className="bg-orange-900/50 text-orange-300 border-orange-700/40 text-xs">Partial</Badge>;
    case 'overdue':
      return <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-700/40 text-xs">Overdue</Badge>;
    case 'missing_payments':
      return <Badge variant="destructive" className="text-xs">Missing Payments</Badge>;
    default:
      return <Badge variant="outline" className="text-xs capitalize">{status.replace(/_/g, ' ')}</Badge>;
  }
}

function paymentMethodLabel(method?: string) {
  if (!method) return '—';
  return method === 'mpesa' ? 'M-Pesa' : method.replace(/_/g, ' ');
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function PortalDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  getPortalUser();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // STK push dialog state
  const [stkOpen, setStkOpen] = useState(false);
  const [stkMembership, setStkMembership] = useState<Membership | null>(null);
  const [stkAmount, setStkAmount] = useState('');
  const [stkStatus, setStkStatus] = useState<StkStatus>('idle');
  const [stkReferenceId, setStkReferenceId] = useState('');
  const [stkPollCount, setStkPollCount] = useState(0);

  const loadData = useCallback(() => {
    setLoading(true);
    portalFetch<DashboardData>('/portal/me')
      .then(res => {
        if (res.status === 'success' && res.data) setData(res.data);
        else toast({ title: 'Error', description: res.message, variant: 'destructive' });
      })
      .catch(() => toast({ title: 'Connection error', description: 'Could not load your data.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── STK push polling ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (stkStatus !== 'pending' || !stkReferenceId) return;
    if (stkPollCount >= 22) { setStkStatus('failed'); return; }

    const timer = setTimeout(async () => {
      try {
        const res = await portalFetch<{ status: string }>(`/payments/mpesa/${stkReferenceId}/status`);
        if (res.status === 'success' && res.data) {
          const s = res.data.status;
          if (s === 'completed') { setStkStatus('success'); loadData(); return; }
          if (s === 'failed')    { setStkStatus('failed');  return; }
        }
      } catch { /* keep polling */ }
      setStkPollCount(c => c + 1);
    }, 4000);

    return () => clearTimeout(timer);
  }, [stkStatus, stkReferenceId, stkPollCount, loadData]);

  // ── Pay Now handlers ─────────────────────────────────────────────────────────
  function openPayDialog(m: Membership) {
    const analysis  = m.contribution_analysis;
    const prefill   = analysis && analysis.balance_due > 0
      ? analysis.balance_due
      : (analysis?.expected_amount ?? 0);
    setStkMembership(m);
    setStkAmount(prefill > 0 ? String(prefill) : '');
    setStkStatus('idle');
    setStkReferenceId('');
    setStkPollCount(0);
    setStkOpen(true);
  }

  async function handlePayNow() {
    if (!stkMembership) return;
    setStkStatus('loading');
    try {
      const res = await portalFetch<{ checkout_request_id: string; reference_id: string }>('/portal/pay', {
        method: 'POST',
        body: JSON.stringify({ chama_id: stkMembership.chama_id, amount: Number(stkAmount) }),
      });
      if (res.status === 'success' && res.data) {
        setStkReferenceId(res.data.reference_id);
        setStkStatus('pending');
        setStkPollCount(0);
      } else {
        throw new Error(res.message ?? 'Failed to initiate payment.');
      }
    } catch (err) {
      setStkStatus('failed');
      toast({
        title: 'STK Push Failed',
        description: err instanceof Error ? err.message : 'Something went wrong.',
        variant: 'destructive',
      });
    }
  }

  function closeStkDialog() {
    if (stkStatus === 'pending') return;
    setStkOpen(false);
    setStkMembership(null);
  }

  function handleLogout() {
    clearPortalSession();
    router.replace('/portal/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">Could not load your data.</p>
        <Button onClick={() => router.replace('/portal/login')}>Back to Login</Button>
      </div>
    );
  }

  const { profile, summary, memberships, contributions, loans, notifications } = data;
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">B</div>
            <span className="font-semibold text-sm">Member Portal</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">{unreadCount}</Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* ── Profile header ── */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-xl">{initials(profile.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  {profile.member_id && (
                    <span className="text-xs text-muted-foreground font-mono">{profile.member_id}</span>
                  )}
                  {profile.kyc_status && (
                    <Badge
                      variant="outline"
                      className={cn('text-xs', profile.kyc_status === 'approved' && 'border-green-700/40 text-green-400')}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      KYC {profile.kyc_status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{profile.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-md bg-primary/10 p-1.5"><Users className="h-4 w-4 text-primary" /></div>
              </div>
              <p className="text-2xl font-bold">{summary.chamas_count}</p>
              <p className="text-xs text-muted-foreground">Chama Circles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-md bg-green-900/40 p-1.5"><PiggyBank className="h-4 w-4 text-green-400" /></div>
              </div>
              <p className="text-2xl font-bold">KES {summary.total_saved.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Saved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-md bg-blue-900/40 p-1.5"><Wallet className="h-4 w-4 text-blue-400" /></div>
              </div>
              <p className="text-2xl font-bold">KES {summary.total_wallet_balance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Wallet Balance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-md bg-orange-900/40 p-1.5"><HandCoins className="h-4 w-4 text-orange-400" /></div>
              </div>
              <p className="text-2xl font-bold">{summary.active_loans_count}</p>
              <p className="text-xs text-muted-foreground">Active Loans</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Main content tabs ── */}
        <Tabs defaultValue="chamas">
          <TabsList className="w-full">
            <TabsTrigger value="chamas" className="flex-1">Chamas</TabsTrigger>
            <TabsTrigger value="contributions" className="flex-1">Contributions</TabsTrigger>
            <TabsTrigger value="loans" className="flex-1">Loans</TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 relative">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Chamas tab ── */}
          <TabsContent value="chamas" className="mt-4 space-y-3">
            {memberships.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-10 text-center gap-2">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">You are not a member of any Chama yet.</p>
                </CardContent>
              </Card>
            ) : (
              memberships.map(m => {
                const a = m.contribution_analysis;
                const hasRequirement = a && a.expected_amount > 0;
                const showPayButton  = hasRequirement && (
                  a.balance_due > 0 || ['overdue', 'partial', 'missing_payments'].includes(a.status)
                );

                const analysisColor = !hasRequirement
                  ? ''
                  : a.status === 'up_to_date' || a.status === 'advance'
                    ? 'bg-green-900/20 border-green-800/30'
                    : a.status === 'partial' || a.status === 'overdue'
                      ? 'bg-yellow-900/20 border-yellow-800/30'
                      : 'bg-red-900/20 border-red-800/30';

                return (
                  <Card key={m.chama_id}>
                    <CardContent className="pt-5 space-y-4">
                      {/* Chama header */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={m.chama_logo} />
                          <AvatarFallback className="text-xs">{initials(m.chama_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{m.chama_name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {m.pool_id && <span className="text-xs text-muted-foreground font-mono">{m.pool_id}</span>}
                            <Badge variant="outline" className="text-xs capitalize">{m.role}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* ── Contribution status panel ── */}
                      {hasRequirement && a && (
                        <div className={cn('rounded-lg border p-3 space-y-3', analysisColor)}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">Contribution Status</span>
                            {contributionStatusBadge(a.status)}
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Expected / period</p>
                              <p className="font-semibold">KES {a.expected_amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Paid this period</p>
                              <p className="font-semibold">KES {a.current_period_paid.toLocaleString()}</p>
                            </div>
                            {a.balance_due > 0 && (
                              <div className="col-span-2">
                                <p className="text-red-400">Balance Due</p>
                                <p className="font-bold text-red-300 text-sm">KES {a.balance_due.toLocaleString()}</p>
                              </div>
                            )}
                            {a.advance_balance > 0 && (
                              <div className="col-span-2">
                                <p className="text-emerald-400">Advance Credit</p>
                                <p className="font-bold text-emerald-300 text-sm">KES {a.advance_balance.toLocaleString()}</p>
                              </div>
                            )}
                            {a.periods_missed > 0 && (
                              <div className="col-span-2">
                                <p className="text-orange-400">
                                  {a.periods_missed} missed period{a.periods_missed > 1 ? 's' : ''}
                                  {a.days_overdue > 0 && ` · ${a.days_overdue}d overdue`}
                                </p>
                              </div>
                            )}
                            {a.last_paid_date && (
                              <div className="col-span-2">
                                <p className="text-muted-foreground">
                                  Last paid {a.last_paid_date}
                                  {a.last_paid_amount != null && ` · KES ${a.last_paid_amount.toLocaleString()}`}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Period: <span className="font-mono">{a.current_period}</span>
                            {' · '}{a.periods_paid}/{a.periods_expected} periods paid
                          </div>

                          {showPayButton && (
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => openPayDialog(m)}
                            >
                              <Smartphone className="mr-2 h-3.5 w-3.5" />
                              Pay Now via M-Pesa
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Stats row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">Total Saved</p>
                          <p className="font-semibold text-sm mt-0.5">KES {m.total_saved.toLocaleString()}</p>
                        </div>
                        {m.next_payout ? (
                          <div className="rounded-lg bg-green-900/20 border border-green-800/30 p-3">
                            <p className="text-xs text-green-400">Next Payout</p>
                            <p className="font-semibold text-sm text-green-300 mt-0.5">
                              KES {m.next_payout.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">{m.next_payout.scheduled_date}</p>
                          </div>
                        ) : (
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground">Next Payout</p>
                            <p className="text-sm text-muted-foreground mt-0.5">—</p>
                          </div>
                        )}
                      </div>

                      {/* Active loan */}
                      {m.active_loan && (
                        <div className="rounded-lg border bg-orange-900/10 border-orange-800/30 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-orange-300 flex items-center gap-1">
                              <CreditCard className="h-3.5 w-3.5" /> Active Loan
                            </p>
                            {statusBadge(m.active_loan.status)}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>KES {m.active_loan.amount.toLocaleString()}</span>
                            <span className="text-muted-foreground">
                              Paid: KES {m.active_loan.amount_paid.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={(m.active_loan.amount_paid / m.active_loan.amount) * 100}
                            className="h-1.5"
                          />
                          {m.active_loan.next_payment_date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Next payment: {m.active_loan.next_payment_date}
                            </p>
                          )}
                        </div>
                      )}

                      {m.joined_at && (
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(m.joined_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* ── Contributions tab ── */}
          <TabsContent value="contributions" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Contribution History</CardTitle>
                <CardDescription>Your last 20 contributions across all Chamas.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {contributions.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center gap-2">
                    <PiggyBank className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No contribution records yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Chama</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="hidden md:table-cell">Method</TableHead>
                          <TableHead className="hidden sm:table-cell">Date</TableHead>
                          <TableHead className="text-right hidden sm:table-cell">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contributions.map(c => (
                          <TableRow key={c.id}>
                            <TableCell className="font-mono text-xs">{c.period}</TableCell>
                            <TableCell className="text-xs text-muted-foreground truncate max-w-[90px]">
                              {c.chama_name ?? '—'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-sm">
                              KES {c.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                              {paymentMethodLabel(c.payment_method)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                              {c.paid_at
                                ? new Date(c.paid_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })
                                : '—'}
                            </TableCell>
                            <TableCell className="text-right hidden sm:table-cell">
                              {statusBadge(c.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Loans tab ── */}
          <TabsContent value="loans" className="mt-4 space-y-3">
            {loans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-10 text-center gap-2">
                  <HandCoins className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No loan records found.</p>
                </CardContent>
              </Card>
            ) : (
              loans.map(loan => {
                const pct = loan.amount > 0 ? Math.min((loan.amount_paid / loan.amount) * 100, 100) : 0;
                return (
                  <Card key={loan.id}>
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">KES {loan.amount.toLocaleString()}</p>
                          {loan.chama_name && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />{loan.chama_name}
                            </p>
                          )}
                        </div>
                        {statusBadge(loan.status)}
                      </div>

                      {loan.purpose && (
                        <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                      )}

                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Repaid: KES {loan.amount_paid.toLocaleString()}</span>
                          <span>{pct.toFixed(0)}%</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {loan.interest_rate != null && (
                          <span>{loan.interest_rate}% interest</span>
                        )}
                        {loan.repayment_period && (
                          <span>{loan.repayment_period} months</span>
                        )}
                        {loan.next_payment_date && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Next: {loan.next_payment_date}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* ── Notifications tab ── */}
          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="divide-y p-0">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center gap-2">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={cn('flex items-start gap-3 px-5 py-4', !n.is_read && 'bg-primary/5')}
                    >
                      <div className={cn(
                        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                        n.is_read ? 'bg-muted' : 'bg-primary/20',
                      )}>
                        {n.is_read
                          ? <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                          : <BellDot className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium', !n.is_read && 'text-foreground')}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {new Date(n.created_at).toLocaleDateString('en-KE', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Pay Now (STK Push) Dialog ── */}
      <Dialog open={stkOpen} onOpenChange={(open) => { if (!open) closeStkDialog(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {stkMembership ? `Pay — ${stkMembership.chama_name}` : 'Pay Now'}
            </DialogTitle>
          </DialogHeader>

          {(stkStatus === 'idle' || stkStatus === 'loading') && (
            <>
              <div className="space-y-4">
                {stkMembership?.contribution_analysis && (
                  <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Period</span>
                      <span className="font-mono">{stkMembership.contribution_analysis.current_period}</span>
                    </div>
                    {stkMembership.contribution_analysis.balance_due > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Balance due</span>
                        <span className="text-red-400 font-medium">KES {stkMembership.contribution_analysis.balance_due.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="stk-amount">Amount (KES)</Label>
                  <Input
                    id="stk-amount"
                    type="number"
                    min={1}
                    value={stkAmount}
                    onChange={e => setStkAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>M-Pesa Phone</Label>
                  <Input value={data?.profile.phone ?? ''} readOnly className="text-muted-foreground bg-muted/50" />
                  <p className="text-xs text-muted-foreground">STK push will be sent to your registered number.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeStkDialog} disabled={stkStatus === 'loading'}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePayNow}
                  disabled={stkStatus === 'loading' || !stkAmount || Number(stkAmount) <= 0}
                >
                  {stkStatus === 'loading' ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                  ) : (
                    <><Smartphone className="mr-2 h-4 w-4" />Send STK Push</>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {stkStatus === 'pending' && (
            <div className="flex flex-col items-center py-8 gap-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div>
                <p className="font-semibold">Waiting for M-Pesa...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Check your phone and enter your M-Pesa PIN to complete the payment.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">This will time out in ~90 seconds.</p>
            </div>
          )}

          {stkStatus === 'success' && (
            <div className="flex flex-col items-center py-8 gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div>
                <p className="font-semibold text-green-400">Payment Confirmed!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your contribution of KES {Number(stkAmount).toLocaleString()} has been recorded.
                </p>
              </div>
              <Button onClick={closeStkDialog}>Close</Button>
            </div>
          )}

          {stkStatus === 'failed' && (
            <div className="flex flex-col items-center py-8 gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <p className="font-semibold">Payment Failed or Timed Out</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The payment was not confirmed. Please try again.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStkStatus('idle')}>Try Again</Button>
                <Button variant="ghost" onClick={closeStkDialog}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
