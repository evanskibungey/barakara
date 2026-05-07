
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Image as ImageIcon, Share2, Check, Clipboard, Phone, Banknote, Landmark, ShieldCheck, Users, UserPlus, X, DollarSign, Mail, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Manager = {
    id: string;
    name: string;
    contactType: 'Phone' | 'Email';
    contactInfo: string;
};

export default function NewDrivePage() {
  const [loading, setLoading] = useState(false);
  const [driveCreated, setDriveCreated] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  
  const newManagerNameRef = useRef<HTMLInputElement>(null);
  const [newManagerContactType, setNewManagerContactType] = useState<'Phone' | 'Email'>('Phone');
  const newManagerContactInfoRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const driveTitle = formData.get('drive-title') as string;
    const slug = driveTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 50);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setDriveCreated(true);
      setShareableLink(`${window.location.origin}/crowdfunding/${slug}`);
      toast({
        title: "Drive Created Successfully!",
        description: "Your new milestone drive is now live.",
      });
    }, 1500);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "You can now share the drive link.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleAddManager = () => {
    const name = newManagerNameRef.current?.value;
    const contactInfo = newManagerContactInfoRef.current?.value;

    if (name && contactInfo) {
      setManagers([
        ...managers,
        {
          id: `manager-${Date.now()}`,
          name,
          contactType: newManagerContactType,
          contactInfo,
        },
      ]);
      if (newManagerNameRef.current) newManagerNameRef.current.value = '';
      if (newManagerContactInfoRef.current) newManagerContactInfoRef.current.value = '';
    } else {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both a name and contact information for the manager.',
      });
    }
  };

  const handleRemoveManager = (managerId: string) => {
    setManagers(managers.filter(m => m.id !== managerId));
  }


  if (driveCreated) {
    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
             <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Your Drive is Live!</h1>
                <p className="text-muted-foreground">Share this link to start collecting contributions for your milestone drive.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Share2 /> Share Your Drive</CardTitle>
                    <CardDescription>Use this link to invite members, friends, and family to contribute to your cause.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Input value={shareableLink} readOnly />
                        <Button onClick={handleCopy} size="icon">
                            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                     <div className="flex gap-4">
                        <Button className='w-full' asChild>
                            <Link href={`/crowdfunding`}>
                                Go to Drives Dashboard
                            </Link>
                        </Button>
                        <Button variant="secondary" className='w-full' asChild>
                             <Link href={shareableLink} target="_blank">
                                Preview Drive Page
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Start a New Milestone Drive</h1>
        <p className="text-muted-foreground">Create a campaign to raise funds for a specific goal for your community or business.</p>
      </div>

       <Alert className="bg-blue-900/30 border-blue-500/50 text-blue-200">
        <DollarSign className="h-4 w-4 !text-blue-300" />
        <AlertTitle className="font-bold text-blue-200">Platform Fees</AlertTitle>
        <AlertDescription>
          Registration is free! A standard platform fee of <strong>4.25%</strong> is deducted from the total amount raised. Standard mobile money provider fees may also apply upon withdrawal.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Drive Details</CardTitle>
            <CardDescription>This information will be publicly visible on the milestone drive page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="drive-title">Drive Title</Label>
              <Input id="drive-title" name="drive-title" placeholder="e.g., Build a New Community Library" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drive-description">Description</Label>
              <Textarea
                id="drive-description"
                placeholder="Tell the story behind your drive. Why is it important? What impact will it have?"
                className="min-h-[120px]"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="funding-goal">Funding Goal</Label>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="KES">
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KES">KES</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input id="funding-goal" type="number" placeholder="500000" required className="flex-1"/>
                    </div>
                </div>
               <div className="space-y-2">
                <Label htmlFor="drive-image">Cover Image URL</Label>
                 <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    <Input id="drive-image" placeholder="https://images.unsplash.com/..."/>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users /> Campaign Managers</CardTitle>
                <CardDescription>Add external managers who can be contacted for assistance. Their details will be public.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="manager-name">Manager Name</Label>
                        <Input id="manager-name" placeholder="e.g., John Doe" ref={newManagerNameRef} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="manager-contact">Contact Info</Label>
                        <div className="flex gap-2">
                            <Select defaultValue="Phone" onValueChange={(v) => setNewManagerContactType(v as 'Phone' | 'Email')}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Phone">Phone</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input id="manager-contact" placeholder="e.g., 0712345678" ref={newManagerContactInfoRef} className="flex-1" />
                        </div>
                    </div>
                </div>
                <Button type="button" variant="outline" onClick={handleAddManager}>
                    <Plus className="mr-2 h-4 w-4" /> Add Manager
                </Button>

                {managers.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                         <Label>Current Managers</Label>
                         <div className="flex flex-wrap gap-2">
                            {managers.map(manager => (
                                <Badge key={manager.id} variant="secondary" className="flex items-center gap-2">
                                    <span className="font-normal">{manager.contactType === 'Phone' ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}</span>
                                    <span>{manager.name} ({manager.contactInfo})</span>
                                    <button type="button" onClick={() => handleRemoveManager(manager.id)} className="rounded-full hover:bg-muted-foreground/20">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                         </div>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Payout & Contribution Details</CardTitle>
                <CardDescription>Specify where funds should be collected and how you will withdraw them.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Banknote className="text-primary"/> M-Pesa Paybill / Till</h4>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="mpesa-paybill">Paybill Number</Label>
                            <Input id="mpesa-paybill" placeholder="e.g., 888880" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="mpesa-account">Account Number / Till Number</Label>
                            <Input id="mpesa-account" placeholder="e.g., DRIVE01 or 123456" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Phone className="text-primary"/> M-Pesa (Send Money)</h4>
                    <div className="space-y-2">
                        <Label htmlFor="mpesa-send-money">M-Pesa Phone Number</Label>
                        <Input id="mpesa-send-money" placeholder="e.g., 0712345678" />
                    </div>
                </div>
                
                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Phone className="text-primary"/> Airtel Money</h4>
                    <div className="space-y-2">
                        <Label htmlFor="airtel-money">Airtel Money Number</Label>
                        <Input id="airtel-money" placeholder="e.g., 0733123456" />
                    </div>
                </div>
                
                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Phone className="text-primary"/> Equitel</h4>
                    <div className="space-y-2">
                        <Label htmlFor="equitel-money">Equitel Number</Label>
                        <Input id="equitel-money" placeholder="e.g., 0763123456" />
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Phone className="text-primary"/> T-Kash</h4>
                    <div className="space-y-2">
                        <Label htmlFor="tkash-money">T-Kash Number</Label>
                        <Input id="tkash-money" placeholder="e.g., 0709123456" />
                    </div>
                </div>

                 <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Landmark className="text-primary"/> Bank Account (PesaLink)</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="bank-account">Bank Account Number</Label>
                            <Input id="bank-account" placeholder="e.g., 011234567890" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bank-name">Bank Name</Label>
                            <Input id="bank-name" placeholder="e.g., KCB Bank" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Drive...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Launch Drive & Get Link
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
