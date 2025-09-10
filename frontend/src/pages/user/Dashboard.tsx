import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSessions } from '@/api/classes';
import { useBookSession } from '@/api/bookings';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { parseISO, format } from 'date-fns';

export const Dashboard = () => {
  const { data: sessions, isLoading } = useSessions();
  const bookSession = useBookSession();

  const handleBookSession = (sessionId: string) => {
    bookSession.mutate({ sessionId });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">Available Classes</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Available Classes</h1>
          <p className="text-muted-foreground">
            Discover and book your next fitness adventure
          </p>
        </div>

        {!sessions || sessions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No sessions available</h3>
              <p className="text-muted-foreground">
                Check back later for new class schedules, or contact us to suggest a class!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => {
              const isFullyBooked = session.bookedCount >= session.capacity;
              const availableSpots = session.capacity - session.bookedCount;

              return (
                <Card
                  key={session.id}
                  className="group hover:shadow-elegant transition-all duration-300 border-border/50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {session.className}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          with {session.instructor}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={isFullyBooked ? "destructive" : "secondary"}
                      >
                        {availableSpots} spots left
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {session.date
                        ? format(parseISO(session.date), "EEEE, MMMM d")
                        : "N/A"}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {session.time || "N/A"}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {session.bookedCount} / {session.capacity} enrolled
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={isFullyBooked || bookSession.isPending}
                      onClick={() => handleBookSession(session.id)}
                    >
                      {bookSession.isPending
                        ? "Booking..."
                        : isFullyBooked
                        ? "Fully Booked"
                        : "Book Session"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};