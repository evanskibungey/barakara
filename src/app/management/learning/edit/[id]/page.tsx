
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Image as ImageIcon, Book, PlusCircle, FilePlus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams, notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
const learningCourses: any[] = [];
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function EditCoursePage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const course = learningCourses.find(d => d.id === params.id);

  if (!course) {
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
        title: "Course Updated Successfully!",
        description: "The course details have been saved.",
      });
      router.push(`/management/learning`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-muted-foreground">Update the details for "{course.title}".</p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/management/learning"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses</Link>
        </Button>
      </div>

       <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                    Provide the basic information for your new course.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="course-title">Course Title</Label>
                    <Input
                    id="course-title"
                    defaultValue={course.title}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="course-description">Course Description</Label>
                    <Textarea
                    id="course-description"
                    defaultValue={course.description}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="course-category">Category</Label>
                    <Select defaultValue={course.category}>
                        <SelectTrigger id="course-category">
                        <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                        {[
                            ...new Set(learningCourses.map(c => c.category)),
                        ].map(cat => (
                            <SelectItem key={cat} value={cat}>
                            {cat}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="course-image">Cover Image URL</Label>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            <Input id="course-image" defaultValue={course.image?.imageUrl} />
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Book /> Course Content</CardTitle>
                <CardDescription>
                    Add the lessons that make up this course.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border border-dashed rounded-lg p-6 text-center">
                        <p className="text-muted-foreground mb-4">No lessons added yet.</p>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Lesson</Button>
                    </div>
                </CardContent>
            </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Certificate</CardTitle>
                        <CardDescription>Manage the completion certificate for this course.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border border-dashed rounded-lg p-4 text-center">
                            <p className="text-xs text-muted-foreground">Default Template</p>
                        </div>
                        <Button variant="outline" className="w-full">Edit Template</Button>
                        <Button variant="secondary" className="w-full">Preview Certificate</Button>
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
            </div>
        </div>
      </form>
    </div>
  );
}
