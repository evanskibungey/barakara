
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
const awards: any[] = [];
import { FilePlus, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewAwardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Create New Award
        </h1>
        <p className="text-muted-foreground">
          Define a new award template that can be issued to members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Award Details</CardTitle>
          <CardDescription>
            Provide the information for your new award template.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="award-title">Award Title</Label>
            <Input
              id="award-title"
              placeholder="e.g., Top Contributor"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="award-description">Award Description</Label>
            <Textarea
              id="award-description"
              placeholder="A brief summary of what this award recognizes."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="award-category">Category</Label>
              <Select>
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
                <p className="text-muted-foreground mb-4">No certificate template designed yet.</p>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Design Template</Button>
            </div>
        </CardContent>
      </Card>
      
       <div className="flex gap-2">
            <Button className="w-full" asChild>
                <Link href="/management/awards">Cancel</Link>
            </Button>
            <Button className="w-full"><FilePlus className="mr-2 h-4 w-4" /> Create Award</Button>
       </div>
    </div>
  );
}
