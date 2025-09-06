import * as Sentry from '@sentry/react';

// Sentry configuration for error tracking and performance monitoring
export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',
    
    // Performance monitoring
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Debug mode for development
    debug: import.meta.env.MODE === 'development',
    
    // Capture unhandled promise rejections
    captureUnhandledRejections: true,
    
    // Filter out common noise
    beforeSend(event) {
      // Filter out development errors
      if (import.meta.env.MODE === 'development') {
        return event;
      }
      
      // Filter out network errors that are not actionable
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'NetworkError' || error?.value?.includes('fetch')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Add user context
    initialScope: {
      tags: {
        component: 'StudentGram',
      },
    },
  });
};

// Custom error boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Custom hooks for error tracking
export const useSentryUser = () => {
  const setUser = (user: { id: string; email?: string; username?: string }) => {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  };

  const clearUser = () => {
    Sentry.setUser(null);
  };

  return { setUser, clearUser };
};

// Performance monitoring utilities
export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({ name, op });
};

// Custom error capture with context
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
};

// Breadcrumb utilities for debugging
export const addBreadcrumb = (message: string, category: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
};
