// Centralized fetcher for SWR with error handling and authentication
import { authenticatedFetch } from './auth-cookies';

export interface FetcherError extends Error {
  info?: any;
  status?: number;
}

/**
 * Default fetcher for SWR that handles authentication and errors
 */
export const fetcher = async (url: string): Promise<any> => {
  try {
    const response = await authenticatedFetch(url);
    
    // If the response is not ok, throw an error that SWR can handle
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.') as FetcherError;
      
      // Try to get error details from response
      try {
        error.info = await response.json();
      } catch {
        error.info = { message: 'Unknown error' };
      }
      
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    // Re-throw the error so SWR can handle it
    throw error;
  }
};

/**
 * Fetcher for public endpoints that don't require authentication
 */
export const publicFetcher = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.') as FetcherError;
      
      try {
        error.info = await response.json();
      } catch {
        error.info = { message: 'Unknown error' };
      }
      
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * POST fetcher for SWR mutations
 */
export const postFetcher = async (url: string, { arg }: { arg: any }): Promise<any> => {
  try {
    const response = await authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(arg),
    });

    if (!response.ok) {
      const error = new Error('An error occurred while posting the data.') as FetcherError;
      
      try {
        error.info = await response.json();
      } catch {
        error.info = { message: 'Unknown error' };
      }
      
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * PUT fetcher for SWR mutations
 */
export const putFetcher = async (url: string, { arg }: { arg: any }): Promise<any> => {
  try {
    const response = await authenticatedFetch(url, {
      method: 'PUT',
      body: JSON.stringify(arg),
    });

    if (!response.ok) {
      const error = new Error('An error occurred while updating the data.') as FetcherError;
      
      try {
        error.info = await response.json();
      } catch {
        error.info = { message: 'Unknown error' };
      }
      
      error.status = response.status;
      throw error;
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE fetcher for SWR mutations
 */
export const deleteFetcher = async (url: string): Promise<any> => {
  try {
    const response = await authenticatedFetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = new Error('An error occurred while deleting the data.') as FetcherError;
      
      try {
        error.info = await response.json();
      } catch {
        error.info = { message: 'Unknown error' };
      }
      
      error.status = response.status;
      throw error;
    }

    // DELETE might return empty response
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw error;
  }
};

/**
 * Get API URL from environment variables
 */
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};

/**
 * Build full API endpoint URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
