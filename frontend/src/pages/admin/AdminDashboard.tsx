import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useClasses, useCreateClass, useSessions, useCreateSession } from '@/api/classes';
import { Plus, Calendar, Users, Settings } from 'lucide-react';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: classes } = useClasses();
  const { data: sessions } = useSessions();
  const createClass = useCreateClass();
  const createSession = useCreateSession();

  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    duration: 60
  });

  const [sessionForm, setSessionForm] = useState({
    classId: '',
    date: '',
    time: '',
    capacity: 20,
    instructor: ''
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    createClass.mutate(classForm, {
      onSuccess: () => {
        setClassForm({ name: '', description: '', duration: 60 });
      }
    });
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    createSession.mutate(sessionForm, {
      onSuccess: () => {
        setSessionForm({
          classId: '',
          date: '',
          time: '',
          capacity: 20,
          instructor: ''
        });
      }
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage classes, sessions, and bookings
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Admin Panel</span>
          </div>
        </div>

        <Tabs defaultValue="create-class" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create-class">Create Class</TabsTrigger>
            <TabsTrigger value="create-session">Create Session</TabsTrigger>
            <TabsTrigger value="sessions">Manage Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="create-class">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Class
                </CardTitle>
                <CardDescription>
                  Add a new class type to your program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateClass} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input
                        id="className"
                        value={classForm.name}
                        onChange={(e) =>
                          setClassForm({ ...classForm, name: e.target.value })
                        }
                        placeholder="e.g., Yoga Flow, HIIT Training"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={classForm.duration}
                        onChange={(e) =>
                          setClassForm({
                            ...classForm,
                            duration: parseInt(e.target.value),
                          })
                        }
                        min="15"
                        max="180"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={classForm.description}
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the class, its benefits, and what participants can expect..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={createClass.isPending}>
                    {createClass.isPending ? "Creating..." : "Create Class"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-session">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule New Session
                </CardTitle>
                <CardDescription>
                  Schedule a session for an existing class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSession} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="classSelect">Select Class</Label>
                      <Select
                        value={sessionForm.classId}
                        onValueChange={(value) =>
                          setSessionForm({ ...sessionForm, classId: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes?.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              {cls.name} ({cls.duration} min)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructor">Instructor</Label>
                      <Input
                        id="instructor"
                        value={sessionForm.instructor}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            instructor: e.target.value,
                          })
                        }
                        placeholder="Instructor name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={sessionForm.date}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={sessionForm.time}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            time: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={sessionForm.capacity}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            capacity: parseInt(e.target.value),
                          })
                        }
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={createSession.isPending}>
                    {createSession.isPending
                      ? "Scheduling..."
                      : "Schedule Session"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Session Management
                </CardTitle>
                <CardDescription>
                  View and manage all scheduled sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!sessions || sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No sessions scheduled
                    </h3>
                    <p className="text-muted-foreground">
                      Create your first session using the "Create Session" tab
                      above.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => {
                        // Combine date + time into a Date object safely
                        let sessionDate: Date | null = null;
                        try {
                          sessionDate = new Date(
                            `${session.date}T${session.time}:00`
                          );
                          if (isNaN(sessionDate.getTime())) sessionDate = null;
                        } catch {
                          sessionDate = null;
                        }

                        const isPastSession = sessionDate
                          ? sessionDate < new Date()
                          : false;
                        const isFullyBooked =
                          session.bookedCount >= session.capacity;

                        return (
                          <TableRow
                            key={session.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              navigate(`/admin/sessions/${session.id}`)
                            }
                          >
                            <TableCell className="font-medium">
                              {session.className}
                            </TableCell>
                            <TableCell>
                              {sessionDate ? (
                                <div>
                                  <div>
                                    {format(sessionDate, "MMM d, yyyy")}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {format(sessionDate, "HH:mm")}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-red-500">
                                  Invalid Date
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{session.instructor}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span>
                                  {session.bookedCount} / {session.capacity}
                                </span>
                                <div className="w-16 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{
                                      width: `${
                                        (session.bookedCount /
                                          session.capacity) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  isPastSession
                                    ? "secondary"
                                    : isFullyBooked
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {isPastSession
                                  ? "Completed"
                                  : isFullyBooked
                                  ? "Full"
                                  : "Available"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};