// @ts-nocheck
'use client';

import { notFound, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { DollarSign, Gift, Heart, MessageSquare, Phone, ShieldCheck, Share2, HelpCircle, XCircle, Edit, Check, X, Mail, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function DriveDetailPage() {
  const params = useParams();
  const [drive, setDrive] = useState<any>(null);
  const [backers, setBackers] = useState<any[]>([]);
  const [driveLoading, setDriveLoading] = useState(true);
  const [contributionMade, setContributionMade] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
    apiFetch<any>(`/crowdfunding/${params.id}`).then(res => {
      if (res.status === 'success' && res.data) {
        setDrive({ ...res.data, managers: res.data.drive_managers ?? [] });
      }
    }).finally(() => setDriveLoading(false));
    apiFetch<any[]>(`/crowdfunding/${params.id}/backers`).then(res => {
      if (res.status === 'success' && res.data) setBackers(res.data);
    });
  }, [params.id]);

  if (driveLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading drive...</div>;
  }

  if (!drive) {
    notFound();
  }

  const progress = drive.goal > 0 ? (drive.raised / drive.goal) * 100 : 0;
  const daysLeft = drive.campaign_end ? Math.max(0, Math.ceil((new Date(drive.campaign_end).getTime() - new Date().getTime()) / 86400000)) : 0;
  const recentDonations = backers.slice(0, 3);
  
  const handleContribute = () => {
    setContributionMade(true);
    // Simulate cooling-off period for demo
    setTimeout(() => {
        setContributionMade(false); 
    }, 10000); // Reset after 10 seconds for demo purposes
  }

  const shareText = `Support this cause: ${drive.title}`;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader className="p-0">
                {drive.image && (
                    <div className="relative aspect-video w-full">
                    <Image
                        src={drive.image.imageUrl}
                        alt={drive.image.description}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={drive.image.imageHint}
                    />
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">{progress.toFixed(0)}% Funded</Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/crowdfunding/${drive.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Drive
                      </Link>
                    </Button>
                </div>

                <h1 className="font-headline text-3xl font-bold tracking-tight">{drive.title}</h1>
                <p className="text-muted-foreground mt-2">Created by <span className="font-semibold text-primary">{drive.creator}</span></p>
                <p className="mt-4 text-muted-foreground">{drive.description}</p>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Campaign Organizers</CardTitle>
            <CardDescription>Contact the organizers for any questions about this drive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {drive.managers.map(manager => (
              <div key={manager.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{manager.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {manager.contactType === 'Phone' ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                        <a href={manager.contactType === 'Phone' ? `tel:${manager.contactInfo}` : `mailto:${manager.contactInfo}`} className="hover:underline">
                            {manager.contactInfo}
                        </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>A heartfelt thank you to our recent supporters!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentDonations.map(donation => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{donation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{donation.name}</p>
                                <p className="text-sm text-muted-foreground">{donation.date}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-lg text-green-400">KES {Math.abs(donation.amount).toLocaleString()}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Updates</CardTitle>
            <CardDescription>Stay informed with the latest news and progress from the campaign organizers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex gap-4">
                  <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?u=jane_doe" alt="Creator" />
                      <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className='w-full'>
                      <Textarea placeholder="Post an update to your backers..." />
                      <Button className="mt-2">Post Update</Button>
                  </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <MessageSquare className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">Jane Doe</span> &middot; <span className="text-xs">2 days ago</span>
                      </p>
                      <p className="mt-1">
                        We are so grateful for the incredible support! We've already raised enough to purchase the initial set of books for the new library. Thank you all for your generosity!
                      </p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <MessageSquare className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">Jane Doe</span> &middot; <span className="text-xs">1 week ago</span>
                      </p>
                      <p className="mt-1">
                        The campaign is officially live! We are excited to embark on this journey to build a new library for our community's children. Every contribution, big or small, makes a difference.
                      </p>
                    </div>
                 </div>
              </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-24">
            <CardContent className="p-6">
                <div className="flex items-end gap-2">
                    <h2 className="text-4xl font-bold">KES {drive.raised.toLocaleString()}</h2>
                    <span className="text-muted-foreground pb-1">raised of KES {drive.goal.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="mt-4 h-3" />
                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                    <div>
                        <p className="font-bold text-xl">{progress.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">Funded</p>
                    </div>
                     <div>
                        <p className="font-bold text-xl">148</p>
                        <p className="text-xs text-muted-foreground">Backers</p>
                    </div>
                     <div>
                        <p className="font-bold text-xl">{daysLeft}</p>
                        <p className="text-xs text-muted-foreground">Days Left</p>
                    </div>
                </div>
            </CardContent>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gift /> Make a Contribution</CardTitle>
                <CardDescription>Enter your M-Pesa number to receive a secure payment prompt on your phone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-900/50 rounded-lg text-yellow-300 text-sm">
                    As per CMA guidelines, the maximum investment for a retail investor is KES 100,000.
                </div>
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
                 <div className="flex items-center space-x-2">
                    <Checkbox id="risk-acknowledgement" />
                    <Label htmlFor="risk-acknowledgement" className="text-xs text-muted-foreground">
                        I have read and understood the
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <span className="text-primary underline px-1 cursor-pointer">Risk Acknowledgement Form.</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Investments in startups and early-stage businesses are high-risk. You may lose your entire investment.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                </div>
                <div className="flex gap-2">
                    <Button className="w-full" onClick={handleContribute}>
                        <Heart className="mr-2 h-4 w-4" /> Contribute via M-Pesa
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="w-full bg-green-600/10 text-green-400 border-green-600/50 hover:bg-green-600/20" asChild>
                        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer">
                            <Share2 className="mr-2 h-4 w-4" /> WhatsApp
                        </a>
                    </Button>
                    <Button variant="outline" className="w-full bg-blue-600/10 text-blue-400 border-blue-600/50 hover:bg-blue-600/20" asChild>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
                           <FacebookIcon className="mr-2 h-4 w-4 fill-current" /> Facebook
                        </a>
                    </Button>
                    <Button variant="outline" className="w-full bg-gray-600/10 text-gray-400 border-gray-600/50 hover:bg-gray-600/20" asChild>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                            <XIcon className="mr-2 h-4 w-4 fill-current" /> X
                        </a>
                    </Button>
                </div>
                {contributionMade && (
                    <div className="p-3 bg-blue-900/50 rounded-lg text-blue-300 text-center">
                        <p className="font-semibold">STK Push Sent!</p>
                        <p className="text-xs mt-1">Please check your phone to authorize the M-Pesa payment. You have 48 hours to cancel this contribution if you change your mind.</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-blue-300 hover:bg-blue-800/50 hover:text-white" onClick={() => setContributionMade(false)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Contribution
                        </Button>
                    </div>
                )}
                <div className="flex items-start gap-3 text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p>
                        Your contribution is held securely in an escrow account. Funds are only released to the creator if the goal is met. If the goal is not met, your contribution will be automatically refunded.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
