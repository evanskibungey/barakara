
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FileUp,
  Mail,
  MessageSquare,
  Send,
  Smartphone,
  Voicemail,
  TrendingUp,
  CheckCircle,
  BarChartHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { apiFetch, PaginatedData, extractRows } from '@/lib/api';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const broadcastHistory = [
  {
    id: '1',
    chama: 'Nairobi Investors',
    message: 'Reminder: Monthly meeting this Friday at 6 PM.',
    channels: ['In-App', 'SMS'],
    date: '2024-07-28',
    status: 'Sent',
  },
  {
    id: '2',
    chama: 'All Chamas',
    message: 'Please review the new dividend payout policy document.',
    channels: ['In-App', 'Email', 'PDF'],
    date: '2024-07-25',
    status: 'Sent',
  },
  {
    id: '3',
    chama: 'Kisumu Innovators',
    message: 'Voice note from the chairperson regarding the upcoming elections.',
    channels: ['Audio'],
    date: '2024-07-22',
    status: 'Sent',
  },
  {
    id: '4',
    chama: 'Mombasa Traders',
    message: 'Urgent: Contribution deadline is tomorrow.',
    channels: ['SMS', 'WhatsApp'],
    date: '2024-07-20',
    status: 'Sent',
  },
  {
    id: '5',
    chama: 'Nairobi Investors',
    message: 'Q2 financial summary is now available.',
    channels: ['In-App', 'Email'],
    date: '2024-07-18',
    status: 'Sent',
  }
];

const scheduledMessages = [
    {
        id: 'sched-1',
        audience: 'Peter Kimani',
        message: 'Dear Peter Kimani, this is a friendly reminder that your contribution is due.',
        channels: ['SMS', 'In-App'],
        scheduledFor: '2024-08-15 10:00 AM',
    },
    {
        id: 'sched-2',
        audience: 'Mombasa Traders',
        message: 'Reminder: The upcoming payout schedule has been posted in the documents section.',
        channels: ['In-App', 'Email'],
        scheduledFor: '2024-08-20 09:00 AM',
    }
];

const getChannelIcon = (channel: string) => {
    switch (channel) {
        case 'In-App': return <MessageSquare className="h-3 w-3" />;
        case 'SMS': return <Smartphone className="h-3 w-3" />;
        case 'WhatsApp': return <MessageSquare className="h-3 w-3" />;
        case 'Email': return <Mail className="h-3 w-3" />;
        case 'PDF': return <FileUp className="h-3 w-3" />;
        case 'Audio': return <Voicemail className="h-3 w-3" />;
        default: return <MessageSquare className="h-3 w-3" />;
    }
};

