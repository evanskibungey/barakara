
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  CheckCircle,
  Pencil,
  User,
  Banknote,
  Bell,
  Lock,
  ArrowRight,
  HelpCircle,
  Clock,
  CircleDollarSign,
  Users,
  TrendingUp,
  Award,
  LineChart,
  Lightbulb,
  BookCopy,
  Mail,
  Calendar,
  CircleUserRound,
  DollarSign,
  Wallet,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { apiFetch } from '@/lib/api';
const upcomingEvents: any[] = [];
const walletTransactions: any[] = [];
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function SettingsPage() {

    const [payoutCountdown, setPayoutCountdown] = useState('');
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const payoutDate = new Date('2024-09-15T10:00:00');
        const interval = setInterval(() => {
            const now = new Date();
            const distance = payoutDate.getTime() - now.getTime();

            if (distance < 0) {
                clearInterval(interval);
                setPayoutCountdown('Payout processing');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            setPayoutCountdown(`${days}d ${hours}h ${minutes}m`);
        }, 1000);

        return () => clearInterval(interval);
    }, [isMounted]);
    
    const handleApology = () => {
        toast({
            title: "Apology Sent",
            description: "Your meeting apology has been recorded and the chairperson notified.",
        });
    }

    const formatAmount = (amount: number) => {
        const formatted = `KES ${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return amount > 0 ? `+ ${formatted}` : `- ${formatted}`;
    }


    const recentCommunications = [
        { id: 1, title: "Q3 Dividend Payout Announcement", date: "2 days ago", snippet: "We are pleased to announce the Q3 dividend payout will be disbursed on..." },
        { id:2, title: "New Investment Portfolio Added", date: "4 days ago", snippet: "Explore the new 'Green Energy Co-op' portfolio in the marketplace..." },
        { id:3, title: "Scheduled Maintenance Notice", date: "1 week ago", snippet: "The platform will be unavailable for scheduled maintenance on..." },
    ];


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information, security, and banking details. Keep
          your profile updated for seamless transactions.
        </p>
      </div>

      {/* User Header */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="Juma Kamau"
              />
              <AvatarFallback>JK</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h2 className="text-2xl font-bold">Juma Kamau</h2>
              <Badge className='bg-green-500/20 text-green-300 border-green-500/30'>ACTIVE</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Member ID: BK-8829-KE • Joined March 2023
            </p>
            <div className="flex gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="secondary" className='bg-card'>
                <CheckCircle className="mr-1 h-3 w-3 text-green-400" />
                KYC Approved
              </Badge>
              <Badge variant="secondary" className='bg-card'>
                <ShieldCheck className="mr-1 h-3 w-3 text-green-400" />
                2FA Enabled
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
      
        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Clock className="text-primary"/> Next Payout</CardTitle>
                    <CardDescription>Track your upcoming Chama payout from the Nairobi Investors circle.</CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-[1fr,auto,auto] items-center gap-6'>
                    <div className='flex items-center justify-center h-24 w-full bg-muted/50 rounded-lg'>
                        <div className='text-center'>
                           <div className="text-sm text-muted-foreground">Countdown</div>
                           <div className="text-2xl font-bold font-mono">{isMounted ? payoutCountdown : 'Loading...'}</div>
                        </div>
                    </div>
                    <div className='text-center'>
                        <div className="text-sm text-muted-foreground">Expected Amount</div>
                        <div className="text-lg font-bold">KES 550,000</div>
                    </div>
                    <div className='text-center'>
                        <div className="text-sm text-muted-foreground">Your Position</div>
                        <div className="text-lg font-bold">#3 of 12</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Award className="text-primary"/> My Performance & Investments</CardTitle>
                    <CardDescription>View your member ranking and explore investment opportunities.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground">Your Current Rank</p>
                            <p className="text-2xl font-bold">#4</p>
                        </div>
                        <Button variant="link" className="p-0 h-auto self-start" asChild>
                            <Link href="/accountability">View BI Dashboard <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    <div className="flex flex-col justify-between p-4 bg-muted/50 rounded-lg">
                         <div>
                            <p className="text-sm text-muted-foreground">Investment Readiness</p>
                            <p className="text-2xl font-bold text-primary">Eligible</p>
                        </div>
                        <Button variant="link" className="p-0 h-auto self-start" asChild>
                            <Link href="/investments">Explore Marketplace <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>


      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="personal">
            <User className="mr-2 h-4 w-4" /> Personal Info
          </TabsTrigger>
           <TabsTrigger value="wallet">
            <Wallet className="mr-2 h-4 w-4" /> Wallet
          </TabsTrigger>
          <TabsTrigger value="financial">
            <Banknote className="mr-2 h-4 w-4" /> Financial
          </TabsTrigger>
          <TabsTrigger value="learning">
            <BookCopy className="mr-2 h-4 w-4" /> Learning
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Personal Details</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Legal Name</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        defaultValue="Juma Kamau"
                        disabled
                        className="pr-8 bg-muted/50 border-muted-foreground/20"
                      />
                      <Lock className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Name locked due to KYC verification.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="juma.kamau@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (M-PESA)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="countryCode"
                        defaultValue="+254"
                        className="w-16"
                      />
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue="712 345 678"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">National ID / Passport</Label>
                    <div className="relative">
                      <Input
                        id="nationalId"
                        defaultValue="•••• •••• 9281"
                      />
                      <Button
                        variant="link"
                        size="sm"
                        className="absolute right-1 top-1 h-auto px-2"
                      >
                        Reveal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Residential Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" defaultValue="Apartment 4B, Green Heights, Kilimani" />
                   </div>
                   <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                           <Label htmlFor="city">City / Town</Label>
                            <Select defaultValue="nairobi">
                                <SelectTrigger id="city">
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nairobi">Nairobi</SelectItem>
                                    <SelectItem value="mombasa">Mombasa</SelectItem>
                                    <SelectItem value="kisumu">Kisumu</SelectItem>
                                </SelectContent>
                            </Select>
                       </div>
                       <div className="space-y-2">
                           <Label htmlFor="county">County</Label>
                           <Select defaultValue="nairobi-city">
                                <SelectTrigger id="county">
                                    <SelectValue placeholder="Select a county" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nairobi-city">Nairobi City</SelectItem>
                                    <SelectItem value="mombasa-county">Mombasa</SelectItem>
                                    <SelectItem value="kisumu-county">Kisumu</SelectItem>
                                </SelectContent>
                            </Select>
                       </div>
                   </div>
                </CardContent>
              </Card>

            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-sans flex items-center gap-2">
                            <Calendar /> Upcoming Events
                        </CardTitle>
                        <CardDescription>
                            Your schedule of meetings, payouts, and deadlines.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingEvents.map((event) => {
                            const Icon = event.type === 'Meeting' ? CircleUserRound : event.type === 'Payout' ? DollarSign : Bell;
                            return (
                                <div key={event.id} className="flex items-start gap-4 p-3 border-b last:border-b-0">
                                    <Icon className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold">{event.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {isMounted ? new Date(event.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long' }) : '...'} - {event.chama}
                                        </p>
                                        {event.type === 'Meeting' && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                                                        Can't make it?
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Request Meeting Apology</DialogTitle>
                                                        <DialogDescription>
                                                           This will notify the chairperson of {event.chama} that you will be unable to attend the meeting on {isMounted ? new Date(event.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long' }) : null}. Please provide a reason for your absence. Three missed meetings without a valid reason may result in a fine.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                     <div className="grid gap-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="apology-reason" className="sr-only">
                                                                Reason for absence
                                                            </Label>
                                                            <Textarea id="apology-reason" placeholder="Please provide a brief explanation for your absence..." />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button type="button" variant="ghost">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button type="button" onClick={handleApology}>Send Apology</Button>
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
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-4xl font-bold text-primary">85%</span>
                            <span className="text-sm text-muted-foreground font-semibold">Completed</span>
                        </div>
                        <Progress value={85} className="mb-4 h-3" />
                        <p className="text-sm text-muted-foreground mb-4">Complete your profile to unlock higher transaction limits and faster withdrawals.</p>
                        <Button className="w-full">Complete Now</Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="wallet" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wallet</CardTitle>
                  <CardDescription>Manage your funds and payouts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">Available to Withdraw</p>
                    <p className="text-3xl font-bold">KES 550,000.00</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Withdraw Funds</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Initiate Withdrawal</DialogTitle>
                        <DialogDescription>
                          Select a destination and amount to withdraw. Funds will be sent within 24 hours.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="withdraw-amount">Amount (KES)</Label>
                          <Input id="withdraw-amount" type="number" placeholder="e.g., 50000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination">Destination</Label>
                          <Select>
                            <SelectTrigger id="destination">
                              <SelectValue placeholder="Select destination account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mpesa">M-Pesa: *******678</SelectItem>
                              <SelectItem value="kcb">KCB Bank: ********4492</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button>Confirm Withdrawal</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Statement</CardTitle>
                  <CardDescription>A log of all your recent wallet transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {walletTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                          <TableCell className="font-medium flex items-center gap-2">
                            {tx.type === 'deposit' ? <ArrowDown className="h-4 w-4 text-green-400" /> : <ArrowUp className="h-4 w-4 text-red-400" />}
                            {tx.description}
                          </TableCell>
                          <TableCell className={cn("text-right font-semibold", tx.type === 'deposit' ? 'text-green-400' : 'text-red-400')}>
                            {formatAmount(tx.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="financial">
            <Card>
                <CardHeader>
                    <CardTitle>Financial & Banking</CardTitle>
                    <CardDescription>Manage your linked bank accounts and payment methods.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-sm">
                        M-PESA
                      </div>
                      <div>
                        <p className="font-semibold">Safaricom M-PESA</p>
                        <p className="text-sm text-muted-foreground">
                          *******678 (Primary)
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400/50 bg-green-900/30">VERIFIED</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                       <div className="bg-blue-800 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                        KCB
                      </div>
                      <div>
                        <p className="font-semibold">KCB Bank Kenya</p>
                        <p className="text-sm text-muted-foreground">
                          ********4492
                        </p>
                      </div>
                    </div>
                     <Button variant="ghost" size="icon"><Pencil className="h-4 w-4"/></Button>
                  </div>
                   <Button>Link New Account</Button>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="learning" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning & Development</CardTitle>
              <CardDescription>Track your progress and certifications from the Learning Hub.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-4">Courses in Progress</h4>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Introduction to Investing</Label>
                            <Progress value={40} />
                        </div>
                        <div className="space-y-2">
                            <Label>Small Business Financing</Label>
                            <Progress value={50} />
                        </div>
                         <Button variant="outline" asChild>
                            <Link href="/learning">Go to Learning Hub</Link>
                        </Button>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Completed Certificates</h4>
                    <div className="space-y-3">
                         <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Award className="h-5 w-5 text-primary" />
                            <p className="font-semibold">Fundamentals of Budgeting</p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Award className="h-5 w-5 text-primary" />
                            <p className="font-semibold">Understanding Debt Management</p>
                        </div>
                        <Button variant="outline" asChild>
                             <Link href="/learning">View All Certificates</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and two-factor authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                  <div>
                      <h4 className="font-semibold">Two-Factor Authentication (2FA)</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch defaultChecked />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div>
                        <Label htmlFor="email-alerts-full" className="font-semibold">Email Alerts</Label>
                        <p className="text-xs text-muted-foreground">Transaction receipts and summaries.</p>
                    </div>
                    <Switch id="email-alerts-full" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div>
                        <Label htmlFor="sms-notifications-full" className="font-semibold">SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground">Security codes and important alerts.</p>
                    </div>
                    <Switch id="sms-notifications-full" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div>
                        <Label htmlFor="marketing-full" className="font-semibold">Marketing & Promotions</Label>
                        <p className="text-xs text-muted-foreground">Receive offers, updates, and newsletters.</p>
                    </div>
                    <Switch id="marketing-full" />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div>
                        <Label htmlFor="chama-updates" className="font-semibold">Chama Circle Updates</Label>
                        <p className="text-xs text-muted-foreground">Notifications about your Chama activities.</p>
                    </div>
                    <Switch id="chama-updates" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div>
                        <Label htmlFor="drive-updates" className="font-semibold">Milestone Drive Updates</Label>
                        <p className="text-xs text-muted-foreground">Updates on crowdfunding campaigns.</p>
                    </div>
                    <Switch id="drive-updates" defaultChecked />
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
