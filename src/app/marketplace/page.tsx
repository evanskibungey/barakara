'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Search, Store, ShoppingBag, Users, Tag, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { apiFetch, PaginatedData, extractRows } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Business {
  id: number;
  name: string;
  category: string;
  description?: string;
  location: string;
  phone?: string;
  email?: string;
  image_url?: string;
  owner?: { name: string };
}

export default function MarketplacePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryFilter !== 'All Categories') params.set('category', categoryFilter);
    apiFetch<PaginatedData<Business>>(`/businesses?${params}`)
      .then((res) => {
        if (res.status === 'success' && res.data) setBusinesses(extractRows(res.data));
      })
      .finally(() => setLoading(false));
  }, [search, categoryFilter]);

  const categories = ['All Categories', ...new Set(businesses.map((b) => b.category))];
  const uniqueMembers = new Set(businesses.map((b) => b.owner?.name)).size;
  const uniqueCategories = new Set(businesses.map((b) => b.category)).size;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
          <Store className="h-8 w-8" />
          Member Marketplace
        </h1>
        <p className="text-muted-foreground">
          Discover and support businesses owned by your fellow Chama members.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">Listed on the marketplace</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueMembers}</div>
            <p className="text-xs text-muted-foreground">Members with businesses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCategories}</div>
            <p className="text-xs text-muted-foreground">Business categories available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Register Business</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">Add Listing</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Local Businesses</CardTitle>
              <CardDescription>Browse services and products offered by members near you.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((biz) => (
                <Card key={biz.id} className="flex flex-col overflow-hidden">
                  <CardContent className="flex-grow p-4 space-y-2">
                    <Badge variant="secondary" className="w-fit">{biz.category}</Badge>
                    <h3 className="text-lg font-bold font-headline">{biz.name}</h3>
                    {biz.owner && (
                      <p className="text-sm text-muted-foreground">
                        Owned by:{' '}
                        <span className="font-medium text-foreground">{biz.owner.name}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{biz.location}</span>
                    </div>
                    {biz.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{biz.description}</p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Visit Storefront</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback>
                                {biz.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <DialogTitle className="text-2xl font-headline">{biz.name}</DialogTitle>
                              {biz.owner && (
                                <DialogDescription>Owned by {biz.owner.name}</DialogDescription>
                              )}
                            </div>
                          </div>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {biz.description ?? 'No description provided.'}
                          </p>
                          <div className="space-y-2">
                            {biz.phone && (
                              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <Phone className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Contact Number</p>
                                  <a href={`tel:${biz.phone}`} className="font-semibold hover:underline">
                                    {biz.phone}
                                  </a>
                                </div>
                              </div>
                            )}
                            {biz.email && (
                              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <Mail className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Email Address</p>
                                  <a href={`mailto:${biz.email}`} className="font-semibold hover:underline">
                                    {biz.email}
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
              {businesses.length === 0 && (
                <div className="col-span-3 text-center text-muted-foreground py-8">
                  No businesses found.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
