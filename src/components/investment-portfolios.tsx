'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Portfolio {
  id: number;
  name: string;
  category: string;
  risk_level: string;
  roi: number;
  description: string;
  min_investment: number;
  image_url?: string;
}

export function InvestmentPortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Portfolio[]>('/investments/portfolios')
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setPortfolios(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Explore Investment Portfolios</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Explore Investment Portfolios</CardTitle>
        <CardDescription>Browse curated investment opportunities to grow your wealth.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="flex flex-col overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">{portfolio.name}</CardTitle>
                <Badge
                  variant={
                    portfolio.risk_level === 'low'
                      ? 'secondary'
                      : portfolio.risk_level === 'medium'
                        ? 'outline'
                        : 'destructive'
                  }
                  className={
                    portfolio.risk_level === 'low'
                      ? 'bg-blue-900/50 text-blue-300'
                      : portfolio.risk_level === 'medium'
                        ? 'bg-yellow-900/50 text-yellow-300'
                        : ''
                  }
                >
                  {portfolio.risk_level} Risk
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{portfolio.category}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{portfolio.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-400">{portfolio.roi}%</span>
                <span className="text-sm text-muted-foreground">Annual ROI</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Min. Investment: Ksh {portfolio.min_investment.toLocaleString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Invest Now</Button>
            </CardFooter>
          </Card>
        ))}
        {portfolios.length === 0 && (
          <div className="col-span-3 text-center text-muted-foreground py-8">
            No investment portfolios available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
