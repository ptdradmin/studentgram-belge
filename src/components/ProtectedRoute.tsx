import React, { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { AuthLoader } from '@/components/PageLoader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

/**
 * ProtectedRoute component that acts as a guard for private pages
 * 
 * Features:
 * - Prevents flash of incorrect content
 * - Handles loading states elegantly
 * - Supports role-based access control (RBAC)
 * - Automatic redirection for unauthorized users
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectTo = '/login'
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't do anything while authentication state is loading
    if (loading) {
      return;
    }

    // If user is not authenticated, redirect to login
    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // If roles are specified, check if user has the required role
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = profile?.role || 'user'; // Default role if not specified
      const isAuthorized = allowedRoles.includes(userRole);
      
      if (!isAuthorized) {
        // Redirect to home page or unauthorized page
        navigate('/', { replace: true });
        return;
      }
    }
  }, [user, profile, loading, navigate, allowedRoles, redirectTo]);

  // Determine if content can be rendered
  const canRender = !loading && user && (!allowedRoles || allowedRoles.length === 0 || 
    (profile && allowedRoles.includes(profile.role || 'user')));

  // Show loading spinner while checking authentication
  if (loading) {
    return <AuthLoader />;
  }

  // Render content if user is authorized
  if (canRender) {
    return <>{children}</>;
  }

  // Show loading while redirect is happening
  return <AuthLoader />;
};

export default ProtectedRoute;
