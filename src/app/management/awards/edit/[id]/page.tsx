
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams, notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
const awards: any[] = [];
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function EditAwardPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const award = awards.find(d => d.id === params.id);

  if (!award) {
    notFound();
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Award Updated Successfully!",
        description: "The award template details have been saved.",
      });
      router.push(`/management/awards`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Award Template</h1>
            <p className="text-muted-foreground">Update the details for "{award.title}".</p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/management/awards"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Awards</Link>
        </Button>
      </div>

       <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Award Details</CardTitle>
                <CardDescription>
                    Modify the information for this award template.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="award-title">Award Title</Label>
                    <Input
                        id="award-title"
                        defaultValue={award.title}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="award-description">Award Description</Label>
                    <Textarea
                        id="award-description"
                        defaultValue={award.description}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="award-category">Category</Label>
                    <Select defaultValue={award.category}>
                        <SelectTrigger id="award-category">
                        <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                        {[
                            ...new Set(awards.map(c => c.category)),
                        ].map(cat => (
                            <SelectItem key={cat} value={cat}>
                            {cat}
                            </SelectItem>
                        ))}
                        <SelectItem value="new-category">...Add New</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
      
        <Card>
            <CardHeader>
                <CardTitle>Certificate Template</CardTitle>
                <CardDescription>Design the certificate that will be issued with this award.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border border-dashed rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">A default certificate template is assigned.</p>
                    <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Customize Template</Button>
                </div>
            </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
        </Button>
      </form>
    </div>
  );
}
