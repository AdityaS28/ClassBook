import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ClassBook
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Book your perfect class experience
              </p>
            </div>

            {/* Auth Form */}
            <div className="bg-card shadow-elegant rounded-xl border border-border/50 p-8 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};