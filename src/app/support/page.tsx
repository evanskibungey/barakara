'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  FileText,
  HelpCircle,
  LifeBuoy,
  LineChart,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: { [key: string]: React.ElementType } = {
  Rocket,
  DollarSign,
  ShieldCheck,
  LineChart,
  BookOpen,
};

interface SupportTicket {
  id: number;
  subject: string;
  category: string;
  status: string;
  updated_at: string;
}

interface KbCategory {
  id: number;
  title: string;
  description: string;
  icon: string;
  articles: Array<{ id: number; title: string }>;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [kbCategories, setKbCategories] = useState<KbCategory[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: SupportTicket[] }>('/support/tickets'),
      apiFetch<KbCategory[]>('/support/knowledge-base'),
      apiFetch<Faq[]>('/support/faqs'),
    ]).then(([ticketsRes, kbRes, faqsRes]) => {
      if (ticketsRes.status === 'success' && ticketsRes.data)
        setTickets(ticketsRes.data.data ?? (ticketsRes.data as unknown as SupportTicket[]));
      if (kbRes.status === 'success' && kbRes.data) setKbCategories(kbRes.data);
      if (faqsRes.status === 'success' && faqsRes.data) setFaqs(faqsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const answeredTickets = tickets.filter((t) => t.status === 'answered').length;
  const kbArticles = kbCategories.reduce((acc, cat) => acc + (cat.articles?.length ?? 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'answered':
        return <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">Answered</Badge>;
      case 'open':
        return <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">Open</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-green-900/50 text-green-300">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
          <LifeBuoy className="h-8 w-8" />
          Support Center
        </h1>
        <p className="text-muted-foreground">Find answers, tutorials, and get help from our team.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Answered Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{answeredTickets}</div>
            <p className="text-xs text-muted-foreground">Responses sent</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KB Articles</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kbArticles}</div>
            <p className="text-xs text-muted-foreground">Help articles available</p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FAQs</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faqs.length}</div>
            <p className="text-xs text-muted-foreground">Common questions answered</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="knowledge-base" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge-base">
            <BookOpen className="mr-2 h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Ticket className="mr-2 h-4 w-4" />
            My Support Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-base" className="mt-6">
          <Card>
            <CardHeader className="items-center text-center">
              <CardTitle className="font-headline text-2xl">How can we help?</CardTitle>
              <CardDescription>Search our articles or browse by category.</CardDescription>
              <div className="relative w-full max-w-lg pt-4">
                <Input placeholder="Search for articles..." className="h-12 text-base" />
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {kbCategories.map((category) => {
                    const Icon = iconMap[category.icon] ?? BookOpen;
                    return (
                      <Card key={category.id} className="hover:bg-muted/50 transition-colors">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-primary" />
                            <CardTitle className="text-lg font-headline">{category.title}</CardTitle>
                          </div>
                          <CardDescription className="pt-2">{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {(category.articles ?? []).map((article) => (
                              <li key={article.id}>
                                <Link
                                  href="#"
                                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>{article.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              <div>
                <h3 className="font-headline text-xl font-semibold mb-4">
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={String(faq.id)}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Support Tickets</CardTitle>
                <CardDescription>Track and manage your requests for assistance.</CardDescription>
              </div>
              <Button>
                <Ticket className="mr-2 h-4 w-4" /> Create New Ticket
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-xs">#{ticket.id}</TableCell>
                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                        <TableCell>{ticket.category}</TableCell>
                        <TableCell>
                          {new Date(ticket.updated_at).toLocaleDateString('en-KE')}
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tickets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No support tickets yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
