// @ts-nocheck
'use client';

import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, DollarSign, Calendar, Plus, MoreHorizontal, Check, X, ShieldCheck, Target, AlertTriangle, GanttChartSquare, Store, AlertOctagon, LineChart as LineChartIcon, Vote, Edit, Trash2, Pencil, Share2, Clipboard, UploadCloud, Banknote, Landmark, Bell, CircleUserRound, Award, MessageSquare, Smartphone, BarChart, Heart, Gift, HelpCircle, XCircle, Mail, FileText, Download, Printer, QrCode, Speaker, UserCheck, UserX, UserPlus, Eye, PauseCircle, ArrowUpCircle, RefreshCw, CircleDot, Upload, CheckCircle, HandCoins, Search as SearchIcon, MapPin, Activity, Settings, Phone, Wallet, FileSignature, Percent, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRole } from "@/hooks/use-role";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";
import { format, addMonths, addDays, differenceInDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from '@/components/ui/switch';
import {
  LineChart,
  Line,
  BarChart as BarChartComponent,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Bar,
} from 'recharts';
import Image from "next/image";
import { MemberUploader } from '@/components/member-uploader';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { OnboardingForm } from '@/components/onboarding-form';

// Placeholder arrays (replaced by API data)
const documents: any[] = [];
const financialReportData: any[] = [];
const memberBusinesses: any[] = [];

// A simple SVG icon component for X/Twitter
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>X</title>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
 );

// A simple SVG icon component for Facebook
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        role="img"
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <title>Facebook</title>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
 )

function EventDate({ date }: { date: string }) {
    // This component now directly returns the formatted string,
    // and we'll use suppressHydrationWarning on the parent element.
    return new Date(date).toLocaleString('en-KE', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });
}

type ProcessedEvent = {
  id: string;
  title: string;
  type: 'Meeting' | 'Payout' | 'Deadline';
  date: Date;
  chama: string;
  location?: string;
  amount?: number;
};


