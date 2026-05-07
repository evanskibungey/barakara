'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Banknote, Download, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { apiFetch, PaginatedData, extractRows } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Transaction {
  id: number;
  description: string;
  type: string;
  reference_id: string;
  status: string;
  amount: number;
  created_at: string;
}

const transactionTypes = ['All', 'Contribution', 'Loan', 'Withdrawal', 'Membership Fee', 'Investment', 'Dividend'];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState({ total: 0, current_page: 1, last_page: 1 });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (filter !== 'All') params.set('type', filter);
    if (search) params.set('search', search);
    apiFetch<PaginatedData<Transaction>>(`/transactions?${params}`).then((res) => {
      if (res.status === 'success' && res.data) {
        setTransactions(extractRows(res.data));
        const paged = res.data as any;
        setMeta({
          total: paged?.total ?? 0,
          current_page: paged?.current_page ?? 1,
          last_page: paged?.last_page ?? 1,
        });
      }
    }).finally(() => setLoading(false));
  }, [filter, page, search]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-900/50 text-green-300">● Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-orange-900/50 text-orange-300">● Pending</Badge>;
      case 'failed':
        return <Badge variant="secondary" className="bg-red-900/50 text-red-300">● Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    const formatted = `Ksh ${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    return amount >= 0 ? `+ ${formatted}` : `- ${formatted}`;
  };

  const inflows = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const outflows = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage your financial activity across all circles, drives, and NGO suites.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Banknote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Ksh {(inflows - outflows).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inflows</CardTitle>
            <div className="p-2 bg-primary/10 rounded-md">
              <ArrowDown className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {inflows.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outflows</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-md">
              <ArrowUp className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {outflows.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {transactionTypes.map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => { setFilter(type); setPage(1); }}
            className={cn(filter === type && 'bg-primary/10 text-primary hover:bg-primary/20')}
          >
            {type}
          </Button>
        ))}
        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ID or description..."
            className="pl-8 w-64"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center',
                          transaction.amount >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                        )}>
                          {transaction.amount >= 0
                            ? <ArrowDown className="h-5 w-5 text-green-500" />
                            : <ArrowUp className="h-5 w-5 text-red-500" />
                          }
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString('en-KE', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className="font-mono text-xs">{transaction.reference_id}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className={cn(
                      'text-right font-semibold',
                      transaction.amount >= 0 ? 'text-green-400' : 'text-foreground'
                    )}>
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {transactions.length} of {meta.total} results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {meta.current_page}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page < meta.last_page) setPage(page + 1); }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
