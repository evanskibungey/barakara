
'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import {
  File,
  Calendar as CalendarIcon,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect } from 'react';
import { apiFetch } from '@/lib/api';
const financialReportData: any[] = [];
const failedDrivesData: any[] = [];
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 1),
    to: new Date(2023, 9, 31),
  });

  const totalRevenue = financialReportData
    .filter(d => d.type === 'Income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = financialReportData
    .filter(d => d.type === 'Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue + totalExpenses;

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

  const getRefundStatusBadge = (status: string) => {
    switch (status) {
        case 'Pending':
            return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">{status}</Badge>;
        case 'Processed':
            return <Badge variant="secondary" className="bg-green-900/50 text-green-300">{status}</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
  };


  const formatAmount = (amount: number) => {
    const formatted = `KES ${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    return amount > 0 ? `+ ${formatted}` : `- ${formatted}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Financial Reports
          </h1>
          <p className="text-muted-foreground">
            Generate and view detailed financial statements and compliance reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <File className="mr-2 h-4 w-4" /> Export as PDF
          </Button>
          <Button>
            <File className="mr-2 h-4 w-4" /> Export as Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/transactions">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                KES {totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/transactions">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                KES {Math.abs(totalExpenses).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">+5.1% from last month</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/transactions">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                KES {netProfit.toLocaleString()}
                </div>
                <p
                className={cn(
                    'text-xs',
                    netProfit > 0 ? 'text-green-500' : 'text-red-500'
                )}
                >
                {netProfit > 0 ? '+' : ''}22.4% from last month
                </p>
            </CardContent>
            </Card>
        </Link>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
            <Card>
                <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Transactions</CardTitle>
                    <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                            'w-[260px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, 'LLL dd, y')} -{' '}
                                {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                            ) : (
                            <span>Pick a date</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Search description..."
                        className="pl-8"
                        />
                    </div>
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {financialReportData.map(item => (
                        <TableRow key={item.transactionId}>
                        <TableCell className="font-mono text-xs">
                            {item.transactionId}
                        </TableCell>
                        <TableCell>
                            {format(new Date(item.date), 'dd MMM, yyyy')}
                        </TableCell>
                        <TableCell className="font-medium">
                            {item.description}
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{getTypeBadge(item.type)}</TableCell>
                        <TableCell
                            className={cn(
                            'text-right font-semibold',
                            item.amount > 0 ? 'text-green-500' : 'text-red-500'
                            )}
                        >
                            {formatAmount(item.amount)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
                <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                    Showing 1 to {financialReportData.length} of {financialReportData.length} results
                </div>
                <Pagination>
                    <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                        1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                    </PaginationContent>
                </Pagination>
                </div>
            </Card>
        </TabsContent>
        <TabsContent value="refunds">
            <Card>
                <CardHeader>
                    <CardTitle>Pending & Processed Refunds</CardTitle>
                    <CardDescription>
                        Per CMA regulations, refunds for failed drives must be processed within 48 hours of campaign expiry.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Drive Title</TableHead>
                                <TableHead>Campaign End Date</TableHead>
                                <TableHead>Refund Deadline</TableHead>
                                <TableHead>Total to Refund (KES)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {failedDrivesData.map(drive => (
                                <TableRow key={drive.id}>
                                    <TableCell className="font-medium">{drive.title}</TableCell>
                                    <TableCell>{drive.endDate}</TableCell>
                                    <TableCell className="text-red-400">{drive.refundDeadline}</TableCell>
                                    <TableCell>{drive.amountToRefund.toLocaleString()}</TableCell>
                                    <TableCell>{getRefundStatusBadge(drive.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" disabled={drive.status !== 'Pending'}>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Process Refunds
                                        </Button>
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
