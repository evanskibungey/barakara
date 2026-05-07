
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
import { useEffect } from 'react';
import { apiFetch } from '@/lib/api';
const learningCourses: any[] = [];
import { Book, FilePlus, Image as ImageIcon, PlusCircle } from 'lucide-react';

export default function NewCoursePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Create New Course
        </h1>
        <p className="text-muted-foreground">
          Build a new course by adding modules, lessons, and quizzes.
        </p>
      </div>

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
                  placeholder="e.g., Advanced Investment Strategies"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-description">Course Description</Label>
                <Textarea
                  id="course-description"
                  placeholder="A brief summary of what this course is about."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-category">Category</Label>
                  <Select>
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
                        <Input id="course-image" placeholder="https://..."/>
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
                        <p className="text-xs text-muted-foreground">No template selected.</p>
                    </div>
                    <Button variant="outline" className="w-full">Edit Template</Button>
                    <Button variant="secondary" className="w-full">Preview Certificate</Button>
                </CardContent>
            </Card>
             <Button className="w-full"><FilePlus className="mr-2 h-4 w-4" /> Create Course</Button>
        </div>
      </div>
    </div>
  );
}