export default function ChamaDetailPage() {
  const params = useParams();
  const [chama, setChama] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [chamaLoading, setChamaLoading] = useState(true);
  const [chamaError, setChamaError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<any>(`/chamas/${params.id}`).then((res) => {
      if (res.status === 'success' && res.data) {
        const d = res.data.chama ?? res.data;
        const stats = res.data.stats ?? {};
        setChama({
          id: String(d.id),
          name: d.name,
          description: d.description,
          poolId: d.pool_id,
          registrationNumber: d.registration_number,
          manager: d.manager?.name ?? '',
          memberCount: d.chama_members?.length ?? 0,
          membershipFee: d.membership_fee ?? 0,
          membershipTarget: d.membership_target ?? 0,
          contributionFrequency: d.contribution_frequency ?? 'monthly',
          branding: { logoUrl: d.logo_url, address: d.address },
          stats: {
            totalPoolValue: stats.pool_value ?? 0,
            poolValueChange: 0,
            nextPayout: stats.next_payout
              ? { date: stats.next_payout.scheduled_date, recipient: stats.next_payout.recipient }
              : { date: '—', recipient: '—' },
            outstandingLoans: { amount: stats.outstanding_loans ?? 0, count: 0 },
            monthlyContribution: { amount: stats.monthly_contributions ?? 0, latePayments: 0 },
          },
          loans: (d.loans ?? []).map((l: any) => ({
            id: String(l.id),
            amount: l.amount,
            interestRate: l.interest_rate,
            interestMethod: l.interest_method === 'flat_rate' ? 'Flat Rate' : 'Amortized',
            status: l.status ? (l.status.charAt(0).toUpperCase() + l.status.slice(1)) : 'Pending',
            purpose: l.purpose,
            repaymentPeriod: l.repayment_period,
            amountPaid: l.amount_paid ?? 0,
            paymentsMade: l.payments_made ?? 0,
            nextPaymentDate: l.next_payment_date,
            applicationDate: l.application_date,
            member: l.member,
            guarantors: (l.guarantors ?? []).map((g: any) => ({
              memberId: String(g.memberId),
              status: g.status,
              name: g.guarantor?.name,
            })),
          })),
          welfareDrives: d.welfare_drives ?? [],
          fundingGoal: { target: 0, collected: 0, deadline: '' },
          managementTeam: (d.chama_members ?? []).filter((m: any) => ['Chairperson','Secretary','Treasurer'].includes(m.role)),
          pendingApprovals: [],
          expenses: d.expenses ?? [],
          penalties: (d.penalties ?? []).map((p: any) => ({
            id: p.id,
            reason: p.reason,
            amount: p.amount,
            status: p.status,
            memberId: p.member?.id,
            memberName: p.member?.name,
          })),
          fineCriteria: d.fine_rules ?? {},
          payoutSchedule: (d.payout_schedules ?? []).map((p: any) => ({
            id: p.id,
            date: p.scheduled_date,
            recipient: p.recipient?.name ?? '—',
            amount: p.amount,
            status: p.status,
          })),
          members: (d.chama_members ?? []).map((m: any) => ({
            id: String(m.user_id),
            name: m.user?.name ?? '—',
            role: m.role,
            status: m.contribution_status === 'good_standing' ? 'Paid' : 'Overdue',
            avatarUrl: m.user?.avatar_url,
            phone: m.user?.phone,
            location: m.user?.location,
            occupation: m.user?.occupation,
            joiningDate: m.joined_at,
            contributionStatus: m.contribution_status === 'good_standing' ? 'Good Standing' : 'Needs Attention',
            savedYtd: 0,
            nextPayout: '—',
          })),
          activityStream: [],
          memberRequests: (d.member_requests ?? []).map((r: any) => ({
            id: r.id,
            name: r.applicant_name ?? '—',
            email: r.applicant_email ?? '',
            phone: r.applicant_phone ?? '',
            avatarUrl: r.avatar_url ?? null,
            applicationDate: r.created_at ? new Date(r.created_at).toLocaleDateString('en-KE') : '—',
            isGuest: r.is_guest,
            status: r.status,
          })),
          meetings: (d.meetings ?? []).map((m: any) => ({
            id: m.id,
            scheduledAt: m.scheduled_at,
            agenda: m.agenda,
            location: m.location,
            status: m.status,
          })),
          polls: (d.polls ?? []).map((p: any) => ({
            id: String(p.id),
            title: p.title,
            type: p.type,
            status: p.status,
            startDate: p.start_date,
            endDate: p.end_date,
            voters: [],
            options: (p.options ?? p.poll_options ?? []).map((o: any) => ({ name: o.label, votes: o.votes })),
          })),
        });
      } else {
        setChamaError(res.message ?? 'Chama not found.');
      }
    })
    .catch(() => setChamaError('Could not connect to the server.'))
    .finally(() => setChamaLoading(false));
  }, [params.id]);

  // Load per-member contribution analysis whenever the chama id changes
  useEffect(() => {
    if (!params.id) return;
    apiFetch<any>(`/chamas/${params.id}/contributions/member-statuses`)
      .then((res) => {
        if (res.status === 'success' && res.data?.member_statuses) {
          setMemberStatuses(res.data.member_statuses);
        }
      })
      .catch(() => { /* non-critical — silently ignore */ });
  }, [params.id]);

  // ── All hooks must be declared before any conditional returns ──────────────
  const { role } = useRole();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingChamaName, setEditingChamaName] = useState('');
  const [editingChamaDescription, setEditingChamaDescription] = useState('');
  const [onboardingLink, setOnboardingLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');

  // ── Member contribution statuses (loaded separately) ───────────────────────
  const [memberStatuses, setMemberStatuses] = useState<Record<string, any>>({});

  // ── Deposit dialog state ────────────────────────────────────────────────────
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositMemberId, setDepositMemberId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPeriod, setDepositPeriod] = useState('');
  const [depositMethod, setDepositMethod] = useState('mpesa');
  const [depositMpesaMode, setDepositMpesaMode] = useState<'manual' | 'stk'>('stk');
  const [depositSubmitting, setDepositSubmitting] = useState(false);
  const [depositStkRef, setDepositStkRef] = useState<string | null>(null);
  const [depositStkStatus, setDepositStkStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const depositPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activePoll, setActivePoll] = useState<any>(null);
  const [pollTitle, setPollTitle] = useState('');
  const [pollEndDate, setPollEndDate] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [selectedVote, setSelectedVote] = useState('');
  const [contributionMade, setContributionMade] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);
  const [chamaUpcomingEvents, setChamaUpcomingEvents] = useState<any[]>([]);

  const eventTitleRef = useRef<HTMLInputElement>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const eventDateRef = useRef<HTMLInputElement>(null);
  const eventDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const [countdown, setCountdown] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  const [reportDate, setReportDate] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 1),
    to: new Date(2023, 9, 31),
  });
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('All');

  const reportTransactionTypes = useMemo(
    () => ['All', 'Chama Contribution', 'Operating Expense', 'Loan Repayment', 'Dividend', 'Penalty', 'Welfare'],
    []
  );

  const filteredReportData = useMemo(() => {
    return financialReportData.filter(item => {
      const itemDate = new Date(item.date);
      const fromDate = reportDate?.from;
      const toDate   = reportDate?.to;
      const dateMatch   = fromDate && toDate ? (itemDate >= fromDate && itemDate <= toDate) : true;
      const searchMatch = reportSearchTerm ? item.description.toLowerCase().includes(reportSearchTerm.toLowerCase()) : true;
      const typeMatch   = reportTypeFilter !== 'All' ? item.category === reportTypeFilter : true;
      return dateMatch && searchMatch && typeMatch;
    });
  }, [reportDate, reportSearchTerm, reportTypeFilter]);

  const reportSummary = useMemo(() => {
    const totalIncome  = filteredReportData.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = filteredReportData.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
    return { totalIncome, totalExpense };
  }, [filteredReportData]);

  const penaltiesSummary = useMemo(() => {
    const penalties = chama?.penalties || [];
    const totalIssued      = penalties.reduce((sum, p) => sum + p.amount, 0);
    const totalOutstanding = penalties.filter(p => p.status === 'Unpaid').reduce((sum, p) => sum + p.amount, 0);
    const totalCollected   = totalIssued - totalOutstanding;
    const collectionRate   = totalIssued > 0 ? (totalCollected / totalIssued) * 100 : 0;
    return { totalIssued, totalOutstanding, collectionRate };
  }, [chama?.penalties]);

  const processedEvents = useMemo(() => {
    return chamaUpcomingEvents.map(event => ({
      ...event,
      date: new Date(event.scheduled_at ?? event.date),
      type: event.type as 'Meeting' | 'Payout' | 'Deadline',
    }));
  }, [chamaUpcomingEvents]);

  const eventDays = useMemo(() => processedEvents.map(event => event.date), [processedEvents]);

  // Sync editable fields and derived state when chama loads
  useEffect(() => {
    if (!chama) return;
    setEditingChamaName(chama.name ?? '');
    setEditingChamaDescription(chama.description ?? '');
    setActivePoll((chama.polls || []).find((p: any) => p.status === 'active') ?? null);
    if (typeof window !== 'undefined') {
      setOnboardingLink(`${window.location.origin}/onboarding/${chama.id}`);
    }
  }, [chama]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const nextEvent = chamaUpcomingEvents[0];
    if (!nextEvent) { setCountdown(''); return; }
    const nextEventDate = new Date(nextEvent.date);
    const interval = setInterval(() => {
      const distance = nextEventDate.getTime() - Date.now();
      if (distance < 0) { clearInterval(interval); setCountdown('Event has passed'); return; }
      const days    = Math.floor(distance / 86400000);
      const hours   = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [chamaUpcomingEvents, isMounted]);

  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);


  const loanPortfolioStatsMemo = useMemo(() => {
    const loans = chama?.loans || [];
    const activeLoans = loans.filter((l: any) => l.status === 'Active' || l.status === 'Overdue');
    const totalLoaned = activeLoans.reduce((sum: number, l: any) => sum + l.amount, 0);
    const overdueLoans = loans.filter((l: any) => l.nextPaymentDate && new Date(l.nextPaymentDate) < new Date() && l.status !== 'Paid');
    const totalOverdueAmount = overdueLoans.reduce((sum: number, l: any) => sum + (l.amount - (l.amountPaid || 0)), 0);
    const par = totalLoaned > 0 ? (totalOverdueAmount / totalLoaned) * 100 : 0;
    const avgInterestRate = activeLoans.length > 0 ? activeLoans.reduce((sum: number, l: any) => sum + l.interestRate, 0) / activeLoans.length : 0;
    const agingBuckets = {
      '1-30': overdueLoans.filter((l: any) => l.nextPaymentDate && differenceInDays(new Date(), new Date(l.nextPaymentDate)) <= 30),
      '31-60': overdueLoans.filter((l: any) => { const d = l.nextPaymentDate ? differenceInDays(new Date(), new Date(l.nextPaymentDate)) : 0; return d > 30 && d <= 60; }),
      '61-90': overdueLoans.filter((l: any) => { const d = l.nextPaymentDate ? differenceInDays(new Date(), new Date(l.nextPaymentDate)) : 0; return d > 60 && d <= 90; }),
      '90+': overdueLoans.filter((l: any) => l.nextPaymentDate && differenceInDays(new Date(), new Date(l.nextPaymentDate)) > 90),
    };
    return { par, totalLoaned, activeLoans, avgInterestRate, agingBuckets, overdueLoans };
  }, [chama?.loans]);

  // ── Now safe to do conditional returns ────────────────────────────────────
  if (chamaLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!chama) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-6">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <CardTitle>Chama Not Found</CardTitle>
            <CardDescription>
              {chamaError ?? 'This chama could not be loaded.'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="outline">
              <Link href="/chamas">Back to Chama Circles</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const handleDayClick = (day: Date) => {
    const event = processedEvents.find(e => e.date.toDateString() === day.toDateString());
    if (event) {
        setSelectedEvent(event as ProcessedEvent);
    } else {
        setSelectedEvent(null);
    }
  }

  const lastMeeting = chama.meetings && chama.meetings[0];
  const chamaDocuments = documents.filter(doc => doc.chama === chama.name);
  const topPerformingMembers = (chama.members || []).slice(0, 3).sort((a, b) => b.savedYtd - a.savedYtd);
  const memberOfTheMonth = (chama.members || []).length > 0 ? chama.members.reduce((prev, current) => (prev.savedYtd > current.savedYtd) ? prev : current) : null;
  const welfareDrive = (chama.welfareDrives || [])[0];
  const chamaMemberBusinesses = memberBusinesses.filter(biz => (chama.members || []).some(m => m.name === biz.owner));


  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge variant="secondary" className="bg-green-900/50 text-green-300 flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-400"></div> Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300 flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-yellow-400"></div> Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="flex items-center gap-1">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
    const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Meeting Minutes':
        return <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">{category}</Badge>;
      case 'Financial Report':
        return <Badge variant="secondary" className="bg-green-900/50 text-green-300">{category}</Badge>;
      case 'Legal Document':
        return <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">{category}</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getPenaltyStatusBadge = (status: 'Paid' | 'Unpaid' | 'Waived') => {
    switch (status) {
        case 'Paid':
            return <Badge variant="secondary" className="bg-green-900/50 text-green-300">{status}</Badge>;
        case 'Unpaid':
            return <Badge variant="destructive">{status}</Badge>;
        case 'Waived':
            return <Badge variant="outline">{status}</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fundingProgress = (chama.fundingGoal?.collected ?? 0) / (chama.fundingGoal?.target ?? 1) * 100;
  const daysLeft = chama.fundingGoal?.deadline ? Math.ceil((new Date(chama.fundingGoal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
  
  const membershipProgress = chama.memberCount && chama.membershipTarget ? (chama.memberCount / chama.membershipTarget) * 100 : 0;
  
  const getContributionStatusBadge = (memberId: string) => {
    const s = memberStatuses[memberId];
    if (!s) {
      // Fallback to binary flag from member data
      const member = (chama?.members ?? []).find((m: any) => String(m.id) === String(memberId));
      const fallback = member?.contributionStatus ?? 'Unknown';
      if (fallback === 'Good Standing') return <Badge variant="secondary" className="bg-green-900/50 text-green-300">Up to date</Badge>;
      if (fallback === 'Needs Attention') return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">Needs attention</Badge>;
      return <Badge variant="outline">{fallback}</Badge>;
    }
    switch (s.status) {
      case 'up_to_date':
        return <Badge variant="secondary" className="bg-green-900/50 text-green-300">Up to date</Badge>;
      case 'advance':
        return <Badge variant="secondary" className="bg-emerald-900/50 text-emerald-300">Advance</Badge>;
      case 'partial':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="bg-orange-900/50 text-orange-300 cursor-default">
                  Partial — KES {(s.current_period_paid ?? 0).toLocaleString()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                KES {(s.expected_amount ?? 0).toLocaleString()} expected · KES {(s.expected_amount - s.current_period_paid).toLocaleString()} outstanding
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'overdue':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300 cursor-default">
                  Overdue {s.days_overdue > 0 ? `${s.days_overdue}d` : ''}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {s.current_period} · KES {(s.expected_amount ?? 0).toLocaleString()} expected
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'missing_payments':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="destructive" className="cursor-default">
                  {s.periods_missed} missed
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                KES {(s.balance_due ?? 0).toLocaleString()} total outstanding · Last paid: {s.last_paid_period ?? 'never'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'no_requirement':
        return <Badge variant="outline" className="text-muted-foreground">No requirement</Badge>;
      default:
        return <Badge variant="outline">{s.status}</Badge>;
    }
  };
  
    const getRiskBadge = (issue: string) => {
    switch (issue) {
      case 'Low contributor engagement':
        return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">● Engagement</Badge>;
      case 'Final disbursement pending':
        return <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">● Logistics</Badge>;
      default:
        return <Badge variant="outline">{issue}</Badge>;
    }
  };


  const handleSave = () => {
    setChama(prevChama => {
        if (!prevChama) return prevChama;
        return {
            ...prevChama,
            name: editingChamaName,
            description: editingChamaDescription,
        };
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingChamaName(chama.name);
    setEditingChamaDescription(chama.description);
    setIsEditing(false);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(onboardingLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "You can now share the onboarding link with potential members.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleApology = () => {
    toast({
        title: "Apology Sent",
        description: "Your meeting apology has been recorded and the chairperson notified.",
    });
  }

  // ── Deposit helpers ─────────────────────────────────────────────────────────
  function chamaCurrentPeriod(frequency: string): string {
    const now = new Date();
    switch (frequency) {
      case 'daily':       return now.toISOString().slice(0, 10);
      case 'weekly': {
        // ISO week: YYYY-W##
        const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        const day = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - day);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
        return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
      }
      case 'quarterly': {
        const q = Math.ceil((now.getMonth() + 1) / 3);
        return `${now.getFullYear()}-Q${q}`;
      }
      case 'annually':    return String(now.getFullYear());
      case 'monthly':
      default:            return now.toISOString().slice(0, 7);
    }
  }

  function resetDepositDialog() {
    setDepositMemberId('');
    setDepositAmount(chama?.membershipFee ? String(chama.membershipFee) : '');
    setDepositPeriod(chama ? chamaCurrentPeriod(chama.contributionFrequency ?? 'monthly') : '');
    setDepositMethod('mpesa');
    setDepositMpesaMode('stk');
    setDepositSubmitting(false);
    setDepositStkRef(null);
    setDepositStkStatus(null);
    if (depositPollRef.current) clearInterval(depositPollRef.current);
  }

  async function handleDepositManual() {
    if (!depositMemberId || !depositAmount) return;
    setDepositSubmitting(true);
    try {
      const res = await apiFetch(`/chamas/${params.id}/contributions`, {
        method: 'POST',
        body: JSON.stringify({
          member_id:      Number(depositMemberId),
          amount:         Number(depositAmount),
          period:         depositPeriod || undefined,
          payment_method: depositMethod,
        }),
      });
      if (res.status === 'success') {
        toast({ title: 'Contribution recorded', description: `KES ${Number(depositAmount).toLocaleString()} contribution saved.` });
        setDepositOpen(false);
        resetDepositDialog();
      } else {
        toast({ title: 'Error', description: res.message ?? 'Failed to record contribution.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Could not connect to server.', variant: 'destructive' });
    } finally {
      setDepositSubmitting(false);
    }
  }

  async function handleDepositStkPush() {
    if (!depositMemberId || !depositAmount) return;
    setDepositSubmitting(true);
    setDepositStkStatus(null);
    try {
      const res = await apiFetch<{ checkout_request_id: string; reference_id: string }>(
        `/chamas/${params.id}/contributions/stk-push`,
        {
          method: 'POST',
          body: JSON.stringify({
            member_id: Number(depositMemberId),
            amount:    Number(depositAmount),
            period:    depositPeriod || undefined,
          }),
        }
      );
      if (res.status === 'success' && res.data) {
        setDepositStkRef(res.data.checkout_request_id);
        setDepositStkStatus('pending');
        // Poll every 4 seconds for up to 90 seconds
        let attempts = 0;
        depositPollRef.current = setInterval(async () => {
          attempts++;
          try {
            const poll = await apiFetch<{ status: string }>(`/payments/mpesa/${encodeURIComponent(res.data!.reference_id)}/status`);
            if (poll.status === 'success' && poll.data) {
              const s = poll.data.status;
              if (s === 'completed') {
                clearInterval(depositPollRef.current!);
                setDepositStkStatus('success');
                toast({ title: 'Payment received!', description: `M-Pesa contribution confirmed.` });
              } else if (s === 'failed') {
                clearInterval(depositPollRef.current!);
                setDepositStkStatus('failed');
              }
            }
          } catch { /* ignore poll errors */ }
          if (attempts >= 22) {
            clearInterval(depositPollRef.current!);
            if (depositStkStatus === 'pending') setDepositStkStatus('failed');
          }
        }, 4000);
      } else {
        toast({ title: 'Error', description: res.message ?? 'Failed to initiate STK Push.', variant: 'destructive' });
        setDepositSubmitting(false);
      }
    } catch {
      toast({ title: 'Error', description: 'Could not connect to server.', variant: 'destructive' });
      setDepositSubmitting(false);
    }
  }

  async function handleRequestPayment(memberId: string, memberPhone: string, memberName: string) {
    // Use balance_due from analysis if available, otherwise fall back to membership fee
    const memberStatus = memberStatuses[memberId];
    const amount = (memberStatus?.balance_due > 0 ? memberStatus.balance_due : null)
      ?? chama.membershipFee
      ?? 1000;
    const period = memberStatus?.current_period ?? chamaCurrentPeriod(chama.contributionFrequency ?? 'monthly');

    const res = await apiFetch<{ checkout_request_id: string }>(
      `/chamas/${params.id}/contributions/stk-push`,
      {
        method: 'POST',
        body: JSON.stringify({ member_id: Number(memberId), amount, period }),
      }
    );
    if (res.status === 'success') {
      toast({ title: 'STK Push sent', description: `KES ${amount.toLocaleString()} payment prompt sent to ${memberPhone} (${memberName}).` });
    } else {
      toast({ title: 'Error', description: res.message ?? 'Could not send payment request.', variant: 'destructive' });
    }
  }

  const handleCreateEvent = () => {
    const title = eventTitleRef.current?.value;
    const type = selectedEventType;
    const date = eventDateRef.current?.value;

    if (title && type && date && chama) {
        const newEvent = {
            id: `event-${Date.now()}`,
            title,
            type,
            date,
            chama: chama.name,
            location: 'Virtual', // Default or from form
        };
        
        // This is a mock update. In a real app, you'd update the central data store.
        initialUpcomingEvents.push(newEvent as any);

        toast({
            title: "Event Scheduled!",
            description: `${title} has been added to the calendar.`,
        });
    } else {
         toast({
            title: "Error",
            description: "Please fill out all the event details.",
            variant: "destructive"
        });
    }
  };
  
  const handleCreatePoll = () => {
    if (!pollTitle || !pollEndDate || pollOptions.some(opt => !opt)) {
        toast({
            title: "Missing Information",
            description: "Please provide a title, end date, and fill out all options for the poll.",
            variant: "destructive",
        });
        return;
    }

    const newPoll = {
        id: `poll-${Date.now()}`,
        title: pollTitle,
        type: 'Proposal',
        status: 'active' as 'active' | 'closed',
        startDate: new Date().toISOString(),
        endDate: pollEndDate,
        voters: [],
        options: pollOptions.map(opt => ({ name: opt, votes: 0 })),
    };
    
    setChama(prevChama => {
        if (!prevChama) return prevChama;

        const updatedPolls = [...(prevChama.polls || [])];
        const currentActivePollIndex = updatedPolls.findIndex(p => p.status === 'active');
        if (currentActivePollIndex > -1) {
            updatedPolls[currentActivePollIndex].status = 'closed';
        }
        updatedPolls.unshift(newPoll);

        setActivePoll(newPoll);

        return { ...prevChama, polls: updatedPolls };
    });

    toast({
        title: "Poll Created!",
        description: `The poll "${pollTitle}" is now live.`,
    });

    setPollTitle('');
    setPollEndDate('');
    setPollOptions(['', '']);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
    }
  };

  const handleVote = () => {
    if (!selectedVote || !activePoll) return;

    const currentUserId = 'user-mock-id';

    if (activePoll.voters.includes(currentUserId)) {
        toast({
            title: "Already Voted",
            description: "You have already cast your vote in this poll.",
            variant: "destructive"
        });
        return;
    }

    const updatedPoll = { ...activePoll };
    const optionToUpdate = updatedPoll.options.find(opt => opt.name === selectedVote);
    if (optionToUpdate) {
        optionToUpdate.votes += 1;
    }
    updatedPoll.voters.push(currentUserId);
    
    setActivePoll(updatedPoll);

    toast({
        title: "Vote Submitted",
        description: `Your vote for "${selectedVote}" has been recorded.`,
    });
  };

  const handleEndPoll = () => {
    if (activePoll) {
        setActivePoll(prev => prev ? { ...prev, status: 'closed' } : undefined);
        toast({
            title: "Poll Closed",
            description: `The poll "${activePoll.title}" has been closed.`,
        });
    }
  };
  
    const handleShareResults = async () => {
        if (!activePoll) return;

        const resultsText = `Poll Results: ${activePoll.title}\\n\\n` +
            activePoll.options.map(opt => `${opt.name}: ${opt.votes} votes`).join('\\n') +
            `\\n\\nTotal Votes: ${totalVotes} | Turnout: ${voterTurnout.toFixed(1)}%`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Poll Results: ${activePoll.title}`,
                    text: resultsText,
                });
                toast({ title: "Results Shared!" });
            } catch (error) {
                console.error("Share failed:", error);
                toast({ title: "Share Failed", variant: "destructive" });
            }
        } else {
            navigator.clipboard.writeText(resultsText);
            toast({ title: "Results Copied", description: "Poll results have been copied to your clipboard." });
        }
    };

    const handlePrintResults = () => {
        window.print();
    };

    const handleApproveLoan = (loanId: string) => {
        setChama(prevChama => {
            if (!prevChama) return prevChama;

            const loanToApprove = chama.loans.find(l => l.id === loanId);
            if (!loanToApprove) return prevChama;
            
            const updatedLoans = chama.loans.map(l => 
                l.id === loanId 
                    ? { ...l, status: 'Active' as const, nextPaymentDate: '2024-09-01' } 
                    : l
            );
            
            toast({
                title: "Loan Approved",
                description: `The loan for ${(loanToApprove.amount ?? 0).toLocaleString()} has been approved.`,
            });
            
            return { ...prevChama, loans: updatedLoans };
        });
    };

    const handleRejectLoan = (loanId: string) => {
        setChama(prevChama => {
            if (!prevChama) return prevChama;
            
            const loanToReject = chama.loans.find(l => l.id === loanId);
            if (!loanToReject) return prevChama;

            const updatedLoans = chama.loans.map(l => l.id === loanId ? {...l, status: 'Rejected' as const} : l);
            
            toast({
                variant: 'destructive',
                title: "Loan Rejected",
                description: `The loan for ${(loanToReject.amount ?? 0).toLocaleString()} has been rejected.`,
            });

            return { ...prevChama, loans: updatedLoans };
        });
    };

    const handleSignGuarantor = (loanId: string, memberId: string) => {
        setChama(prevChama => {
            if (!prevChama) return prevChama;
            
            const updatedLoans = chama.loans.map(loan => {
                if (loan.id === loanId) {
                    const updatedGuarantors = loan.guarantors.map(g => 
                        g.memberId === memberId ? { ...g, status: 'Signed' as 'Signed' | 'Pending' } : g
                    );
                    return { ...loan, guarantors: updatedGuarantors };
                }
                return loan;
            });
            
            toast({
                title: "Guarantor Signature Confirmed",
                description: "You have successfully signed as a guarantor for this loan.",
            });

            return { ...prevChama, loans: updatedLoans };
        });
    };

    const generateAmortization = (loan: any) => {
        const principal = loan.amount - (loan.amountPaid || 0);
        
        const numberOfPayments = loan.repaymentPeriod - (loan.paymentsMade || 0);

        if (numberOfPayments <= 0) {
            setAmortizationSchedule([]);
            return;
        }

        let schedule = [];
        const startDate = loan.nextPaymentDate ? new Date(loan.nextPaymentDate) : new Date();
        let balance = principal;

        if (loan.interestMethod === 'Flat Rate') {
            const totalInterest = (loan.amount * (loan.interestRate / 100) * loan.repaymentPeriod) / 12;
            const monthlyPayment = (loan.amount + totalInterest) / loan.repaymentPeriod;
            const principalPayment = loan.amount / loan.repaymentPeriod;
            const interestPayment = totalInterest / loan.repaymentPeriod;

            for (let i = 1; i <= numberOfPayments; i++) {
                balance -= principalPayment;
                schedule.push({
                    paymentNumber: (loan.paymentsMade || 0) + i,
                    dueDate: format(addMonths(startDate, i-1), 'dd MMM, yyyy'),
                    payment: monthlyPayment,
                    principal: principalPayment,
                    interest: interestPayment,
                    balance: balance > 0 ? balance : 0,
                    status: 'Upcoming',
                });
            }
        } else { // Amortized / Reducing Balance
            const monthlyInterestRate = loan.interestRate / 100 / 12;
            const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

            for (let i = 1; i <= numberOfPayments; i++) {
                const interestPayment = balance * monthlyInterestRate;
                const principalPayment = monthlyPayment - interestPayment;
                balance -= principalPayment;
                schedule.push({
                    paymentNumber: (loan.paymentsMade || 0) + i,
                    dueDate: format(addMonths(startDate, i-1), 'dd MMM, yyyy'),
                    payment: monthlyPayment,
                    principal: principalPayment,
                    interest: interestPayment,
                    balance: balance > 0 ? balance : 0,
                    status: 'Upcoming',
                });
            }
        }

        setAmortizationSchedule(schedule);
    };
    
    const handleMakePayment = (loanId: string, paymentNumber: number) => {
        setChama(prevChama => {
            if (!prevChama) return prevChama;
            const updatedLoans = chama.loans.map(loan => {
                if (loan.id === loanId) {
                    const updatedLoan = {
                        ...loan,
                        paymentsMade: (loan.paymentsMade || 0) + 1,
                        amountPaid: loan.amountPaid + (amortizationSchedule.find(p => p.paymentNumber === paymentNumber)?.payment || 0),
                        nextPaymentDate: format(addMonths(new Date(loan.nextPaymentDate!), 1), 'yyyy-MM-dd')
                    };
                    generateAmortization(updatedLoan);
                    return updatedLoan;
                }
                return loan;
            });
            
            toast({
                title: "STK Push Sent",
                description: "Please check your phone to complete the M-Pesa payment.",
            });
            
            return { ...prevChama, loans: updatedLoans };
        });
    };


  const contributionData = [
    { month: 'Jan', contributed: 45000, target: 50000 },
    { month: 'Feb', contributed: 48000, target: 50000 },
    { month: 'Mar', contributed: 50000, target: 50000 },
    { month: 'Apr', contributed: 47000, target: 50000 },
    { month: 'May', contributed: 52000, target: 50000 },
    { month: 'Jun', contributed: 49000, target: 50000 },
  ];
  const maxContribution = 55000;
  
  const showManagementOptions = role === 'admin' || role === 'chairperson';
  
  const totalVotes = activePoll ? (activePoll.options || []).reduce((sum, o) => sum + o.votes, 0) : 0;
  const voterTurnout = activePoll ? (totalVotes / (chama.members?.length || 1)) * 100 : 0;
  
  const currentUserId = 'user-mock-id';
  const hasVoted = activePoll?.voters?.includes(currentUserId);
  const shareText = activePoll ? `Poll Results: ${activePoll.title}` : '';
  const pollId = activePoll ? `POLL-${activePoll.id.substring(activePoll.id.length - 4).toUpperCase()}` : '';

    const accountabilityDrivesAtRisk = [
        {
            name: 'Community Health Clinic',
            daysLeft: 15,
            progress: 25,
            target: 'KES 1.2M',
            issue: 'Low contributor engagement',
        },
    ];
    const accountabilityTopDrivesData = (chama.welfareDrives || []).map(drive => ({
      name: drive.title,
      raised: drive.raised,
      goal: drive.goal,
    }));
    
    const accountabilityContributionData = [
        { month: 'Jan', contributed: 28000, target: 30000 },
        { month: 'Feb', contributed: 29000, target: 30000 },
        { month: 'Mar', contributed: 30000, target: 30000 },
        { month: 'Apr', contributed: 28500, target: 30000 },
        { month: 'May', contributed: 31000, target: 30000 },
        { month: 'Jun', contributed: 29500, target: 30000 },
    ];
    const accountabilityMaxContribution = 32000;

    const getTypeBadge = (type: string) => {
        switch (type) {
          case 'Income':
            return (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              >
                Income
              </Badge>
            );
          case 'Expense':
            return (
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
              >
                Expense
              </Badge>
            );
          default:
            return <Badge variant="outline">{type}</Badge>;
        }
      };
    
      const formatAmount = (amount: number) => {
        const formatted = `KES ${Math.abs(amount).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
        return amount > 0 ? `+ ${formatted}` : `- ${formatted}`;
      };
      
      const userEngagementData = [
          { name: 'Jan', Members: 10 },
          { name: 'Feb', Members: 12 },
          { name: 'Mar', Members: 12 },
          { name: 'Apr', Members: 13 },
          { name: 'May', Members: 15 },
          { name: 'Jun', Members: 14 },
      ];
      
      const financialPerformanceData = [
        { name: 'Jan', Contributions: 45000, Payouts: 0 },
        { name: 'Feb', Contributions: 48000, Payouts: 0 },
        { name: 'Mar', Contributions: 50000, Payouts: 50000 },
        { name: 'Apr', Contributions: 47000, Payouts: 0 },
        { name: 'May', Contributions: 52000, Payouts: 0 },
        { name: 'Jun', Contributions: 49000, Payouts: 60000 },
      ];

      const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
      const welfareProgress = welfareDrive ? (welfareDrive.raised / welfareDrive.goal) * 100 : 0;
      
      const handleContribute = () => {
        setContributionMade(true);
        setTimeout(() => {
            setContributionMade(false);
        }, 10000);
      }
      
      const welfareShareText = welfareDrive ? `Support this cause: ${welfareDrive.title}` : '';
      
      const getLoanStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': return <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">{status}</Badge>;
            case 'Pending': return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">{status}</Badge>;
            case 'Paid': return <Badge variant="secondary" className="bg-green-900/50 text-green-300">{status}</Badge>;
            case 'Rejected': return <Badge variant="destructive">{status}</Badge>;
            case 'Overdue': return <Badge variant="destructive">{status}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
      };

    const loanPortfolioStats = loanPortfolioStatsMemo;

    const allGuarantorRequests = (chama.loans || []).filter(l => (l.guarantors || []).some(g => g.status === 'Pending'));


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-900/50 text-green-300">ACTIVE CYCLE</Badge>
              <span className="text-sm text-muted-foreground">Pool ID: #{chama.poolId}</span>
          </div>
          {isEditing ? (
            <div className="mt-2 space-y-2">
                <Input 
                  value={editingChamaName} 
                  onChange={(e) => setEditingChamaName(e.target.value)}
                  className="text-3xl md:text-4xl font-bold tracking-tight h-auto p-0 border-0 focus-visible:ring-0 bg-transparent"
                />
                <Textarea
                    value={editingChamaDescription}
                    onChange={(e) => setEditingChamaDescription(e.target.value)}
                    className="text-muted-foreground mt-1 h-auto p-0 border-0 focus-visible:ring-0 bg-transparent"
                />
            </div>
            ) : (
                <div className="mt-2">
                    <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">{chama.name}</h1>
                    <p className="text-muted-foreground mt-1">{chama.description}</p>
                </div>
            )}
        </div>
        <div className="flex gap-2 shrink-0">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Check className="mr-2 h-4 w-4 text-green-400" /> Save
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="mr-2 h-4 w-4 text-red-400" /> Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Details
              </Button>
            )}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline"><Plus className="mr-2 h-4 w-4"/> Add Member</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Add Member to {chama.name}</DialogTitle>
                        <DialogDescription>
                            Add a new member directly using the onboarding form, or share the link for self-registration.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="direct" className="w-full flex flex-col flex-1 min-h-0">
                        <TabsList className="grid w-full grid-cols-2 shrink-0">
                            <TabsTrigger value="direct"><UserPlus className="mr-2 h-4 w-4" />Add Directly</TabsTrigger>
                            <TabsTrigger value="link"><Share2 className="mr-2 h-4 w-4" />Share Link</TabsTrigger>
                        </TabsList>

                        {/* ── Tab 1: Admin onboarding form (same form, auto-approved) ── */}
                        <TabsContent value="direct" className="flex-1 min-h-0">
                            <ScrollArea className="h-[60vh] pr-4">
                                <div className="py-3 px-1">
                                    <div className="flex items-start gap-2 p-3 mb-4 rounded-md bg-primary/5 border border-primary/20 text-sm">
                                        <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                        <p className="text-muted-foreground">
                                            Members added this way are <span className="text-foreground font-medium">immediately approved</span> and added to the chama — no pending review required.
                                        </p>
                                    </div>
                                    <OnboardingForm
                                        chamaId={String(chama.id)}
                                        mode="admin"
                                        showRole={true}
                                        onSuccess={(data) => {
                                            if (data?.user) {
                                                setChama((prev: any) => prev ? {
                                                    ...prev,
                                                    members: [...(prev.members || []), {
                                                        id: String(data.user.id),
                                                        name: data.user.name,
                                                        role: 'Member',
                                                        avatarUrl: null,
                                                        status: 'Paid',
                                                        contributionStatus: 'Good Standing',
                                                    }],
                                                    memberCount: (prev.memberCount ?? 0) + 1,
                                                } : prev);
                                            }
                                        }}
                                    />
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        {/* ── Tab 2: Share onboarding link (pending approval) ── */}
                        <TabsContent value="link" className="space-y-4 pt-2">
                            <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-muted-foreground">
                                    People who submit through this link will appear in the <span className="text-foreground font-medium">Member Requests</span> tab for your review before being added.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input value={onboardingLink} readOnly />
                                <Button onClick={handleCopy} size="icon" variant="outline">
                                    {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                                </Button>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
            <Dialog open={depositOpen} onOpenChange={(o) => { if (!o) resetDepositDialog(); setDepositOpen(o); }}>
                <DialogTrigger asChild>
                    <Button onClick={() => { resetDepositDialog(); setDepositOpen(true); }}><CircleDot className="mr-2" /> Record Deposit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Record New Deposit</DialogTitle>
                        <DialogDescription>
                            Record a contribution for a member of {chama.name}.
                        </DialogDescription>
                    </DialogHeader>

                    {/* STK Push sent — status screen */}
                    {depositStkRef && (
                        <div className="py-6 flex flex-col items-center gap-4 text-center">
                            {depositStkStatus === 'pending' && (
                                <>
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="font-medium">Waiting for payment…</p>
                                    <p className="text-sm text-muted-foreground">
                                        A payment prompt has been sent to the member's phone.
                                        Please ask them to enter their M-Pesa PIN.
                                    </p>
                                </>
                            )}
                            {depositStkStatus === 'success' && (
                                <>
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 border border-green-700/40">
                                        <Check className="h-8 w-8 text-green-400" />
                                    </div>
                                    <p className="font-medium text-green-400">Payment confirmed!</p>
                                    <p className="text-sm text-muted-foreground">Contribution has been recorded automatically.</p>
                                    <Button className="w-full" onClick={() => { setDepositOpen(false); resetDepositDialog(); }}>Close</Button>
                                </>
                            )}
                            {depositStkStatus === 'failed' && (
                                <>
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30 border border-red-700/40">
                                        <X className="h-8 w-8 text-red-400" />
                                    </div>
                                    <p className="font-medium text-red-400">Payment failed or timed out</p>
                                    <p className="text-sm text-muted-foreground">The member may have cancelled or not responded in time.</p>
                                    <Button variant="outline" className="w-full" onClick={() => { setDepositStkRef(null); setDepositStkStatus(null); setDepositSubmitting(false); }}>Try Again</Button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Form */}
                    {!depositStkRef && (
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Member</Label>
                                <Select value={depositMemberId} onValueChange={setDepositMemberId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(chama.members || []).map((member: any) => (
                                            <SelectItem key={member.id} value={String(member.id)}>
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deposit-amount">Amount (KES)</Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-muted-foreground text-sm">KES</span>
                                    </div>
                                    <Input
                                        id="deposit-amount"
                                        type="number"
                                        min={1}
                                        placeholder="e.g., 5000"
                                        className="pl-12"
                                        value={depositAmount}
                                        onChange={e => setDepositAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deposit-period">Period (optional)</Label>
                                <Input
                                    id="deposit-period"
                                    type="month"
                                    value={depositPeriod}
                                    onChange={e => setDepositPeriod(e.target.value)}
                                    placeholder="e.g., 2026-05"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select value={depositMethod} onValueChange={v => { setDepositMethod(v); setDepositMpesaMode('stk'); }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                                        <SelectItem value="bank">Bank Deposit</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* M-Pesa: STK Push vs Manual record toggle */}
                            {depositMethod === 'mpesa' && (
                                <div className="rounded-lg border bg-muted/40 p-3 space-y-3">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">M-Pesa Mode</p>
                                    <RadioGroup value={depositMpesaMode} onValueChange={v => setDepositMpesaMode(v as 'manual' | 'stk')} className="gap-2">
                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem value="stk" id="mode-stk" className="mt-0.5" />
                                            <Label htmlFor="mode-stk" className="cursor-pointer font-normal">
                                                <span className="font-medium">Send STK Push</span>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Prompt the member's phone to pay via M-Pesa. Contribution is recorded automatically on success.
                                                </p>
                                            </Label>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem value="manual" id="mode-manual" className="mt-0.5" />
                                            <Label htmlFor="mode-manual" className="cursor-pointer font-normal">
                                                <span className="font-medium">Record manually</span>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Member already paid via M-Pesa — enter the reference to record it.
                                                </p>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}

                            {depositMethod === 'bank' && (
                                <div className="space-y-2">
                                    <Label htmlFor="bank-ref">Transaction Reference #</Label>
                                    <Input id="bank-ref" placeholder="e.g., RABCD1234EFG" />
                                </div>
                            )}

                            {depositMethod === 'cash' && (
                                <div className="space-y-2">
                                    <Label htmlFor="cash-time">Date & Time of Receipt</Label>
                                    <Input id="cash-time" type="datetime-local" />
                                </div>
                            )}
                        </div>
                    )}

                    {!depositStkRef && (
                        <DialogFooter>
                            <Button variant="outline" onClick={() => { setDepositOpen(false); resetDepositDialog(); }} disabled={depositSubmitting}>
                                Cancel
                            </Button>
                            {depositMethod === 'mpesa' && depositMpesaMode === 'stk' ? (
                                <Button
                                    onClick={handleDepositStkPush}
                                    disabled={depositSubmitting || !depositMemberId || !depositAmount}
                                >
                                    {depositSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : <><Smartphone className="mr-2 h-4 w-4" />Send STK Push</>}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleDepositManual}
                                    disabled={depositSubmitting || !depositMemberId || !depositAmount}
                                >
                                    {depositSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : 'Confirm Deposit'}
                                </Button>
                            )}
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="marketplace"><Store className="mr-2"/>Marketplace</TabsTrigger>
            <TabsTrigger value="penalties"><AlertOctagon className="mr-2" /> Fines</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="welfare"><ShieldCheck className="mr-2"/>Welfare</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="accountability">
                <ShieldCheck className="mr-2"/>
                Accountability
            </TabsTrigger>
            <TabsTrigger value="bi-dashboard">
                <LineChartIcon className="mr-2"/>
                BI Dashboard
            </TabsTrigger>
             <TabsTrigger value="settings">
                <Link href="/chamas"><ArrowLeft className="mr-2"/>Back</Link>
            </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Pool Value</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">KES {(chama.stats.totalPoolValue ?? 0).toLocaleString()}</div>
                      <p className="text-xs text-green-400">+{chama.stats.poolValueChange}% vs last month</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{chama.payoutSchedule?.[0]?.date?.split(',')?.[0] ?? '—'}</div>
                      <p className="text-xs text-muted-foreground">{chama.payoutSchedule?.[0]?.recipient ?? '—'}</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Outstanding Loans</CardTitle>
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">KES {(chama.stats.outstandingLoans?.amount ?? 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{chama.stats.outstandingLoans.count} active loans</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Contribution</CardTitle>
                      <HandCoins className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">KES {(chama.stats.monthlyContribution?.amount ?? 0).toLocaleString()}</div>
                      <p className="text-xs text-red-400">{chama.stats.monthlyContribution.latePayments} late payments</p>
                  </CardContent>
              </Card>
          </div>
          <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/50 text-amber-200">
            <AlertTriangle className="h-4 w-4 !text-amber-400" />
            <AlertTitle className="font-bold text-amber-300">Inflation Shield Alert</AlertTitle>
            <div className="flex justify-between items-center">
                <AlertDescription>
                Your public fundraising goal has increased by 15% due to new market prices. To stay on track, we suggest you raise contributions by at least KES 12,500.
                </AlertDescription>
                <div className="flex gap-2 shrink-0 ml-4">
                    <Button variant="ghost" size="sm">Dismiss</Button>
                    <Button variant="secondary" size="sm" className="bg-amber-400 text-amber-900 hover:bg-amber-500">Accept Change</Button>
                </div>
            </div>
          </Alert>
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-5 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Group Contribution Performance (vs Goal)</CardTitle>
                        <CardDescription>Monthly contribution performance for the current cycle.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChartComponent data={contributionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="k" tickFormatter={(value) => `${value / 1000}`} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                    formatter={(value: number) => [`KES ${(value ?? 0).toLocaleString()}`, null]}
                                />
                                <Bar dataKey="contributed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChartComponent>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
          </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Saved (YTD)</TableHead>
                                        <TableHead>On-time Rate</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topPerformingMembers.map(member => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={member.avatarUrl} />
                                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{member.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>KES {(member.savedYtd ?? 0).toLocaleString()}</TableCell>
                                            <TableCell className="text-green-400 font-semibold">{member.attendanceRate}%</TableCell>
                                            <TableCell className="text-right">
                                                 <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approvals</CardTitle>
                            <CardDescription>Daily carry-forward of requests, open approvals from management.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Requestor</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Approvals</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(chama.pendingApprovals || []).map(approval => (
                                        <TableRow key={approval.id}>
                                            <TableCell>{approval.requestor}</TableCell>
                                            <TableCell><Badge variant="outline">{approval.type}</Badge></TableCell>
                                            <TableCell>KES {(approval.amount ?? 0).toLocaleString()}</TableCell>
                                            <TableCell><Progress value={(approval.approvals / approval.requiredApprovals) * 100} className="h-2" /></TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 border-red-400/50 hover:bg-red-900/30"><X className="h-4 w-4 mr-1" /> Reject</Button>
                                                <Button size="sm"><Check className="h-4 w-4 mr-1"/> Approve</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Upcoming Events</CardTitle>
                                <Button variant="outline" size="sm"><Plus className="mr-2"/> New</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isMounted && (
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Countdown to {chamaUpcomingEvents[0]?.title}</p>
                                    <p className="text-2xl font-bold font-mono tracking-wider my-2">{countdown || "No upcoming events"}</p>
                                </div>
                            )}
                            {chamaUpcomingEvents.slice(0,1).map(event => (
                                <div key={event.id} className="p-4 bg-muted/50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            <p className="text-sm text-muted-foreground" suppressHydrationWarning><EventDate date={event.date}/></p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <Button variant="link" className="p-0 h-auto">Send Apology</Button>
                                        <Button variant="link" className="p-0 h-auto">View Attendees</Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Polls & Elections</CardTitle>
                            <CardDescription>Manage group decisions and leadership changes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {activePoll ? (
                                <div className="space-y-4">
                                    <h4 className="font-semibold">{activePoll.title}</h4>
                                    <Progress value={voterTurnout} className="h-2" />
                                    <p className="text-xs text-muted-foreground">{voterTurnout.toFixed(0)}% turnout ({totalVotes}/{chama.members.length} votes)</p>
                                    
                                    <div className="space-y-2">
                                        {activePoll.options.map((option, index) => (
                                            <div key={index} className="relative">
                                                <Progress value={(option.votes / (totalVotes || 1)) * 100} className="h-8" indicatorClassName="bg-primary/50" />
                                                <div className="absolute inset-0 flex justify-between items-center px-3 text-sm">
                                                    <span>{option.name}</span>
                                                    <span className="font-bold">{option.votes} votes</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="w-full">Vote Now</Button>
                                        <Button variant="destructive" className="w-full" onClick={handleEndPoll}>End Poll</Button>
                                        <Button className="w-full">View Results</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                                    <p>No active polls.</p>
                                    <Button variant="secondary" className="mt-4" size="sm">Start a new Poll</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Management Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chama.managementTeam.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={member.avatarUrl} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="secondary">{member.role}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Stream</CardTitle>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        {(chama.activityStream || []).map(activity => (
                             <div key={activity.id} className="flex items-start gap-3">
                                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                     <Activity className="h-5 w-5 text-muted-foreground" />
                                 </div>
                                 <div>
                                     <p className="text-sm" dangerouslySetInnerHTML={{ __html: activity.description }} />
                                     <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                 </div>
                             </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Member Requests</CardTitle>
                        <CardDescription>Review and approve new members who want to join your Chama circle.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Application Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chama.memberRequests.map(request => (
                                    <TableRow key={request.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={request.avatarUrl} />
                                                    <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{request.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{request.applicationDate}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={async () => {
                                                const res = await apiFetch(`/chamas/${chama.id}/requests/${request.id}/reject`, { method: 'POST' });
                                                if (res.status === 'success') {
                                                    setChama((prev: any) => prev ? { ...prev, memberRequests: prev.memberRequests.filter((r: any) => r.id !== request.id) } : prev);
                                                    toast({ title: 'Request Rejected', description: `${request.name}'s application has been rejected.` });
                                                }
                                            }}><X className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300" onClick={async () => {
                                                const res = await apiFetch(`/chamas/${chama.id}/requests/${request.id}/approve`, { method: 'POST' });
                                                if (res.status === 'success') {
                                                    // Remove from pending list immediately
                                                    setChama((prev: any) => prev ? {
                                                        ...prev,
                                                        memberRequests: prev.memberRequests.filter((r: any) => r.id !== request.id),
                                                        memberCount: (prev.memberCount ?? 0) + 1,
                                                    } : prev);
                                                    // Refresh the members list from the server to get the real member record
                                                    apiFetch(`/chamas/${chama.id}/members`).then((membersRes: any) => {
                                                        if (membersRes.status === 'success' && membersRes.data) {
                                                            setChama((prev: any) => prev ? {
                                                                ...prev,
                                                                members: membersRes.data.map((m: any) => ({
                                                                    id: String(m.id),
                                                                    name: m.name,
                                                                    role: m.role,
                                                                    avatarUrl: m.avatar_url ?? null,
                                                                    status: m.contribution_status === 'good_standing' ? 'Paid' : 'Overdue',
                                                                    contributionStatus: m.contribution_status === 'good_standing' ? 'Good Standing' : 'Needs Attention',
                                                                    joiningDate: m.joined_at,
                                                                })),
                                                            } : prev);
                                                        }
                                                    });
                                                    toast({ title: 'Member Approved', description: `${request.name} has been added to the chama.` });
                                                }
                                            }}><Check className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="members" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <CardTitle>Member Roster</CardTitle>
                    <CardDescription>An overview of all members in {chama.name}.</CardDescription>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name..." className="pl-8" />
                    </div>
                    <MemberUploader chamaName={chama.name}/>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Contribution Status</TableHead>
                            <TableHead className="text-right">Balance Due</TableHead>
                            <TableHead>Last Paid</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(chama.members || []).map(member => {
                          const ms = memberStatuses[member.id];
                          return (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <Link href={`/chamas/${chama.id}/members/${member.id}`} className="flex items-center gap-3 hover:underline">
                                        <Avatar>
                                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                                            <AvatarFallback>{(member.name ?? '?').split(' ').filter(Boolean).map((n: string) => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.role}</p>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>{getContributionStatusBadge(member.id)}</TableCell>
                                <TableCell className="text-right font-mono">
                                    {ms ? (
                                        ms.balance_due > 0
                                            ? <span className="text-red-400">KES {ms.balance_due.toLocaleString()}</span>
                                            : ms.advance_balance > 0
                                                ? <span className="text-emerald-400">+KES {ms.advance_balance.toLocaleString()}</span>
                                                : <span className="text-muted-foreground">—</span>
                                    ) : <span className="text-muted-foreground">—</span>}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {ms?.last_paid_date
                                        ? <span title={ms.last_paid_period ?? ''}>{ms.last_paid_date}</span>
                                        : '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* Quick record deposit for this member */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            const amt = ms?.expected_amount ?? chama.membershipFee ?? 0;
                                                            const period = ms?.current_period ?? chamaCurrentPeriod(chama.contributionFrequency ?? 'monthly');
                                                            setDepositMemberId(member.id);
                                                            setDepositAmount(String(amt));
                                                            setDepositPeriod(period);
                                                            setDepositMethod('mpesa');
                                                            setDepositMpesaMode('stk');
                                                            setDepositStkRef(null);
                                                            setDepositStkStatus(null);
                                                            setDepositSubmitting(false);
                                                            setDepositOpen(true);
                                                        }}
                                                    >
                                                        <CircleDot className="h-4 w-4 text-primary/70" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Record deposit</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        {/* STK push for members with balance due */}
                                        {(ms?.balance_due > 0 || member.contributionStatus === 'Needs Attention') && member.phone && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRequestPayment(member.id, member.phone, member.name)}
                                                        >
                                                            <Smartphone className="h-4 w-4 text-yellow-400" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Request KES {(ms?.balance_due ?? chama.membershipFee ?? 0).toLocaleString()} via STK Push</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/chamas/${chama.id}/members/${member.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="loans" className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Portfolio at Risk (PAR &gt; 30d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-400">{loanPortfolioStats.par.toFixed(2)}%</div>
                        <p className="text-xs text-muted-foreground">of total loan portfolio is overdue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding Loans</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KES {(loanPortfolioStats.totalLoaned ?? 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{loanPortfolioStats.activeLoans.length} active loans</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Loans Pending Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{chama.loans.filter(l => l.status === 'Pending').length}</div>
                        <p className="text-xs text-muted-foreground">awaiting review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Interest Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loanPortfolioStats.avgInterestRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">across all active loans</p>
                    </CardContent>
                </Card>
            </div>

            {allGuarantorRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Guarantor Requests</CardTitle>
                        <CardDescription>Review and sign off on loan requests where you are listed as a guarantor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Application Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allGuarantorRequests.map(loan => {
                                    const borrower = chama.members.find(m => m.id === loan.memberId);
                                    return (
                                        <TableRow key={`guarantor-${loan.id}`}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={borrower?.avatarUrl} alt={borrower?.name} />
                                                        <AvatarFallback>{(borrower?.name ?? '?').split(' ').filter(Boolean).map((n: string) => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{borrower?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>KES {(loan.amount ?? 0).toLocaleString()}</TableCell>
                                            <TableCell>{format(new Date(loan.applicationDate), 'dd MMM, yyyy')}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-400/10 hover:text-red-300">
                                                    <X className="mr-1 h-4 w-4"/>
                                                    Decline
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-green-400 border-green-400/50 hover:bg-green-400/10 hover:text-green-300">
                                                    <FileSignature className="mr-1 h-4 w-4"/>
                                                    Digitally Sign
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

             <Card>
                <CardHeader>
                    <CardTitle>Pending Loan Approvals</CardTitle>
                    <CardDescription>Review and action new loan applications from members.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                         <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Guarantors</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {chama.loans.filter(loan => loan.status === 'Pending').map(loan => {
                                const borrower = chama.members.find(m => m.id === loan.memberId);
                                const allGuarantorsSigned = loan.guarantors.every(g => g.status === 'Signed');
                                return (
                                    <TableRow key={loan.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={borrower?.avatarUrl} />
                                                    <AvatarFallback>{borrower?.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{borrower?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>KES {(loan.amount ?? 0).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center -space-x-2">
                                                {loan.guarantors.map(g => {
                                                    const guarantorMember = chama.members.find(m => m.id === g.memberId);
                                                    return (
                                                        <TooltipProvider key={g.memberId}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Avatar className={cn("border-2", g.status === 'Signed' ? "border-green-500" : "border-yellow-500")}>
                                                                        <AvatarImage src={guarantorMember?.avatarUrl} />
                                                                        <AvatarFallback>{guarantorMember?.name.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{guarantorMember?.name} - {g.status}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleRejectLoan(loan.id)}><X className="mr-1 h-4 w-4" /> Reject</Button>
                                            <Button size="sm" disabled={!allGuarantorsSigned} onClick={() => handleApproveLoan(loan.id)}><Check className="mr-1 h-4 w-4" /> Approve</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                             })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Loan Aging Report</CardTitle>
                    <CardDescription>A summary of overdue loans to assess portfolio risk.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aging Bucket</TableHead>
                                <TableHead># of Loans</TableHead>
                                <TableHead>Principal at Risk (KES)</TableHead>
                                <TableHead>Members Affected</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {Object.entries(loanPortfolioStats.agingBuckets).map(([bucket, loans]) => (
                                <TableRow key={bucket}>
                                    <TableCell>{bucket} days</TableCell>
                                    <TableCell>{loans.length}</TableCell>
                                    <TableCell className={cn(loans.length > 0 && "text-red-400 font-semibold")}>
                                        KES {loans.reduce((sum, l) => sum + (l.amount - (l.amountPaid || 0)), 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                         <div className="flex items-center -space-x-2">
                                            {loans.map(l => {
                                                const member = chama.members.find(m => m.id === l.memberId);
                                                return (
                                                    <TooltipProvider key={l.id}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Avatar>
                                                                    <AvatarImage src={member?.avatarUrl} />
                                                                    <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{member?.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )
                                            })}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>All Loans</CardTitle>
                    <CardDescription>A complete record of all loans with {chama.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Amount (KES)</TableHead>
                                <TableHead>Interest</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Next Payment</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chama.loans.map(loan => {
                                const borrower = chama.members.find(m => m.id === loan.memberId);
                                return (
                                <TableRow key={loan.id}>
                                    <TableCell>
                                        <div className="font-medium">{borrower?.name}</div>
                                        <div className="text-sm text-muted-foreground">{borrower?.role}</div>
                                    </TableCell>
                                    <TableCell>{(loan.amount ?? 0).toLocaleString()}</TableCell>
                                    <TableCell>{loan.interestRate}%</TableCell>
                                    <TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
                                    <TableCell>{loan.nextPaymentDate ? format(new Date(loan.nextPaymentDate), 'dd MMM, yyyy') : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </TabsContent>
        <TabsContent value="marketplace" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Member Marketplace</CardTitle>
                <CardDescription>Discover and support businesses owned and operated by your fellow Chama members.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chamaMemberBusinesses.map((biz) => (
                    <Card key={biz.id} className="flex flex-col">
                        <CardHeader className="p-0">
                            {biz.image && (
                                <div className="relative aspect-video w-full">
                                    <Image src={biz.image.imageUrl} alt={biz.name} fill className="object-cover rounded-t-lg" data-ai-hint={biz.image.imageHint} />
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                             <Badge variant="secondary">{biz.category}</Badge>
                             <h3 className="font-bold text-lg mt-2">{biz.name}</h3>
                             <p className="text-sm text-muted-foreground">by {biz.owner}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full">View Details</Button>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="penalties" className="mt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Fines & Penalties</CardTitle>
                    <CardDescription>Manage and track all fines issued to members of {chama.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Fines Issued</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">KES {(penaltiesSummary.totalIssued ?? 0).toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-400">KES {(penaltiesSummary.totalOutstanding ?? 0).toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-400">{penaltiesSummary.collectionRate.toFixed(1)}%</div>
                            </CardContent>
                        </Card>
                    </div>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Date Issued</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(chama.penalties || []).map(penalty => {
                                const member = chama.members.find(m => m.id === penalty.memberId);
                                return (
                                <TableRow key={penalty.id}>
                                    <TableCell>{member?.name}</TableCell>
                                    <TableCell>{penalty.reason}</TableCell>
                                    <TableCell>{penalty.dateIssued}</TableCell>
                                    <TableCell>KES {(penalty.amount ?? 0).toLocaleString()}</TableCell>
                                    <TableCell>{getPenaltyStatusBadge(penalty.status as 'Paid' | 'Unpaid' | 'Waived')}</TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></TableCell>
                                </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="documents" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <CardTitle>Document Repository</CardTitle>
                    <CardDescription>Central storage for all important Chama documents.</CardDescription>
                </div>
                <Button><Upload className="mr-2 h-4 w-4"/> Upload Document</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Uploaded By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {chamaDocuments.map(doc => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">{doc.title}</TableCell>
                                <TableCell>{getCategoryBadge(doc.category)}</TableCell>
                                <TableCell>{doc.uploadedBy}</TableCell>
                                <TableCell>{doc.uploadDate}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="welfare" className="mt-6 space-y-6">
           {welfareDrive ? (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="p-0">
                                {welfareDrive.image && (
                                    <div className="relative aspect-video w-full">
                                    <Image
                                        src={welfareDrive.image.imageUrl}
                                        alt={welfareDrive.image.description}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        data-ai-hint={welfareDrive.image.imageHint}
                                    />
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2 bg-red-900/50 text-red-300">{welfareProgress.toFixed(0)}% Funded</Badge>
                                </div>

                                <h1 className="font-headline text-3xl font-bold tracking-tight">{welfareDrive.title}</h1>
                                <p className="text-muted-foreground mt-2">Organized by <span className="font-semibold text-primary">{welfareDrive.managers?.[0]?.name ?? '—'}</span></p>
                                <p className="mt-4 text-muted-foreground">{welfareDrive.description}</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="flex items-end gap-2">
                                    <h2 className="text-4xl font-bold">KES {(welfareDrive.raised ?? 0).toLocaleString()}</h2>
                                    <span className="text-muted-foreground pb-1">of KES {(welfareDrive.goal ?? 0).toLocaleString()}</span>
                                </div>
                                <Progress value={welfareProgress} className="mt-4 h-3" />
                                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                                    <div>
                                        <p className="font-bold text-xl">{welfareProgress.toFixed(0)}%</p>
                                        <p className="text-xs text-muted-foreground">Funded</p>
                                    </div>
                                     <div>
                                        <p className="font-bold text-xl">{welfareDrive.backers}</p>
                                        <p className="text-xs text-muted-foreground">Backers</p>
                                    </div>
                                     <div>
                                        <p className="font-bold text-xl">{welfareDrive.daysLeft}</p>
                                        <p className="text-xs text-muted-foreground">Days Left</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Gift /> Make a Contribution</CardTitle>
                                <CardDescription>Enter your M-Pesa number to receive a secure payment prompt.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (KES)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="amount" placeholder="Enter custom amount" className="pl-8" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">M-Pesa Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" placeholder="0712 345 678" className="pl-8" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="w-full" onClick={handleContribute}>
                                        <Heart className="mr-2 h-4 w-4" /> Contribute via M-Pesa
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-full bg-green-600/10 text-green-400 border-green-600/50 hover:bg-green-600/20" asChild>
                                        <a href={`https://wa.me/?text=${encodeURIComponent(welfareShareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer">
                                            <Share2 className="mr-2 h-4 w-4" /> WhatsApp
                                        </a>
                                    </Button>
                                </div>
                                {contributionMade && (
                                    <div className="p-3 bg-blue-900/50 rounded-lg text-blue-300 text-center">
                                        <p className="font-semibold">STK Push Sent!</p>
                                        <p className="text-xs mt-1">Please check your phone to authorize the M-Pesa payment.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="h-96 flex flex-col items-center justify-center text-center">
                        <ShieldCheck className="h-16 w-16 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold font-headline">No Active Welfare Drives</h3>
                        <p className="mt-2 text-sm text-muted-foreground">There are no welfare campaigns running for this Chama at the moment.</p>
                        {showManagementOptions && (
                            <Button className="mt-6">
                                <Plus className="mr-2 h-4 w-4" /> Create New Welfare Drive
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </TabsContent>
        <TabsContent value="reports" className="mt-6 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generate and view detailed financial statements for {chama.name}.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button id="report-date-range" variant={'outline'} className={cn('w-[260px] justify-start text-left font-normal', !reportDate && 'text-muted-foreground')}>
                                <Calendar className="mr-2 h-4 w-4" />
                                {reportDate?.from ? (
                                reportDate.to ? (
                                    <>{format(reportDate.from, 'LLL dd, y')} - {format(reportDate.to, 'LLL dd, y')}</>
                                ) : (
                                    format(reportDate.from, 'LLL dd, y')
                                )
                                ) : (
                                <span>Pick a date</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                initialFocus
                                mode="range"
                                defaultMonth={reportDate?.from}
                                selected={reportDate}
                                onSelect={setReportDate}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>
                        <Input
                            placeholder="Search..."
                            value={reportSearchTerm}
                            onChange={(e) => setReportSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                {reportTransactionTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </div>
                        <Button><Download className="mr-2 h-4 w-4"/> Export</Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Income</CardDescription>
                                <CardTitle className="text-2xl text-green-400">{formatAmount(reportSummary.totalIncome)}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Expense</CardDescription>
                                <CardTitle className="text-2xl text-red-400">{formatAmount(reportSummary.totalExpense)}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredReportData.map((item) => (
                            <TableRow key={item.transactionId}>
                                <TableCell>{format(new Date(item.date), 'dd MMM, yyyy')}</TableCell>
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell> <Badge variant="outline">{item.category}</Badge></TableCell>
                                <TableCell className={cn('text-right font-semibold', item.amount > 0 ? 'text-green-500' : 'text-foreground')}>{formatAmount(item.amount)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="accountability" className="mt-6 space-y-6">
           <Card>
            <CardHeader>
                <CardTitle>Accountability Dashboard</CardTitle>
                <CardDescription>Monitoring welfare drives and contribution consistency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {accountabilityDrivesAtRisk.length > 0 && (
                <Card className="bg-destructive/10 border-destructive">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle/> Drives at Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Drive Name</TableHead>
                            <TableHead>Days Left</TableHead>
                            <TableHead>Funding Progress</TableHead>
                            <TableHead>Issue</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {accountabilityDrivesAtRisk.map((drive) => (
                            <TableRow key={drive.name}>
                            <TableCell>{drive.name}</TableCell>
                            <TableCell>{drive.daysLeft}</TableCell>
                            <TableCell>
                                <Progress value={drive.progress} className="h-2" />
                                <span className="text-xs">{drive.progress}% of {drive.target}</span>
                            </TableCell>
                            <TableCell>{getRiskBadge(drive.issue)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
                )}
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Drives by Amount Raised</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChartComponent data={accountabilityTopDrivesData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} axisLine={false} tickLine={false} />
                                <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Bar dataKey="raised" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                </BarChartComponent>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Welfare Contribution Consistency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={accountabilityContributionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Line type="monotone" dataKey="contributed" stroke="hsl(var(--primary))" />
                                <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-2))" strokeDasharray="5 5"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="bi-dashboard" className="mt-6 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">Member Growth</CardTitle>
                  <CardDescription>New members joining {chama.name} over time.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChartComponent data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                      <Bar dataKey="Members" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChartComponent>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance</CardTitle>
                  <CardDescription>Monthly contributions vs. payouts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={financialPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="Contributions" stroke="hsl(var(--chart-1))" />
                      <Line type="monotone" dataKey="Payouts" stroke="hsl(var(--chart-2))" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-6 space-y-6">
            <p>Chama settings content goes here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