const channelUsageData = broadcastHistory
  .flatMap(b => b.channels)
  .reduce((acc, channel) => {
    const existing = acc.find(c => c.name === channel);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: channel, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[])
  .sort((a, b) => b.count - a.count);

const topChannel = channelUsageData[0]?.name || 'N/A';
const maxUsage = Math.max(...channelUsageData.map(c => c.count), 1);

interface Chama { id: number; name: string; }

export default function CommunicationsPage() {
  const [chamas, setChamas] = useState<Chama[]>([]);
  useEffect(() => {
    apiFetch<PaginatedData<Chama>>('/chamas').then(res => {
      if (res.status === 'success' && res.data) setChamas(extractRows(res.data));
    });
  }, []);

    const getStatusBadge = (status: string) => {
        if (status === 'Sent') {
            return <Badge variant="secondary" className="bg-green-900/50 text-green-300">Sent</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
    }
    
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Communications Hub
        </h1>
        <p className="text-muted-foreground">
          Broadcast messages and analyze engagement across your Chama circles.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="#broadcast-history">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Broadcasts</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{broadcastHistory.length}</div>
                <p className="text-xs text-muted-foreground">in the last 30 days</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="#broadcast-history">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">98.7%</div>
                <p className="text-xs text-green-400">+0.5% from last month</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="#broadcast-history">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">15.3%</div>
                <p className="text-xs text-muted-foreground">Based on link clicks & replies</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="#broadcast-history">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Channel</CardTitle>
                <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{topChannel}</div>
                <p className="text-xs text-muted-foreground">Most frequently used channel</p>
            </CardContent>
            </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compose Broadcast</CardTitle>
            <CardDescription>
              Create and send a new message to your members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="chama-select">Target Audience</Label>
              <Select>
                <SelectTrigger id="chama-select">
                  <SelectValue placeholder="Select an audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-chamas">All Chamas</SelectItem>
                  <SelectItem value="all-investors">All Investors</SelectItem>
                  <SelectItem value="all-fund-drive-users">All Fund Drive Users</SelectItem>
                  <SelectItem value="all-ngo-suite-users">All NGO Suite Users</SelectItem>
                  {chamas.map(chama => (
                    <SelectItem key={chama.id} value={String(chama.id)}>{chama.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-4">
              <Label>Attachments & Format</Label>
              <div className="flex items-center justify-between p-3 border rounded-md">
                 <Label htmlFor="audio-file" className='flex items-center gap-2 cursor-pointer text-sm'>
                    <Voicemail className='h-4 w-4 text-primary' />
                    <span>Record/Upload Audio</span>
                </Label>
                <Input id="audio-file" type="file" accept="audio/*" className='hidden'/>
              </div>
               <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="pdf-file" className='flex items-center gap-2 cursor-pointer text-sm'>
                    <FileUp className='h-4 w-4 text-primary' />
                    <span>Attach PDF</span>
                </Label>
                <Input id="pdf-file" type="file" accept=".pdf" className='hidden'/>
              </div>
            </div>
            <div className="space-y-4">
              <Label>Delivery Channels</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="in-app" />
                  <Label htmlFor="in-app" className="flex items-center gap-2 font-normal">
                    <MessageSquare className="h-4 w-4 text-primary" /> In-App
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms" />
                  <Label htmlFor="sms" className="flex items-center gap-2 font-normal">
                    <Smartphone className="h-4 w-4 text-primary" /> SMS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="whatsapp" />
                  <Label htmlFor="whatsapp" className="flex items-center gap-2 font-normal">
                    <MessageSquare className="h-4 w-4 text-primary" /> WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2 font-normal">
                    <Mail className="h-4 w-4 text-primary" /> Email
                  </Label>
                </div>
              </div>
            </div>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" /> Broadcast Message
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Channel Usage</CardTitle>
            <CardDescription>
              Broadcast volume by channel in the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             {channelUsageData.map(channel => {
                const Icon = getChannelIcon(channel.name);
                return (
                    <div key={channel.name} className="flex items-center gap-4">
                        <div className="w-24 shrink-0 flex items-center gap-2 text-sm text-muted-foreground">
                            {Icon}
                            {channel.name}
                        </div>
                        <div className="flex-grow">
                            <Progress value={(channel.count / maxUsage) * 100} />
                        </div>
                        <div className="w-12 text-right font-bold">{channel.count}</div>
                    </div>
                )
             })}
          </CardContent>
        </Card>
      </div>
      
        <Tabs defaultValue="sent" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sent">Sent Messages</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="sent">
                <Card id="broadcast-history">
                    <CardHeader>
                        <CardTitle>Broadcast History</CardTitle>
                        <CardDescription>A log of all previously sent messages.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Audience</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Channels</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {broadcastHistory.map(b => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-medium">{b.chama}</TableCell>
                                        <TableCell className="text-muted-foreground max-w-sm truncate">{b.message}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {b.channels.map(c => (
                                                    <div key={c} className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        {getChannelIcon(c)}
                                                        <span>{c}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{b.date}</TableCell>
                                        <TableCell>{getStatusBadge(b.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="scheduled">
                 <Card>
                    <CardHeader>
                        <CardTitle>Scheduled Messages</CardTitle>
                        <CardDescription>A log of all messages scheduled for future delivery.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Audience</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Channels</TableHead>
                                    <TableHead>Scheduled For</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scheduledMessages.map(msg => (
                                    <TableRow key={msg.id}>
                                        <TableCell className="font-medium">{msg.audience}</TableCell>
                                        <TableCell className="text-muted-foreground max-w-sm truncate">{msg.message}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {msg.channels.map(c => (
                                                    <div key={c} className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        {getChannelIcon(c)}
                                                        <span>{c}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{msg.scheduledFor}</TableCell>
                                        <TableCell><Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300">Scheduled</Badge></TableCell>
                                    </TableRow>
                                ))}
                                {scheduledMessages.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No messages are currently scheduled.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
