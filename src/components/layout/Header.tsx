
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'employer') {
      return '/employer/dashboard';
    }
    return '/dashboard';
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">JobConnect</span>
        </Link>

        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {user?.role === 'jobseeker' ? (
            <Link to="/dashboard" className="transition-colors hover:text-foreground/80">
              Find Jobs
            </Link>
          ) : user?.role === 'employer' ? (
            <>
              <Link to="/employer/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link to="/employer/post-job" className="transition-colors hover:text-foreground/80">
                Post Job
              </Link>
            </>
          ) : (
            <Link to="/jobs" className="transition-colors hover:text-foreground/80">
              Jobs
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NotificationBell />
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
