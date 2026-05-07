'use client';

import { useEffect, useState } from 'react';
import { InvestmentForm } from '@/components/investment-form';
import { InvestmentPortfolios } from '@/components/investment-portfolios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CircleDollarSign, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

interface UserInvestment {
  id: number;
  amount: number;
  status: string;
  portfolio: { roi: number };
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);

  useEffect(() => {
    Promise.all([
      apiFetch<UserInvestment[]>('/investments/user'),
      apiFetch<{ length: number }>('/investments/portfolios'),
    ]).then(([invRes, portRes]) => {
      if (invRes.status === 'success' && invRes.data) setInvestments(invRes.data);
      if (portRes.status === 'success' && Array.isArray(portRes.data))
        setPortfolioCount((portRes.data as unknown[]).length);
    });
  }, []);

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const avgRoi =
    investments.length > 0
      ? investments.reduce((s, i) => s + (i.portfolio?.roi ?? 0), 0) / investments.length
      : 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          AI-Powered Investment Marketplace
        </h1>
        <p className="text-muted-foreground">
          Generate personalized recommendations or explore curated investment portfolios.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolios</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioCount}</div>
            <p className="text-xs text-muted-foreground">Curated investment opportunities</p>
          </CardContent>
        </Card>
        <Link href="/transactions">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalInvested.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all portfolios</p>
            </CardContent>
          </Card>
        </Link>
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Annual ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{avgRoi.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all active investments</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Active Investments</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investments.length}</div>
            <p className="text-xs text-muted-foreground">Active positions</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-accent/30 border-l-4 border-accent text-accent-foreground p-4 rounded-md">
        <div className="flex">
          <div className="py-1">
            <Lightbulb className="h-5 w-5 text-primary mr-4" />
          </div>
          <div>
            <p className="font-bold">Your Personal AI Financial Analyst</p>
            <p className="text-sm">
              Answer a few questions about your financial style, and our AI will generate a detailed
              viability report and personalized investment recommendations based on your goals, risk
              tolerance, and preferences.
            </p>
          </div>
        </div>
      </div>

      <InvestmentForm />
      <InvestmentPortfolios />
    </div>
  );
}
