import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message, 
  size = 'md',
  fullScreen = true 
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Spinner */}
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
          
          {/* Pulsing ring effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-primary/20 animate-pulse`} />
        </div>
        
        {/* Loading message */}
        {message && (
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Specialized loaders for different contexts
export const AuthLoader: React.FC = () => (
  <PageLoader 
    message={useTranslation().t('verifying_authentication')} 
    size="md"
  />
);

export const RouteLoader: React.FC = () => (
  <PageLoader 
    message={useTranslation().t('loading_page')} 
    size="lg"
  />
);

export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => (
  <PageLoader 
    message={message} 
    size="sm" 
    fullScreen={false}
  />
);

// Loading overlay for forms and modals
export const LoadingOverlay: React.FC<{ isVisible: boolean; message?: string }> = ({ 
  isVisible, 
  message 
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-lg z-10">
      <PageLoader message={message} size="md" fullScreen={false} />
    </div>
  );
};

export default PageLoader;
