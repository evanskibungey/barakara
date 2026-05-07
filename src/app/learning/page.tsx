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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Award, BookCopy, CheckCircle, Download, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  progress?: number;
  completed_at?: string;
  enrollment?: { progress: number; completed_at?: string };
}

interface Certificate {
  id: number;
  issued_at: string;
  course: { id: number; title: string; category: string };
}

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<Course[]>('/courses'),
      apiFetch<Certificate[]>('/certificates'),
    ]).then(([coursesRes, certsRes]) => {
      if (coursesRes.status === 'success' && coursesRes.data) setCourses(coursesRes.data);
      if (certsRes.status === 'success' && certsRes.data) setCertificates(certsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const getProgress = (course: Course) => course.enrollment?.progress ?? course.progress ?? 0;
  const completed = courses.filter((c) => getProgress(c) === 100);
  const inProgress = courses.filter((c) => getProgress(c) > 0 && getProgress(c) < 100);
  const lastInProgress = inProgress[0];

  const categories = ['All', ...new Set(courses.map((c) => c.category))];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Learning Hub</h1>
        <p className="text-muted-foreground">Empower yourself with financial knowledge and skills.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed.length}</div>
            <p className="text-xs text-muted-foreground">Out of {courses.length} total courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">Digital certificates unlocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses In Progress</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress.length}</div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">In the catalog</p>
          </CardContent>
        </Card>
      </div>

      {lastInProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Continue Learning</CardTitle>
            <CardDescription>You're almost there! Keep up the momentum.</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold font-headline">{lastInProgress.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{lastInProgress.description}</p>
            <div className="flex justify-between w-full text-xs text-muted-foreground mt-4">
              <span>Progress</span>
              <span>{getProgress(lastInProgress)}%</span>
            </div>
            <Progress value={getProgress(lastInProgress)} className="w-full h-2 mt-1" />
          </CardContent>
          <CardFooter>
            <Button className="w-full">Resume Course</Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="courses">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Course Catalog</TabsTrigger>
          <TabsTrigger value="certificates">My Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Course Catalog</CardTitle>
                  <CardDescription>
                    Browse our curated list of courses to enhance your financial literacy.
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
                </div>
              ) : (
                <Tabs defaultValue="All">
                  <TabsList className="mb-4 flex-wrap h-auto">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {categories.map((category) => (
                    <TabsContent key={category} value={category}>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses
                          .filter((c) => category === 'All' || c.category === category)
                          .map((course) => {
                            const progress = getProgress(course);
                            return (
                              <Card key={course.id} className="flex flex-col overflow-hidden">
                                <CardContent className="flex-grow p-6 space-y-3">
                                  <Badge variant="secondary" className="w-fit">
                                    {course.category}
                                  </Badge>
                                  <h3 className="text-lg font-bold font-headline">{course.title}</h3>
                                  <p className="text-sm text-muted-foreground">{course.description}</p>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-2 p-6 pt-0">
                                  {progress > 0 ? (
                                    <>
                                      <div className="flex justify-between w-full text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{progress}%</span>
                                      </div>
                                      <Progress value={progress} className="w-full h-2" />
                                      <Button className="w-full mt-2">Continue Learning</Button>
                                    </>
                                  ) : (
                                    <Button className="w-full mt-2">Start Course</Button>
                                  )}
                                </CardFooter>
                              </Card>
                            );
                          })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
              <CardDescription>
                You have earned {certificates.length} certificates. Well done!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.course.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cert.course.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(cert.issued_at).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          View Certificate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {certificates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        Complete a course to earn your first certificate!
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
