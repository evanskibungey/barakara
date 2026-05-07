
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Edit, MoreHorizontal, PlusCircle, Save, TrendingDown, UserPlus, Users, Eye, ArrowUpCircle, Mail, XCircle, PauseCircle, TrendingUp as TrendingUpIcon, Activity } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch, PaginatedData, extractRows } from '@/lib/api';
const allPermissions: string[] = [];
const roles: { role: string; permissions: string[] }[] = [];
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TIER_NAMES, calculateSubscriptionFee } from '@/lib/pricing';
import { PricingEditor } from '@/components/pricing-editor';

interface Chama { id: number; name: string; subscription_status: string; tier: string; renewal_date: string; chama_members_count?: number; }
interface Subscription { id: number; tier: string; status: string; chama?: { name: string }; renewal_date: string; }

export default function ManagementPage() {
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    apiFetch<PaginatedData<Chama>>('/chamas').then(res => {
      if (res.status === 'success' && res.data) setChamas(extractRows(res.data));
    });
    apiFetch<PaginatedData<Subscription>>('/admin/subscriptions').then(res => {
      if (res.status === 'success' && res.data) setSubscriptions(extractRows(res.data));
    });
  }, []);

    const getSubscriptionBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-900/50 text-green-300">{status}</Badge>;
      case 'overdue':
        return <Badge variant="destructive">{status}</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Platform Management
        </h1>
        <p className="text-muted-foreground">
          Oversee platform health, monitor active usage, and manage global subscriptions.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/management">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">+12 since last month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/accountability">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform MAU</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">987</div>
              <p className="text-xs text-green-400">78% engagement rate</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/management">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 284,000</div>
              <p className="text-xs text-green-400">+8.2% from last month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/accountability">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">1.2%</div>
              <p className="text-xs text-muted-foreground">vs. 1.5% last month</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
        <Tabs defaultValue="subscriptions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="platform">Platform Rules & Roles</TabsTrigger>
                <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
            </TabsList>
            <TabsContent value="platform" className="mt-6 space-y-6">
                <PricingEditor />
                <Card>
                    <CardHeader>
                        <CardTitle>Global Roles & Permissions Templates</CardTitle>
                        <CardDescription>Define granular access levels for each role. These serve as templates when creating new Chama circles, but can be customized by each Chama's administrator.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Permission</TableHead>
                                    {roles.map(role => (
                                        <TableHead key={role.role} className="text-center">{role.role}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allPermissions.map(permission => (
                                    <TableRow key={permission}>
                                        <TableCell className="font-medium">{permission}</TableCell>
                                        {roles.map(role => (
                                            <TableCell key={`${role.role}-${permission}`} className="text-center">
                                                <Checkbox 
                                                checked={role.permissions.includes(permission)}
                                                aria-label={`${role.role} ${permission} permission`}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Add New Role Template</Button>
                            <Button>Save Template</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="subscriptions" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>SaaS Subscription Monitoring</CardTitle>
                        <CardDescription>Manage and monitor all active, overdue, and canceled subscriptions for your Chama circles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Chama Name</TableHead>
                                    <TableHead>Plan Tier</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Members</TableHead>
                                    <TableHead>Total Transactions</TableHead>
                                    <TableHead>Pool Value (KES)</TableHead>
                                    <TableHead>Monthly Fee (KES)</TableHead>
                                    <TableHead>Renewal Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chamas.map(chama => (
                                    <TableRow key={chama.id}>
                                        <TableCell className="font-medium">{chama.name}</TableCell>
                                        <TableCell>{chama.tier}</TableCell>
                                        <TableCell>{getSubscriptionBadge(chama.subscription_status)}</TableCell>
                                        <TableCell>{chama.chama_members_count ?? '-'}</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>{calculateSubscriptionFee(chama.tier as 'Starter' | 'Growth' | 'Scale', chama.chama_members_count ?? 0).toLocaleString()}</TableCell>
                                        <TableCell>{chama.renewal_date}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/chamas/${chama.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                                                        </DropdownMenuItem>
                                                        <DialogTrigger asChild>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit Subscription
                                                            </DropdownMenuItem>
                                                        </DialogTrigger>
                                                        <DropdownMenuItem>
                                                            <ArrowUpCircle className="mr-2 h-4 w-4" /> Upgrade Plan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Mail className="mr-2 h-4 w-4" /> Send Reminder
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <PauseCircle className="mr-2 h-4 w-4" /> Suspend
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500">
                                                            <XCircle className="mr-2 h-4 w-4" /> Cancel Subscription
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Subscription for {chama.name}</DialogTitle>
                                                        <DialogDescription>
                                                            Modify the plan details, fee, and renewal date.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="plan" className="text-right">Plan Tier</Label>
                                                            <Select defaultValue={chama.tier}>
                                                                <SelectTrigger id="plan" className="col-span-3">
                                                                    <SelectValue placeholder="Select a plan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {TIER_NAMES.map(tier => (
                                                                        <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="renewal" className="text-right">Renewal Date</Label>
                                                            <Input id="renewal" type="date" defaultValue={chama.renewal_date ? new Date(chama.renewal_date).toISOString().split('T')[0] : ''} className="col-span-3" />
                                                        </div>
                                                         <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="status" className="text-right">Status</Label>
                                                            <Select defaultValue={chama.subscription_status}>
                                                                <SelectTrigger id="status" className="col-span-3">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Active">Active</SelectItem>
                                                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                                                    <SelectItem value="Canceled">Canceled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button type="button" variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button type="submit">Save Changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

    </div>
  );
}
