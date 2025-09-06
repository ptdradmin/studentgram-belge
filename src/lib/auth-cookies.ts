// Cookie-based authentication utilities for secure token storage
// This replaces localStorage token storage with HttpOnly cookies

export interface CookieAuthConfig {
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number; // in seconds
}

const defaultConfig: CookieAuthConfig = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

/**
 * Set authentication token as HttpOnly cookie
 * This should be called from the backend API after successful authentication
 */
export const setAuthCookie = (
  token: string, 
  refreshToken?: string,
  config: CookieAuthConfig = {}
): string => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const cookieOptions = [
    `Max-Age=${finalConfig.maxAge}`,
    `SameSite=${finalConfig.sameSite}`,
    'HttpOnly',
    'Path=/',
  ];

  if (finalConfig.secure) {
    cookieOptions.push('Secure');
  }

  if (finalConfig.domain) {
    cookieOptions.push(`Domain=${finalConfig.domain}`);
  }

  const authCookie = `auth_token=${token}; ${cookieOptions.join('; ')}`;
  
  let refreshCookie = '';
  if (refreshToken) {
    refreshCookie = `refresh_token=${refreshToken}; ${cookieOptions.join('; ')}`;
  }

  return refreshToken ? `${authCookie}\n${refreshCookie}` : authCookie;
};

/**
 * Clear authentication cookies
 * This should be called from the backend API during logout
 */
export const clearAuthCookies = (): string => {
  const expiredOptions = [
    'Max-Age=0',
    'Path=/',
    'HttpOnly',
  ];

  const clearAuth = `auth_token=; ${expiredOptions.join('; ')}`;
  const clearRefresh = `refresh_token=; ${expiredOptions.join('; ')}`;

  return `${clearAuth}\n${clearRefresh}`;
};

/**
 * Frontend fetch wrapper that automatically includes credentials for cookie-based auth
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultOptions: RequestInit = {
    credentials: 'include', // This ensures cookies are sent with requests
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    
    // Handle token refresh if needed
    if (response.status === 401) {
      // Token might be expired, try to refresh
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (refreshResponse.ok) {
        // Retry original request after successful refresh
        return fetch(url, finalOptions);
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
    }
    
    return response;
  } catch (error) {
    console.error('Authenticated fetch error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated by making a request to a protected endpoint
 * Since we can't access HttpOnly cookies from JavaScript, we need to verify via API
 */
export const checkAuthStatus = async (): Promise<{
  isAuthenticated: boolean;
  user?: any;
  error?: string;
}> => {
  try {
    const response = await authenticatedFetch('/api/auth/me');
    
    if (response.ok) {
      const user = await response.json();
      return { isAuthenticated: true, user };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    return { 
      isAuthenticated: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Sign in with email and password using cookie-based authentication
 */
export const signInWithCookies = async (
  email: string, 
  password: string
): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> => {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'Sign in failed' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

/**
 * Sign up with user data using cookie-based authentication
 */
export const signUpWithCookies = async (
  email: string,
  password: string,
  userData: any
): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, ...userData }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'Sign up failed' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

/**
 * Sign out using cookie-based authentication
 */
export const signOutWithCookies = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.error || 'Sign out failed' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

/**
 * Migration utility to help transition from localStorage to cookies
 * This can be used temporarily during the transition period
 */
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
      console.log('Found token in localStorage, migrating to cookie-based auth...');
      
      // Validate the token with the backend
      const response = await fetch('/api/auth/migrate', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        // Clear localStorage after successful migration
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.refreshToken');
        console.log('Successfully migrated to cookie-based auth');
      }
    }
  } catch (error) {
    console.error('Migration from localStorage failed:', error);
  }
};
