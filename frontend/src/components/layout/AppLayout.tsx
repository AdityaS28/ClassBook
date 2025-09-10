import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authStorage, isAdmin } from '@/lib/auth';
import { useLogout } from '@/api/auth';
import { LogOut, User, Calendar, Settings } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const user = authStorage.getUser();
  const userIsAdmin = isAdmin();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate(userIsAdmin ? '/admin/dashboard' : '/dashboard')}
              >
                ClassBook
              </h1>
              
              <nav className="hidden md:flex space-x-6">
                {userIsAdmin ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/admin/dashboard')}
                      className="text-sm font-medium"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/dashboard')}
                      className="text-sm font-medium"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Classes
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/bookings')}
                      className="text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Bookings
                    </Button>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.firstName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};