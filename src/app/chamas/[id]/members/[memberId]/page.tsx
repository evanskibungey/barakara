// @ts-nocheck
'use client';

import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase, Building, Calendar, DollarSign, MapPin, Phone, TrendingUp, BarChart2,
  ArrowDownLeft, ArrowUpRight, Clock, Users, Award, QrCode, Download, Printer, FileText,
  LineChart as LineChartIcon, Wallet, AlertTriangle, Info, PlusCircle, HandCoins,
  UserPlus, Percent, HelpCircle, MoreHorizontal, FileSignature, X, Plus, Edit,
  Settings, Loader2, CheckCircle, XCircle, UserCheck, Shield,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, addMonths } from 'date-fns';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts';
import { LineChart as LineChartComponent } from 'recharts';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/hooks/use-role';
import Link from 'next/link';

export default function MemberProfilePage() {
  const params = useParams();
  const chamaId = params.id as string;
  const memberId = params.memberId as string;
  const { toast } = useToast();
  const { role } = useRole();

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Loan request state
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanMethod, setLoanMethod] = useState('amortized');
  const [selectedGuarantors, setSelectedGuarantors] = React.useState<any[]>([]);
  const [openGuarantorPopover, setOpenGuarantorPopover] = React.useState(false);
  const [submittingLoan, setSubmittingLoan] = useState(false);

  // Wallet state
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTarget, setWalletTarget] = useState(5000);

  // Amortization
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any>(`/chamas/${chamaId}/members/${memberId}`)
      .then(res => {
        if (res.status === 'success' && res.data) {
          setProfile(res.data);
          setWalletBalance(res.data.wallet?.balance ?? 0);
          setWalletTarget(res.data.wallet?.target ?? 5000);
        } else {
          setLoadError(res.message ?? 'Member not found in this chama.');
        }
      })
      .catch(() => setLoadError('Could not connect to the server.'))
      .finally(() => setIsLoading(false));
  }, [chamaId, memberId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-6">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <CardTitle>Member Not Found</CardTitle>
            <CardDescription>
              {loadError ?? 'This member could not be loaded.'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link href={`/chamas/${chamaId}`}>Back to Chama</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { member, membership, chama, stats, contribution_chart, contributions,
    loans, guarantor_requests, penalties, management_info, other_members } = profile;

  const showManagementOptions = role === 'admin' || role === 'chairperson' || role === 'secretary';

  const revolvingFundProgress = walletTarget > 0 ? (walletBalance / walletTarget) * 100 : 0;
  const isFundLow = walletBalance < walletTarget * 0.5;

  const borrowingLimit = stats.borrowing_limit ?? 0;

  const activeLoans = (loans || []).filter((l: any) => l.status === 'Active' || l.status === 'Pending');
  const totalOwed = activeLoans.reduce((s: number, l: any) => s + (l.amount - (l.amount_paid ?? 0)), 0);

  const unpaidPenalties = (penalties || []).filter((p: any) => p.status === 'Unpaid');

  // ── Helpers ────────────────────────────────────────────────────────────────

  const formatAmount = (amount: number) => {
    const f = `KES ${Math.abs(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;
    return amount >= 0 ? `+ ${f}` : `- ${f}`;
  };

  const getLoanStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':   return <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">{status}</Badge>;
      case 'Pending':  return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">{status}</Badge>;
      case 'Paid':     return <Badge variant="secondary" className="bg-green-900/50 text-green-300">{status}</Badge>;
      case 'Rejected': return <Badge variant="destructive">{status}</Badge>;
      case 'Overdue':  return <Badge variant="destructive">{status}</Badge>;
      default:         return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContribStatusBadge = (status: string) => {
    if (!status) return null;
    const isGood = status === 'good_standing' || status === 'Good Standing';
    return isGood
      ? <Badge variant="secondary" className="bg-green-900/50 text-green-300">Good Standing</Badge>
      : <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">Needs Attention</Badge>;
  };

  const getPenaltyBadge = (status: string) => {
    switch (status) {
      case 'Paid':   return <Badge variant="secondary" className="bg-green-900/50 text-green-300">Paid</Badge>;
      case 'Unpaid': return <Badge variant="destructive">Unpaid</Badge>;
      case 'Waived': return <Badge variant="outline">Waived</Badge>;
      default:       return <Badge variant="outline">{status}</Badge>;
    }
  };

  const generateAmortization = (loan: any) => {
    const principal = loan.amount - (loan.amount_paid || 0);
    const nPayments = loan.repayment_period - (loan.payments_made || 0);
    if (nPayments <= 0) { setAmortizationSchedule([]); return; }

    const start = loan.next_payment_date ? new Date(loan.next_payment_date) : new Date();
    let bal = principal;
    const schedule: any[] = [];

    if (loan.interest_method === 'flat_rate' || loan.interest_method === 'Flat Rate') {
      const totalInterest = (loan.amount * (loan.interest_rate / 100) * loan.repayment_period) / 12;
      const monthly = (loan.amount + totalInterest) / loan.repayment_period;
      const pPrincipal = loan.amount / loan.repayment_period;
      const pInterest = totalInterest / loan.repayment_period;
      for (let i = 1; i <= nPayments; i++) {
        bal -= pPrincipal;
        schedule.push({ paymentNumber: (loan.payments_made || 0) + i, dueDate: format(addMonths(start, i - 1), 'dd MMM, yyyy'), payment: monthly, principal: pPrincipal, interest: pInterest, balance: Math.max(bal, 0) });
      }
    } else {
      const r = loan.interest_rate / 100 / 12;
      const monthly = (principal * r) / (1 - Math.pow(1 + r, -nPayments));
      for (let i = 1; i <= nPayments; i++) {
        const intPmt = bal * r;
        const prPmt = monthly - intPmt;
        bal -= prPmt;
        schedule.push({ paymentNumber: (loan.payments_made || 0) + i, dueDate: format(addMonths(start, i - 1), 'dd MMM, yyyy'), payment: monthly, principal: prPmt, interest: intPmt, balance: Math.max(bal, 0) });
      }
    }
    setAmortizationSchedule(schedule);
  };

  // ── Loan request submit ────────────────────────────────────────────────────
  const handleLoanRequest = async () => {
    if (!loanAmount || !loanPeriod || !loanPurpose) {
      toast({ title: 'Missing fields', description: 'Please fill in all required loan fields.', variant: 'destructive' });
      return;
    }
    setSubmittingLoan(true);
    try {
      const res = await apiFetch(`/chamas/${chamaId}/loans`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(loanAmount),
          repayment_period: Number(loanPeriod),
          purpose: loanPurpose,
          interest_method: loanMethod,
          guarantor_ids: selectedGuarantors.map(g => g.id),
        }),
      });
      if (res.status === 'success' || res.status === 'created') {
        toast({ title: 'Loan Request Submitted', description: 'Your request has been sent to management for approval.' });
        setLoanAmount(''); setLoanPeriod(''); setLoanPurpose('');
        setSelectedGuarantors([]);
      } else {
        throw new Error(res.message ?? 'Failed');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmittingLoan(false);
    }
  };

  const handleSignGuarantor = async (loanId: number) => {
    try {
      await apiFetch(`/chamas/${chamaId}/loans/${loanId}/guarantors/sign`, { method: 'PUT' });
      toast({ title: 'Signed as Guarantor', description: 'Your digital signature has been recorded.' });
      // refresh
      const res = await apiFetch<any>(`/chamas/${chamaId}/members/${memberId}`);
      if (res.status === 'success' && res.data) setProfile(res.data);
    } catch {
      toast({ title: 'Error signing as guarantor', variant: 'destructive' });
    }
  };

  const handleTopUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = Number(new FormData(e.currentTarget).get('topup-amount'));
    if (amount > 0) {
      toast({ title: 'STK Push Sent', description: 'Complete the transaction on your phone.' });
      setWalletBalance(prev => prev + amount);
    }
  };

  const handleUpdateTarget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = Number(new FormData(e.currentTarget).get('new-target'));
    if (target > 0) {
      setWalletTarget(target);
      toast({ title: 'Target Updated', description: `Welfare fund target is now KES ${target.toLocaleString()}.` });
    }
  };

  const initials = member.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() ?? '?';

  // ── Statement summary ──────────────────────────────────────────────────────
  const totalContributed = (contributions || []).filter((c: any) => c.status === 'paid').reduce((s: number, c: any) => s + c.amount, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={member.avatar_url} alt={member.name} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline text-3xl font-bold tracking-tight">{member.name}</h1>
              {getContribStatusBadge(membership.contribution_status)}
            </div>
            <p className="text-muted-foreground">{membership.role} · <Link href={`/chamas/${chamaId}`} className="hover:underline">{chama.name}</Link></p>
            {member.member_id && <p className="text-xs text-muted-foreground font-mono mt-0.5">{member.member_id}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Loan Request Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><HandCoins className="mr-2 h-4 w-4" /> Request Loan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Request a Loan</DialogTitle>
                <DialogDescription>Submit a loan application to {chama.name}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertTitle>Your Borrowing Limit</AlertTitle>
                  <AlertDescription>
                    Based on your savings, your maximum loan eligibility is{' '}
                    <strong className="text-primary">KES {borrowingLimit.toLocaleString()}</strong>.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loan Amount (KES)</Label>
                    <Input type="number" placeholder="e.g. 20000" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Repayment Period (Months)</Label>
                    <Input type="number" placeholder="e.g. 12" value={loanPeriod} onChange={e => setLoanPeriod(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Interest Method</Label>
                  <Select value={loanMethod} onValueChange={setLoanMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amortized">Amortized (Reducing Balance)</SelectItem>
                      <SelectItem value="flat_rate">Flat Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Purpose of Loan</Label>
                  <Textarea placeholder="e.g. School fees, Business expansion" value={loanPurpose} onChange={e => setLoanPurpose(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Guarantors (Select 2)</Label>
                  <Popover open={openGuarantorPopover} onOpenChange={setOpenGuarantorPopover}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="truncate">
                          {selectedGuarantors.length > 0 ? selectedGuarantors.map(g => g.name).join(', ') : 'Select guarantors...'}
                        </span>
                        <UserPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search members..." />
                        <CommandEmpty>No member found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {(other_members || []).map((g: any) => (
                              <CommandItem key={g.id} onSelect={() => {
                                setSelectedGuarantors(prev =>
                                  prev.some(x => x.id === g.id) ? prev.filter(x => x.id !== g.id) : [...prev, g]
                                );
                              }} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={g.avatarUrl} />
                                    <AvatarFallback>{g.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{g.name}</span>
                                </div>
                                {selectedGuarantors.some(x => x.id === g.id) && <UserCheck className="h-4 w-4 text-primary" />}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleLoanRequest} disabled={submittingLoan}>
                  {submittingLoan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Statement Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Generate Statement</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 h-[90vh]">
              <ScrollArea className="h-full">
                <div className="p-8">
                  <div className="p-6 border rounded-lg bg-background">
                    <div className="flex items-start justify-between pb-4 border-b">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={chama.logo_url} alt={chama.name} />
                          <AvatarFallback>{chama.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold">{chama.name}</h4>
                          <p className="text-sm text-muted-foreground">{chama.address ?? '—'}</p>
                          <p className="text-xs text-muted-foreground font-mono">Pool: #{chama.pool_id}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>Generated: {format(new Date(), 'dd MMM yyyy')}</p>
                      </div>
                    </div>

                    <div className="my-4">
                      <h3 className="text-xl font-bold">Member Statement: {member.name}</h3>
                      <p className="text-sm text-muted-foreground">As of {format(new Date(), 'dd MMMM yyyy')}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 my-6">
                      <Card><CardHeader className="pb-2"><CardDescription>Total Contributed</CardDescription><CardTitle className="text-2xl text-green-400">KES {totalContributed.toLocaleString()}</CardTitle></CardHeader></Card>
                      <Card><CardHeader className="pb-2"><CardDescription>Outstanding Loans</CardDescription><CardTitle className="text-2xl text-red-400">KES {totalOwed.toLocaleString()}</CardTitle></CardHeader></Card>
                      <Card><CardHeader className="pb-2"><CardDescription>Unpaid Penalties</CardDescription><CardTitle className="text-2xl text-yellow-400">KES {unpaidPenalties.reduce((s: number, p: any) => s + p.amount, 0).toLocaleString()}</CardTitle></CardHeader></Card>
                    </div>

                    <h4 className="font-semibold mb-2">Contribution History</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Paid At</TableHead>
                          <TableHead>Ref</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(contributions || []).map((c: any) => (
                          <TableRow key={c.id}>
                            <TableCell>{c.period}</TableCell>
                            <TableCell>KES {c.amount?.toLocaleString()}</TableCell>
                            <TableCell>{c.status}</TableCell>
                            <TableCell>{c.paid_at ? format(new Date(c.paid_at), 'dd MMM yyyy') : '—'}</TableCell>
                            <TableCell className="font-mono text-xs">{c.reference_id ?? '—'}</TableCell>
                          </TableRow>
                        ))}
                        {(!contributions || contributions.length === 0) && (
                          <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No contributions recorded.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>

                    <div className="grid grid-cols-2 gap-8 pt-10 mt-8 text-center border-t">
                      <div>
                        <p className="border-b-2 pb-2 mb-2 border-muted-foreground/50">Chairperson</p>
                        <p className="text-xs text-muted-foreground">Chairperson's Signature</p>
                      </div>
                      <div className="flex flex-col items-center justify-end">
                        <QrCode className="h-16 w-16 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground mt-1 font-mono">STMT-{String(member.id).substring(0, 4).toUpperCase()}-{Date.now()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="sm:justify-end gap-2 p-4 border-t">
                <DialogClose asChild><Button variant="secondary">Close</Button></DialogClose>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saved (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {(stats.ytd_saved ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">in this Chama this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contribution Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contribution_streak ?? 0} <span className="text-base text-muted-foreground">months</span></div>
            <p className="text-xs text-muted-foreground">consecutive on-time payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Loans</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalOwed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{activeLoans.length} active loan{activeLoans.length !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.next_payout ? `KES ${stats.next_payout.amount?.toLocaleString()}` : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.next_payout ? format(new Date(stats.next_payout.scheduled_date), 'dd MMM yyyy') : 'No payout scheduled'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* ── Member Details ─────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
              <CardDescription>Comprehensive information about {member.name}.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Phone, label: 'Contact Number', value: member.phone },
                { icon: MapPin, label: 'Location', value: member.location },
                { icon: Briefcase, label: 'Occupation', value: member.occupation },
                { icon: Calendar, label: 'Joined', value: membership.joined_at ? format(new Date(membership.joined_at), 'dd MMM yyyy') : '—' },
                { icon: Clock, label: 'Next Payout', value: stats.next_payout ? format(new Date(stats.next_payout.scheduled_date), 'dd MMM yyyy') : 'Not scheduled' },
                { icon: Shield, label: 'KYC Status', value: member.kyc_status ?? 'Pending' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Icon className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-semibold">{value ?? '—'}</p>
                  </div>
                </div>
              ))}
              {management_info && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg md:col-span-2">
                  <Award className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Management Role</p>
                    <p className="font-semibold">{management_info.role}{management_info.allowance ? ` · Allowance: KES ${management_info.allowance.toLocaleString()}` : ''}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Contribution Chart ─────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LineChartIcon /> Contribution Performance</CardTitle>
              <CardDescription>Monthly contributions for the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={contribution_chart || []} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Contributed']}
                  />
                  <Bar dataKey="amount" name="Contribution" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ── Contribution History Table ─────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>All recorded contributions for this member.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Paid At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(contributions || []).map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono">{c.period}</TableCell>
                      <TableCell>KES {c.amount?.toLocaleString()}</TableCell>
                      <TableCell>
                        {c.status === 'paid'
                          ? <Badge variant="secondary" className="bg-green-900/50 text-green-300">Paid</Badge>
                          : c.status === 'overdue'
                          ? <Badge variant="destructive">Overdue</Badge>
                          : <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">Pending</Badge>
                        }
                      </TableCell>
                      <TableCell className="capitalize">{c.payment_method ?? '—'}</TableCell>
                      <TableCell>{c.paid_at ? format(new Date(c.paid_at), 'dd MMM yyyy') : '—'}</TableCell>
                    </TableRow>
                  ))}
                  {(!contributions || contributions.length === 0) && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No contributions yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── Loans ─────────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HandCoins /> Loans</CardTitle>
              <CardDescription>All loan applications and their repayment status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(loans || []).length === 0 && (
                <p className="text-center text-muted-foreground py-6">No loans found for this member.</p>
              )}
              {(loans || []).map((loan: any) => (
                <Dialog key={loan.id} onOpenChange={(open) => { if (open) generateAmortization(loan); }}>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">KES {loan.amount?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{loan.purpose ?? 'No purpose stated'}</p>
                      </div>
                      <div className="text-right space-y-1">
                        {getLoanStatusBadge(loan.status)}
                        <p className="text-xs text-muted-foreground">{loan.interest_rate}% · {loan.interest_method}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div><p className="text-muted-foreground text-xs">Amount Paid</p><p className="font-medium">KES {(loan.amount_paid ?? 0).toLocaleString()}</p></div>
                      <div><p className="text-muted-foreground text-xs">Remaining</p><p className="font-medium">KES {(loan.amount - (loan.amount_paid ?? 0)).toLocaleString()}</p></div>
                      <div><p className="text-muted-foreground text-xs">Next Payment</p><p className="font-medium">{loan.next_payment_date ? format(new Date(loan.next_payment_date), 'dd MMM yyyy') : '—'}</p></div>
                    </div>
                    {loan.amount > 0 && (
                      <Progress value={((loan.amount_paid ?? 0) / loan.amount) * 100} className="h-2" />
                    )}
                    <div className="flex gap-2">
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">View Schedule</Button>
                      </DialogTrigger>
                    </div>
                  </div>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Amortization Schedule — Loan #{loan.id}</DialogTitle>
                      <DialogDescription>KES {loan.amount?.toLocaleString()} · {loan.repayment_period} months · {loan.interest_rate}% p.a.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Payment</TableHead>
                            <TableHead className="text-right">Principal</TableHead>
                            <TableHead className="text-right">Interest</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {amortizationSchedule.map(row => (
                            <TableRow key={row.paymentNumber}>
                              <TableCell>{row.paymentNumber}</TableCell>
                              <TableCell>{row.dueDate}</TableCell>
                              <TableCell className="text-right">KES {row.payment.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                              <TableCell className="text-right">KES {row.principal.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                              <TableCell className="text-right">KES {row.interest.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                              <TableCell className="text-right">KES {row.balance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            </TableRow>
                          ))}
                          {amortizationSchedule.length === 0 && (
                            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-4">Loan fully paid.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                    <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </CardContent>
          </Card>

          {/* ── Guarantor Requests ─────────────────────────────────────── */}
          {(guarantor_requests || []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature />
                  Guarantor Requests
                  <Badge variant="destructive">{guarantor_requests.length}</Badge>
                </CardTitle>
                <CardDescription>Members asking you to guarantee their loan applications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {guarantor_requests.map((req: any) => (
                  <div key={req.loan_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={req.borrower?.avatar_url} />
                        <AvatarFallback>{req.borrower?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{req.borrower?.name}</p>
                        <p className="text-xs text-muted-foreground">KES {req.amount?.toLocaleString()} · {req.purpose}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSignGuarantor(req.loan_id)}>
                      <FileSignature className="mr-2 h-4 w-4" /> Sign as Guarantor
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Penalties ─────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Penalties & Fines</CardTitle>
              <CardDescription>All issued penalties for this member.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reason</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(penalties || []).map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.reason}</TableCell>
                      <TableCell>KES {p.amount?.toLocaleString()}</TableCell>
                      <TableCell>{getPenaltyBadge(p.status)}</TableCell>
                      <TableCell>{p.issued_at ? format(new Date(p.issued_at), 'dd MMM yyyy') : '—'}</TableCell>
                    </TableRow>
                  ))}
                  {(!penalties || penalties.length === 0) && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No penalties issued.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Revolving Welfare Fund */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Welfare Fund</CardTitle>
                  <CardDescription>Personal welfare wallet</CardDescription>
                </div>
                <Badge variant={isFundLow ? 'destructive' : 'secondary'} className={cn(!isFundLow && 'bg-green-900/50 text-green-300')}>
                  {isFundLow ? 'Low' : 'Healthy'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFundLow && (
                <Alert variant="destructive" className="bg-yellow-900/50 border-yellow-700 text-yellow-300 py-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-300" />
                  <AlertTitle className="text-yellow-200 text-sm">Refill Required</AlertTitle>
                </Alert>
              )}
              <div className="text-center p-4 bg-muted/50 rounded-xl border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                <p className="text-3xl font-bold text-primary">KES {walletBalance.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target</span>
                  <span className="font-medium">KES {walletTarget.toLocaleString()}</span>
                </div>
                <Progress value={revolvingFundProgress} className="h-2" />
                <p className="text-right text-xs text-muted-foreground">{revolvingFundProgress.toFixed(0)}%</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1" size="sm"><PlusCircle className="mr-2 h-3 w-3" />Top Up</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Wallet Top Up</DialogTitle></DialogHeader>
                    <form onSubmit={handleTopUp}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Amount (KES)</Label><Input name="topup-amount" type="number" placeholder="500" required /></div>
                        <div className="space-y-2"><Label>M-Pesa Number</Label><Input defaultValue={member.phone} /></div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <DialogClose asChild><Button type="submit">Initiate Payment</Button></DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Wallet Settings</DialogTitle></DialogHeader>
                    <form onSubmit={handleUpdateTarget}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Target Amount (KES)</Label><Input name="new-target" type="number" defaultValue={walletTarget} required /></div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <DialogClose asChild><Button type="submit">Update Target</Button></DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Total Ever Contributed', value: `KES ${(stats.total_saved ?? 0).toLocaleString()}` },
                { label: 'YTD Contributions', value: `KES ${(stats.ytd_saved ?? 0).toLocaleString()}` },
                { label: 'Borrowing Limit', value: `KES ${borrowingLimit.toLocaleString()}` },
                { label: 'Unpaid Penalties', value: `KES ${unpaidPenalties.reduce((s: number, p: any) => s + p.amount, 0).toLocaleString()}` },
                { label: 'Membership Status', value: membership.status ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Management actions (admin only) */}
          {showManagementOptions && (
            <Card>
              <CardHeader><CardTitle>Management Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Award className="mr-2 h-4 w-4" /> Assign Award
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Issue Penalty
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <UserCheck className="mr-2 h-4 w-4" /> Change Role
                </Button>
                <Button variant="destructive" className="w-full justify-start" size="sm">
                  <XCircle className="mr-2 h-4 w-4" /> Remove from Chama
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
