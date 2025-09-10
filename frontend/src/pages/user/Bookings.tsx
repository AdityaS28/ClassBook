import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMyBookings, useCancelBooking } from '@/api/bookings';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

export const Bookings = () => {
  const { data: bookings, isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking.mutate(bookingId);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
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
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your upcoming and past class bookings
          </p>
        </div>

        {!bookings || bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't booked any classes yet. Start exploring our available sessions!
              </p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Browse Classes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const isPastSession = new Date(booking.session.date + ' ' + booking.session.time) < new Date();
              const isCancelled = booking.status === 'CANCELLED';

              return (
                <Card key={booking.id} className="hover:shadow-elegant transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {booking.session.className}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          with {booking.session.instructor}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          isCancelled ? "destructive" : 
                          isPastSession ? "secondary" : 
                          "default"
                        }
                      >
                        {isCancelled ? 'Cancelled' : isPastSession ? 'Completed' : 'Confirmed'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(booking.session.date), 'EEEE, MMMM d')}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {booking.session.time}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Booked on {format(new Date(booking.bookedAt), 'MMM d, yyyy')}
                    </div>
                  </CardContent>
                  
                  {!isCancelled && !isPastSession && (
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={cancelBooking.isPending}
                        onClick={() => handleCancelBooking(booking.session.id)}
                      >
                        {cancelBooking.isPending ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};