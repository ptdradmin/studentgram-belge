import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/lib/i18n';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </LanguageProvider>
);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when authentication is loading', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      profile: null,
      loading: true,
    });

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByText('Vérification de l\'authentification...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    });

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('renders children when user is authenticated and no roles required', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      profile: { id: '1', role: 'user' },
      loading: false,
    });

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children when user has required role', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '1', email: 'admin@example.com' },
      profile: { id: '1', role: 'admin' },
      loading: false,
    });

    render(
      <TestWrapper>
        <ProtectedRoute allowedRoles={['admin']}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects to home when user does not have required role', async () => {
    (useAuth as any).mockReturnValue({
      user: { id: '1', email: 'user@example.com' },
      profile: { id: '1', role: 'user' },
      loading: false,
    });

    render(
      <TestWrapper>
        <ProtectedRoute allowedRoles={['admin']}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('allows access for multiple allowed roles', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '1', email: 'mod@example.com' },
      profile: { id: '1', role: 'moderator' },
      loading: false,
    });

    render(
      <TestWrapper>
        <ProtectedRoute allowedRoles={['admin', 'moderator']}>
          <div>Moderator Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    expect(screen.getByText('Moderator Content')).toBeInTheDocument();
  });

  it('uses custom redirect path', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    });

    render(
      <TestWrapper>
        <ProtectedRoute redirectTo="/custom-login">
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/custom-login', { replace: true });
    });
  });

  it('handles user without profile gracefully', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      profile: null,
      loading: false,
    });

    render(
      <TestWrapper>
        <ProtectedRoute allowedRoles={['admin']}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </TestWrapper>
    );

    // Should default to 'user' role and redirect since 'user' is not in ['admin']
    waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
