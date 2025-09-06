import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RoleBasedRouteProps {
  children: ReactNode;
  requiredRole: string;
  fallbackComponent?: ReactNode;
}

/**
 * RoleBasedRoute component for fine-grained role-based access control
 * 
 * Usage examples:
 * - <RoleBasedRoute requiredRole="admin">Admin Panel</RoleBasedRoute>
 * - <RoleBasedRoute requiredRole="moderator">Moderation Tools</RoleBasedRoute>
 * - <RoleBasedRoute requiredRole="verified">Verified User Features</RoleBasedRoute>
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackComponent
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return (
      <Alert className="border-destructive bg-destructive/10">
        <Shield className="h-4 w-4 text-destructive" />
        <AlertDescription>
          Vous devez être connecté pour accéder à cette fonctionnalité.
        </AlertDescription>
      </Alert>
    );
  }

  // Check user role
  const userRole = profile?.role || 'user';
  const hasRequiredRole = userRole === requiredRole || userRole === 'admin'; // Admin has access to everything

  if (!hasRequiredRole) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="space-y-3">
          <div>
            <p className="font-medium text-yellow-800">Accès restreint</p>
            <p className="text-yellow-700">
              Cette fonctionnalité nécessite le rôle "{requiredRole}". 
              Votre rôle actuel est "{userRole}".
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // User has required role, render children
  return <>{children}</>;
};

export default RoleBasedRoute;
