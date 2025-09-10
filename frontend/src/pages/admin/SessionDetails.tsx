import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useSessionById } from '@/api/classes';
import { useSessionBookings } from '@/api/bookings';
import { ArrowLeft, Calendar, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export const SessionDetails = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading } = useSessionById(sessionId!);
  const { data: bookings, isLoading: bookingsLoading } = useSessionBookings(sessionId!);

  if (sessionLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="animate-pulse">
            <Card>
              <CardHeader>
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!session) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Session not found</h3>
              <p className="text-muted-foreground">
                The session you're looking for doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // ✅ Combine date + time into a single Date object
  const sessionDateTime = new Date(`${session.date}T${session.time}`);
  const isFullyBooked = session.bookedCount >= session.capacity;
  const isPastSession = sessionDateTime < new Date();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Session Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{session.className}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  with {session.instructor}
                </CardDescription>
              </div>
              <Badge
                variant={
                  isPastSession ? 'secondary' : isFullyBooked ? 'destructive' : 'default'
                }
              >
                {isPastSession ? 'Completed' : isFullyBooked ? 'Fully Booked' : 'Available'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date & Time
                </div>
                <p className="font-medium">
                  {format(sessionDateTime, 'EEEE, MMMM d, yyyy h:mm a')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Capacity
                </div>
                <p className="font-medium">
                  {session.bookedCount} / {session.capacity} enrolled
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(session.bookedCount / session.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings ({session.bookedCount})</CardTitle>
            <CardDescription>Participants enrolled in this session</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : !bookings || bookings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground">
                  This session doesn't have any bookings yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Booked On</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        Participant #{booking.userId.slice(-4)}
                      </TableCell>
                      <TableCell>
                        user{booking.userId.slice(-4)}@example.com
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.bookedAt), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === 'CANCELLED'
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
